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
        <div className="w-full mt-16 max-md:mt-8 relative">
            <div className="flex flex-col items-start space-y-3">
                <h1 className="text-3xl md:text-3xl font-bold font-custom tracking-tight text-neutral-900 dark:text-neutral-50">
                    <span className="link--elara">Skills</span>
                </h1>

                <p className="tracking-tight font-custom2 text-neutral-600 dark:text-neutral-400 max-w-lg text-sm md:text-base mb-6 max-md:mb-2">
                    I love working with these technologies to build beautiful and functional applications.
                </p>

                <div className="w-full py-8 max-md:py-6">
                    <LogoSlider
                        logos={skills.map((skill) => (
                            <div key={skill.name} className="flex flex-col items-center justify-center gap-2 group cursor-default">
                                <skill.icon className="w-8 h-8 md:w-10 md:h-10 text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-neutral-100 transition-colors" />
                                <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 font-custom2 group-hover:text-neutral-900 dark:group-hover:text-neutral-100 transition-colors">
                                    {skill.name}
                                </span>
                            </div>
                        ))}
                        speed={40}
                        pauseOnHover={true}
                    />
                </div>
            </div>
        </div>
    );
}
