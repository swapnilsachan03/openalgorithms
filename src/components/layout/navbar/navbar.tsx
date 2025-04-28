import _ from "lodash";
import { Button } from "generic-ds";
import { Link, useLocation } from "react-router-dom";
import classNames from "classnames";

import "./navbar.scss";

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

        <Button variant="solid" size="medium" label="Sign In" />
      </div>
    </nav>
  );
};

export default Navbar;
