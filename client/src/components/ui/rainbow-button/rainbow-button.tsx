import React from "react";
import classNames from "classnames";

import "./rainbow-button.scss";

interface RainbowButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export default function RainbowButton({
  children,
  className,
  ...props
}: RainbowButtonProps) {
  return (
    <button className={classNames("rainbow-button", className)} {...props}>
      {children}
    </button>
  );
}
