import "./page.css";

import { ArrowRight } from "lucide-react";

import IconCloud from "@/components/ui/icon-cloud";
import RainbowButton from "@/components/ui/rainbow-button";

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
  "express",
  "nextdotjs",
  "prisma",
  "amazonaws",
  "postgresql",
  "firebase",
  "nginx",
  "vercel",
  "testinglibrary",
  "jest",
  "cypress",
  "docker",
  "git",
  "jira",
  "github",
  "gitlab",
  "visualstudiocode",
  "androidstudio",
  "sonarqube",
  "figma",
];

export default function Home() {
  return (
    <div className="w-full">
      <div className="flex flex-col w-full min-h-[90vh] items-center justify-center py-12 gap-10">
        <div className="relative flex max-w-lg items-center justify-center overflow-hidden rounded-lg bg-transparent">
          <IconCloud iconSlugs={icons} />
        </div>

        <div className="flex flex-col items-center gap-6">
          <h1 className="text-5xl leading-[60px] font-extrabold max-w-3xl text-center">
            The <span className="text-color-animation">open-source</span>{" "}
            programming platform you need
          </h1>

          <span className="max-w-2xl text-center">
            OpenAlgorithms is a community driven platform aimed at making it
            easy for people to learn programming — algorithms or frameworks,
            tailored for all, beginners to advanced!
          </span>
        </div>

        <RainbowButton className="dark:bg-white dark:text-black">
          See what's possible
          <ArrowRight size={16} className="ml-2" />
        </RainbowButton>
      </div>
    </div>
  );
}
