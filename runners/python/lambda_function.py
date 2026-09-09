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


# ── Lambda entrypoint ──────────────────────────────────────────────────────────


def lambda_handler(event, context):
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
            return

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
