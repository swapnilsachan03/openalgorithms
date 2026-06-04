/**-- external --*/

import { useState } from "react";
import { Button, Input } from "antd";
import { KeyRound, LogIn, Mail, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";

/**-- internal --*/

import { useUserActions } from "@/stores/userStore";

/**-- relative --*/

import "./login.scss";
import { onLogin } from "./modules/login_module";

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
              placeholder="Enter your email"
              prefix={<Mail size={16} />}
              value={username}
              onChange={e => setUsername(e.currentTarget.value)}
              required
            />
          </label>

          <label className="input_field">
            <span>Password</span>

            <Input
              type="password"
              placeholder="Enter your password"
              prefix={<KeyRound size={16} />}
              value={password}
              onChange={e => setPassword(e.currentTarget.value)}
              required
            />
          </label>
        </div>

        <div className="action_container">
          <Link to="/signup">
            <Button
              variant="outlined"
              color="geekblue"
              icon={<UserPlus size={14} />}
            >
              Sign up
            </Button>
          </Link>

          <Button
            variant="solid"
            color="geekblue"
            icon={<LogIn size={14} />}
            onClick={handleSubmit}
          >
            Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
