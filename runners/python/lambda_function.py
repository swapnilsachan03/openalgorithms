import ast
import subprocess
import threading
import time
import traceback

import psutil

# ── Syntax Check ──────────────────────────────────────────────────────────────


def check_syntax(code: str) -> str | None:
    # Returns an error string if invalid syntax, None if clean.
    try:
        ast.parse(code)
        return None
    except SyntaxError as e:
        return f"SyntaxError on line {e.lineno}: {e.msg}"


# ── Process Execution ─────────────────────────────────────────────────────────


def execute(
    code_file: str,
    input_data: str,
    time_limit_s: int,
    memory_limit_mb: int,
) -> dict:
    # Spawn the child process
    # We don't use subprocess.run() because we need to monitor the process
    # while it's running (memory polling). Popen gives us that control.
    proc = subprocess.Popen(
        ["python3", code_file],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )

    # proc.communicate() blocks until the process exits.
    # We call it in a background thread so the main thread stays free
    # to run the memory/time monitoring loop below.
    io: dict = {"stdout": b"", "stderr": b""}

    def communicate():
        io["stdout"], io["stderr"] = proc.communicate(
            input=input_data.encode("utf-8")
        )

    thread = threading.Thread(target=communicate, daemon=True)
    thread.start()

    start = time.perf_counter()
    verdict = None  # None means "still running clean"
    max_memory_mb = 0.0

    try:
        ps_proc = psutil.Process(proc.pid)

        # Poll every 50ms while the I/O thread is alive
        while thread.is_alive():
            elapsed = time.perf_counter() - start

            # ── Time limit check ──────────────────────────────────────────────
            if elapsed > time_limit_s:
                proc.kill()
                verdict = "TIME_LIMIT_EXCEEDED"
                break

            # ── Memory limit check ────────────────────────────────────────────
            # RSS = Resident Set Size: actual physical memory the process is
            # using right now. It's the most meaningful measure for sandboxing.
            try:
                mem_mb = ps_proc.memory_info().rss / (1024 * 1024)
                max_memory_mb = max(max_memory_mb, mem_mb)

                if mem_mb > memory_limit_mb:
                    proc.kill()
                    verdict = "MEMORY_LIMIT_EXCEEDED"
                    break

            except psutil.NoSuchProcess:
                # Process exited between our poll and this check. Normal.
                break

            time.sleep(0.05)  # 50ms between checks

    except Exception:
        proc.kill()
        raise  # bubble up to main() → caught as INTERNAL_ERROR

    thread.join(timeout=2)  # wait for I/O thread to finish
    elapsed_ms = round((time.perf_counter() - start) * 1000)

    stdout = io["stdout"].decode("utf-8", errors="replace").strip()
    stderr = io["stderr"].decode("utf-8", errors="replace").strip()

    # If we didn't kill it for TLE/MLE, check the exit code
    # returncode = 0  → clean exit
    # returncode > 0  → unhandled exception (e.g. ZeroDivisionError, IndexError)
    # returncode < 0  → killed by a signal (SIGSEGV etc.)
    if verdict is None and proc.returncode != 0:
        verdict = "RUNTIME_ERROR"

    return {
        "stdout": stdout,
        "stderr": stderr[:500],  # cap stderr — don't store huge tracebacks
        "returncode": proc.returncode,
        "elapsed_ms": elapsed_ms,
        "memory_mb": round(max_memory_mb, 2),
        "verdict": verdict,  # None = process exited cleanly
    }


# ── Submission execution ──────────────────────────────────────────────────────


