import _ from "lodash";

import { Button } from "generic-ds";
import { Link } from "react-router-dom";

import "./navbar.scss";

const navbarLinks = [
  { href: "/learn", label: "Learn" },
  { href: "/practice", label: "Practice" },
  { href: "/playground", label: "Playground" },
  { href: "/interviews", label: "Interviews" },
];

type Props = {};

const Navbar = (props: Props) => {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar__logo">
        OpenAlgorithms
      </Link>

      <div className="navbar__container">
        <div className="navbar__links">
          {_.map(navbarLinks, link => (
            <Link key={link.href} to={link.href} className="navbar__link">
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
