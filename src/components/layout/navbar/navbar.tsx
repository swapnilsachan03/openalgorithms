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
