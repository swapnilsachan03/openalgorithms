import "./home.scss";

import { ArrowRight } from "lucide-react";

import IconCloud from "../../components/ui/icon-cloud";
import RainbowButton from "../../components/ui/rainbow-button";

const icons = [
  "typescript",
  "javascript",
  "dart",
  "java",
  "react",
  "flutter",
  "android",
  "html5",
  "css3",
  "nodedotjs",
  "prisma",
  "amazon",
  "postgresql",
  "firebase",
  "nginx",
  "jest",
  "cypress",
  "docker",
  "git",
  "jira",
  "gitlab",
  "androidstudio",
  "figma",
  "go",
  "springboot",
  "googlecloud",
  "jenkins",
  "tensorflow",
  "python",
];

export default function Home() {
  return (
    <div className="hero-section">
      <div className="icon-cloud-container">
        <IconCloud iconSlugs={icons} />
      </div>

      <div className="content">
        <h1 className="heading">
          The <span className="text-color-animation">open-source</span>{" "}
          programming platform you need
        </h1>

        <span className="description">
          OpenAlgorithms is a community driven platform aimed at making it easy
          for people to learn programming — algorithms or frameworks, tailored
          for all, beginners to advanced!
        </span>
      </div>

      <RainbowButton>
        See what's possible
        <ArrowRight size={16} className="ml-2" />
      </RainbowButton>
    </div>
  );
}
