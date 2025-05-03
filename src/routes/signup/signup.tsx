import { useState } from "react";
import { Button, Input } from "generic-ds";
import { Image, KeyRound, LogIn, Mail, Text, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";

import { useUserActions } from "@/stores/userStore";
import { onSignup } from "../login/modules/login_module";

import "./signup.scss";

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
              color="sky"
              variant="outline"
              placeholder="Enter your name"
              icon={<Text size={16} />}
              value={name}
              onChange={e => setName(e.currentTarget.value)}
              required
            />
          </label>

          <label className="input_field">
            <span>Email</span>
            <Input
              type="email"
              color="sky"
              variant="outline"
              placeholder="Enter your email"
              icon={<Mail size={16} />}
              value={email}
              onChange={e => setEmail(e.currentTarget.value)}
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

          <label className="input_field">
            <span>Image URL</span>
            <Input
              type="text"
              color="sky"
              variant="outline"
              placeholder="Enter your image URL"
              icon={<Image size={16} />}
              value={imageUrl}
              onChange={e => setImageUrl(e.currentTarget.value)}
            />
          </label>
        </div>

        <div className="action_container">
          <Link to="/login">
            <Button
              variant="outline"
              color="sky"
              label="Login"
              icon={<LogIn size={14} />}
            />
          </Link>

          <Button
            type="submit"
            color="sky"
            variant="solid"
            label="Sign Up"
            icon={<UserPlus size={14} />}
            onClick={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