def handle_submission(event):
    submission_id = event["submissionId"]
    code = event["code"]
    test_cases = event["testCases"]
    time_limit_s = event["timeLimitSeconds"]
    memory_limit_mb = event["memoryLimitMB"]

    # Wrap everything in try/except so any unexpected runner crash
    # (e.g. DB connection failure, bad env var) writes INTERNAL_ERROR
    # instead of silently leaving the submission stuck in JUDGING forever.
    try:
        # ── Step 1: Syntax check ──────────────────────────────────────────────
        error = check_syntax(code)
        if error:
            print(f"[{submission_id}] COMPILATION_ERROR")
            return {
                "submissionId": submission_id,
                "verdict": "COMPILATION_ERROR",
                "results": [
                    {
                        "testCase": None,
                        "verdict": "COMPILATION_ERROR",
                        "error": error,
                    }
                ],
            }

        # ── Step 2: Write code to temp file ──────────────────────────────────
        # each invocation that doesn't reuse a warm container gets a clean one
        code_file = "/tmp/solution.py"
        with open(code_file, "w") as f:
            f.write(code)

        # ── Step 3: Run test cases ────────────────────────────────────────────
        results = []
        final_status = "ACCEPTED"
        max_memory_mb = 0.0
        max_runtime_ms = 0.0

        for i, tc in enumerate(test_cases):
            raw = execute(code_file, tc["input"], time_limit_s, memory_limit_mb)

            # Determine verdict for this test case
            if raw["verdict"] is not None:
                # Process was killed (TLE/MLE) or crashed (RE)
                verdict = raw["verdict"]
            elif raw["stdout"] == tc["output"].strip():
                verdict = "ACCEPTED"
            else:
                verdict = "WRONG_ANSWER"

            max_memory_mb = max(max_memory_mb, raw["memory_mb"])
            max_runtime_ms = max(max_runtime_ms, raw["elapsed_ms"])

            results.append(
                {
                    "testCase": i + 1,
                    "verdict": verdict,
                    "output": raw["stdout"],
                    "expected": tc["output"].strip(),
                    "stderr": raw["stderr"],
                    "runtimeMs": raw["elapsed_ms"],
                    "memoryMB": raw["memory_mb"],
                }
            )

            # Stop on first failure — same behaviour as LeetCode.
            # Remove this break if you want to run all test cases (Codeforces style).
            if verdict != "ACCEPTED":
                final_status = verdict
                break

        print(f"[{submission_id}] {final_status}")
        return {
            "submissionId": submission_id,
            "verdict": final_status,
            "results": results,
            "maxMemoryMb": round(max_memory_mb, 2),
            "maxRuntimeMs": max_runtime_ms,
        }

    except Exception:
        # This is a runner bug, not a user code bug. Return it as a normal payload
        # rather than raising — raising sets Lambda's FunctionError, which
        # your worker should reserve for actual invoke/infra failures.
        tb = traceback.format_exc()
        print(f"[{submission_id}] INTERNAL_ERROR\n{tb}")
        return {
            "submissionId": submission_id,
            "verdict": "INTERNAL_ERROR",
            "results": [
                {
                    "testCase": None,
                    "verdict": "INTERNAL_ERROR",
                    "error": tb,
                }
            ],
        }


# ── Code run execution ────────────────────────────────────────────────────────


MAX_OUTPUT_CHARS = 64 * 1024


def outputs_match(actual: str, expected: str) -> bool:
    # Ignore trailing whitespace on each line and trailing blank lines
    def norm(s: str) -> str:
        return "\n".join(
            line.rstrip() for line in s.replace("\r\n", "\n").split("\n")
        ).rstrip()

    return norm(actual) == norm(expected)


def run_result(run_id, verdict, **extra) -> dict:
    return {
        "runId": run_id,
        "verdict": verdict,
        "maxMemoryMb": extra.pop("maxMemoryMb", 0.0),
        "maxRuntimeMs": extra.pop("maxRuntimeMs", 0),
        **extra,
    }


def handle_run(event: dict) -> dict:
    run_id = event["runId"]

    try:
        code = event["code"]
        solution = event["solution"]
        input_data = event["input"]
        time_limit_s = event["timeLimitSeconds"]
        memory_limit_mb = event["memoryLimitMB"]

        # 1. User's code must parse (cheap, so check before running anything)
        error = check_syntax(code)
        if error:
            return run_result(run_id, "COMPILATION_ERROR", error=error)

        # 2. Our reference solution must parse; if not, that's our bug
        sol_error = check_syntax(solution)
        if sol_error:
            return run_result(
                run_id,
                "INTERNAL_ERROR",
                error=f"Reference solution: {sol_error}",
            )

        user_file = "/tmp/user.py"
        solution_file = "/tmp/solution.py"
        with open(user_file, "w") as f:
            f.write(code)
        with open(solution_file, "w") as f:
            f.write(solution)

        # 3. Run the reference solution on the input: this doubles as validation.
        #    If it crashes / times out / blows memory, the input is bad.
        expected = execute(
            solution_file, input_data, time_limit_s, memory_limit_mb
        )
        if expected["verdict"] is not None:
            return run_result(
                run_id,
                "BAD_USER_INPUT",
                error=expected["stderr"] or expected["verdict"],
            )

        # 4. Run the user's code on the same input
        actual = execute(user_file, input_data, time_limit_s, memory_limit_mb)

        if actual["verdict"] is not None:
            verdict = actual["verdict"]  # TLE / MLE / RUNTIME_ERROR
        elif outputs_match(actual["stdout"], expected["stdout"]):
            verdict = "ACCEPTED"
        else:
            verdict = "WRONG_ANSWER"

        print(f"[run:{run_id}] {verdict}")
        return run_result(
            run_id,
            verdict,
            maxMemoryMb=actual["memory_mb"],
            maxRuntimeMs=actual["elapsed_ms"],
            output=actual["stdout"][:MAX_OUTPUT_CHARS],
            expected=expected["stdout"][:MAX_OUTPUT_CHARS],
            stderr=actual["stderr"],
        )

    except Exception:
        tb = traceback.format_exc()
        print(f"[run:{run_id}] INTERNAL_ERROR\n{tb}")
        return run_result(run_id, "INTERNAL_ERROR", error=tb)


# ── Lambda entrypoint ─────────────────────────────────────────────────────────


def lambda_handler(event, context):
    if event.get("mode") == "run":
        return handle_run(event)

    return handle_submission(event)
