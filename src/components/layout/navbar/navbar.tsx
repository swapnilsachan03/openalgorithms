import _ from "lodash";
import classNames from "classnames";
import { Button, IconButton } from "generic-ds";
import { Link, useLocation } from "react-router-dom";

import {
  useIsLoggedIn,
  useUserActions,
  useUserToken,
} from "@/stores/userStore";

import "./navbar.scss";
import { LogIn, LogOut, User2 } from "lucide-react";
import { onLogout } from "@/routes/login/modules/login_module";

const navbarLinks = [
  { href: "/learn", label: "Learn" },
  { href: "/practice", label: "Practice" },
  { href: "/playground", label: "Playground" },
  { href: "/interviews", label: "Interviews" },
];

const Navbar = () => {
  const location = useLocation();

  const isProblemSolvingPage =
    location.pathname.startsWith("/problem/") &&
    !location.pathname.includes("/create");

  const isLoggedIn = useIsLoggedIn();
  const token = useUserToken();
  const actions = useUserActions();

  const handleLogout = async () => {
    const res = await onLogout(token as string, actions);
    if (res) window.location.href = "/";
  };

  return (
    <nav
      className={classNames("navbar", { "no-border": isProblemSolvingPage })}
    >
      <Link to="/" className="navbar_logo">
        OpenAlgorithms
      </Link>

      <div className="navbar_container">
        <div className="navbar_links">
          {_.map(navbarLinks, link => (
            <Link key={link.href} to={link.href} className="navbar_link">
              {link.label}
            </Link>
          ))}
        </div>

        {isLoggedIn ? (
          <div className="navbar_actions">
            <Link to="/me">
              <Button
                variant="solid"
                size="medium"
                icon={<User2 size={14} />}
                label="Profile"
              />
            </Link>

            <IconButton
              ariaLabel="Logout"
              icon={<LogOut size={14} />}
              onClick={handleLogout}
            />
          </div>
        ) : (
          <div className="navbar_actions">
            <Link to="/login">
              <Button
                variant="solid"
                size="medium"
                icon={<LogIn size={14} />}
                label="Sign In"
              />
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
