import type { ReactNode } from "react";
import { Globe, Package } from "lucide-react";
import { SiPypi } from "react-icons/si";
import GithubIcon from "@/components/ui/github-icon";
import type { ProjectLinks } from "@/lib/projects-data";

export interface ProjectLink {
  href: string;
  label: string;
  icon: ReactNode;
}

export const projectLinks = ({ live, crates, pypi, github }: ProjectLinks): ProjectLink[] => [
  ...(live ? [{ href: live, label: "Live site", icon: <Globe size={16} /> }] : []),
  ...(crates ? [{ href: crates, label: "crates.io", icon: <Package size={16} /> }] : []),
  ...(pypi ? [{ href: pypi, label: "PyPI", icon: <SiPypi size={16} /> }] : []),
  { href: github, label: "GitHub", icon: <GithubIcon size={16} /> },
];
