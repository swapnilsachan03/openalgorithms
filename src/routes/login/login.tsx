import { useState } from "react";
import { Button, Input } from "generic-ds";
import { KeyRound, LogIn, Mail, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";

import { onLogin } from "./modules/login_module";
import { useUserActions } from "@/stores/userStore";

import "./login.scss";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const actions = useUserActions();

  const handleSubmit = async () => {
    const loggedIn = await onLogin(username, password, actions);
    if (loggedIn) window.location.href = "/";
  };

  return (
    <div className="auth_container">
      <div className="form">
        <h1>Sign in</h1>

        <div className="form_fields">
          <label className="input_field">
            <span>Email</span>

            <Input
              type="text"
              color="sky"
              variant="outline"
              placeholder="Enter your email"
              icon={<Mail size={16} />}
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
              icon={<KeyRound size={16} />}
              value={password}
              onChange={e => setPassword(e.currentTarget.value)}
              required
            />
          </label>
        </div>

        <div className="action_container">
          <Link to="/signup">
            <Button
              variant="outline"
              color="sky"
              label="Sign Up"
              icon={<UserPlus size={14} />}
            />
          </Link>

          <Button
            type="submit"
            color="sky"
            variant="solid"
            label="Login"
            icon={<LogIn size={14} />}
            onClick={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
