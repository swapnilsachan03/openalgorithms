import { useState, FormEvent } from "react";
import { Button, Input } from "generic-ds";
import { LogIn, MailQuestion } from "lucide-react";

import { onLogin } from "./modules/login_module";
import { useUserActions } from "@/stores/userStore";

import "./login.scss";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const actions = useUserActions();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const loggedIn = await onLogin(username, password, actions);
    if (loggedIn) window.location.href = "/";
  };

  return (
    <div className="login-page">
      <form className="form" onSubmit={handleSubmit}>
        <h1>Welcome Back</h1>

        <div className="form_fields">
          <label className="input_field">
            <span>Email</span>

            <Input
              type="text"
              color="sky"
              variant="outline"
              placeholder="Enter your email"
              value={username}
              onChange={e => setUsername(e.currentTarget.value)}
              required
            />
          </label>

          <label className="input_field">
            <span>Password</span>

            <Input
              type="password"
              color="sky"
              variant="outline"
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.currentTarget.value)}
              required
            />
          </label>
        </div>

        <div className="action_container">
          <Button
            variant="outline"
            color="sky"
            label="Forgot password"
            icon={<MailQuestion size={14} />}
          />

          <Button
            type="submit"
            color="sky"
            variant="solid"
            label="Login"
            icon={<LogIn size={14} />}
          />
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
