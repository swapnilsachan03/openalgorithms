import classNames from "classnames";
import React, { useState, createContext, useContext, ReactNode } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

import "./collapsible.scss";

interface CollapsibleProps {
  children: ReactNode;
  className?: string;
}

interface CollapsibleContextProps {
  isOpen: boolean;
  toggle: () => void;
}

const CollapsibleContext = createContext<CollapsibleContextProps | undefined>(
  undefined
);

const Collapsible: React.FC<CollapsibleProps> & {
  Trigger: React.FC<TriggerProps>;
  Content: React.FC<ContentProps>;
} = ({ children, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  return (
    <CollapsibleContext.Provider value={{ isOpen, toggle }}>
      <div className={className}>{children}</div>
    </CollapsibleContext.Provider>
  );
};

interface TriggerProps {
  children: ReactNode;
  className?: string;
}

const Trigger: React.FC<TriggerProps> = ({ children, className }) => {
  const context = useContext(CollapsibleContext);
  if (!context) throw new Error("Trigger must be used within a Collapsible");

  return (
    <div onClick={context.toggle} className={classNames("relative", className)}>
      {children}
      <div className="transition-all duration-300 ease-in-out icon-class">
        {context.isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </div>
    </div>
  );
};

interface ContentProps {
  children: ReactNode;
  className?: string;
}

const Content: React.FC<ContentProps> = ({ children, className }) => {
  const context = useContext(CollapsibleContext);
  if (!context) throw new Error("Content must be used within a Collapsible");

  return (
    <div
      className={classNames(
        "overflow-hidden transition-all duration-300 ease-in-out",
        context.isOpen
          ? "max-h-[1000px] opacity-100 mb-3"
          : "max-h-0 opacity-0",
        className
      )}
    >
      {children}
    </div>
  );
};

Collapsible.Trigger = Trigger;
Collapsible.Content = Content;

export default Collapsible;
