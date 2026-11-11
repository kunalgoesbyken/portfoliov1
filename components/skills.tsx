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
import { Heading, Lede } from "@/components/ui/heading";

const skills = [
    { name: "Golang", icon: SiGoland },
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
        <section className="relative mt-16 w-full max-md:mt-8">
            <Heading>Skills</Heading>
            <Lede className="mt-3 mb-6 max-md:mb-2">
                I love working with these technologies to build beautiful and functional applications.
            </Lede>
            <div className="w-full py-8 max-md:py-6">
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
        </section>
    );
}
