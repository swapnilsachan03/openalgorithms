import Link from "next/link";
import React from "react";
import _ from "lodash";
import ColorModeSwitcher from "./color-mode-switcher";

const navbarLinks = [
  { href: "/learn", label: "Learn" },
  { href: "/practice", label: "Practice" },
  { href: "/playground", label: "Playground" },
  { href: "/interviews", label: "Interviews" },
];

type Props = {};

const Navbar = (props: Props) => {
  return (
    <nav className="flex flex-row justify-between items-center py-3 border-b-[1px] border-neutral-200 dark:border-neutral-700 px-1">
      <Link href="/" className="text-[22px] font-bold">
        OpenAlgorithms
      </Link>

      <div className="flex gap-6 items-center">
        {_.map(navbarLinks, link => (
          <Link
            key={link.href}
            href={link.href}
            className="hover:underline hover:underline-offset-2 text-[15px]"
          >
            {link.label}
          </Link>
        ))}

        <ColorModeSwitcher />
      </div>
    </nav>
  );
};

export default Navbar;
