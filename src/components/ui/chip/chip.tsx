import React from "react";
import "./chip.scss";
import classNames from "classnames";

type Props = {
  icon?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
};

const Chip = ({ icon, children, className }: Props) => {
  return (
    <div className={classNames("tag", className)}>
      {icon}
      {children}
    </div>
  );
};

export default Chip;
