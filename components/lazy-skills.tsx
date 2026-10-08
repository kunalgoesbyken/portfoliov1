"use client";

import dynamic from "next/dynamic";
import MountOnVisible from "@/components/ui/mount-on-visible";

// Skills is far below the fold: its code and ~25 inline SVG icons are neither
// server-rendered nor fetched until the placeholder nears the viewport.
const Skills = dynamic(() => import("@/components/skills"));

export default function LazySkills() {
  return (
    <MountOnVisible minHeight={300}>
      <Skills />
    </MountOnVisible>
  );
}
