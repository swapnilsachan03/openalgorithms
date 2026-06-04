/**-- external --*/

import { useState } from "react";
import { Button, Input } from "antd";
import { Image, KeyRound, LogIn, Mail, Text, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";

/**-- internal --*/

import { useUserActions } from "@/stores/userStore";

/**-- relative --*/

import "./signup.scss";
import { onSignup } from "../login/modules/login_module";

const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const actions = useUserActions();

  const handleSubmit = async () => {
    const signedUp = await onSignup(
      { name, email, password, image: imageUrl },
      actions
    );

    if (signedUp) window.location.href = "/";
  };

  return (
    <div className="auth_container">
      <div className="form">
        <h1>Sign Up</h1>

        <div className="form_fields">
          <label className="input_field">
            <span>Name</span>
            <Input
              type="text"
              placeholder="Enter your name"
              prefix={<Text size={16} />}
              value={name}
              onChange={e => setName(e.currentTarget.value)}
              required
            />
          </label>

          <label className="input_field">
            <span>Email</span>
            <Input
              type="email"
              placeholder="Enter your email"
              prefix={<Mail size={16} />}
              value={email}
              onChange={e => setEmail(e.currentTarget.value)}
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

          <label className="input_field">
            <span>Image URL</span>
            <Input
              type="text"
              placeholder="Enter your image URL"
              prefix={<Image size={16} />}
              value={imageUrl}
              onChange={e => setImageUrl(e.currentTarget.value)}
            />
          </label>
        </div>

        <div className="action_container">
          <Link to="/login">
            <Button
              variant="outlined"
              color="geekblue"
              icon={<LogIn size={14} />}
            >
              Login
            </Button>
          </Link>

          <Button
            variant="solid"
            color="geekblue"
            icon={<UserPlus size={14} />}
            onClick={handleSubmit}
          >
            Sign up
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
