import type { ReactNode } from "react";
import { Globe, Package } from "lucide-react";
import { SiPypi } from "react-icons/si";
import GithubIcon from "@/components/ui/github-icon";
import { projectLinkEntries, type ProjectLinks } from "@/lib/projects-data";

export interface ProjectLink {
  href: string;
  label: string;
  icon: ReactNode;
}

const ICONS: Record<keyof ProjectLinks, ReactNode> = {
  live: <Globe size={16} aria-hidden="true" />,
  crates: <Package size={16} aria-hidden="true" />,
  pypi: <SiPypi size={16} aria-hidden="true" />,
  github: <GithubIcon size={16} />,
};

export const projectLinks = (links: ProjectLinks): ProjectLink[] =>
  projectLinkEntries(links).map(({ key, label, href }) => ({ href, label, icon: ICONS[key] }));
