"use client";

import {
    SiReact,
    SiJavascript,
    SiTypescript,
    SiNodedotjs,
    SiNextdotjs,
    SiPrisma,
    SiPostgresql,
    SiPython,
    SiDocker,
    SiKubernetes,
    SiGit,
    SiExpress,
    SiGoland,
    SiDjango,
    SiMongodb,
    SiRedis,
    SiCelery,
    SiGooglegemini,
    SiVuedotjs,
    SiJenkins,
    SiAmazons3,
    SiRust,
    SiFlutter,
} from "react-icons/si";
import { FaAws, FaJava } from "react-icons/fa";
import LogoSlider from "@/components/ui/logo-slider";

const skills = [
    { name: "Go", icon: SiGoland },
    { name: "Python", icon: SiPython },
    { name: "Java", icon: FaJava },
    { name: "TypeScript", icon: SiTypescript },
    { name: "JavaScript", icon: SiJavascript },
    { name: "Rust", icon: SiRust },
    { name: "Flutter", icon: SiFlutter },
    { name: "React", icon: SiReact },
    { name: "Next.js", icon: SiNextdotjs },
    { name: "Vue.js", icon: SiVuedotjs },
    { name: "Node.js", icon: SiNodedotjs },
    { name: "Django", icon: SiDjango },
    { name: "Express", icon: SiExpress },
    { name: "PostgreSQL", icon: SiPostgresql },
    { name: "MongoDB", icon: SiMongodb },
    { name: "Redis", icon: SiRedis },
    { name: "Prisma", icon: SiPrisma },
    { name: "AWS", icon: FaAws },
    { name: "Amazon S3", icon: SiAmazons3 },
    { name: "Docker", icon: SiDocker },
    { name: "Kubernetes", icon: SiKubernetes },
    { name: "Git", icon: SiGit },
    { name: "Jenkins", icon: SiJenkins },
    { name: "Celery", icon: SiCelery },
    { name: "Gemini", icon: SiGooglegemini },
];

export default function Skills() {
    return (
        <div className="w-full pb-8 max-md:pb-6">
            <LogoSlider
                logos={skills.map((skill) => (
                    <div key={skill.name} className="flex flex-col items-center justify-center gap-2 text-fg-subtle">
                        <skill.icon aria-hidden="true" className="size-8 md:size-10" />
                        <span className="font-custom2 text-xs font-medium">{skill.name}</span>
                    </div>
                ))}
                speed={40}
                pauseOnHover
            />
        </div>
    );
}
