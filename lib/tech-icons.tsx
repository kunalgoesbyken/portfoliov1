import type { IconType } from "react-icons";
import { FaJava } from "react-icons/fa";
import {
  SiNextdotjs,
  SiTypescript,
  SiReact,
  SiThreedotjs,
  SiCloudflare,
  SiNodedotjs,
  SiGoland,
  SiBun,
  SiSupabase,
  SiPrisma,
  SiTailwindcss,
  SiGmail,
  SiPython,
  SiDjango,
  SiRedis,
  SiCelery,
  SiPostgresql,
  SiGooglegemini,
  SiVuedotjs,
  SiDocker,
  SiMongodb,
  SiAmazons3,
  SiJenkins,
  SiRust,
  SiFlutter,
  SiAwsamplify,
  SiOnnx,
  SiNumba,
  SiPydantic,
  SiFastapi,
  SiTradingview,
} from "react-icons/si";

export type TechKey =
  | "next"
  | "ts"
  | "react"
  | "three"
  | "cloud"
  | "node"
  | "go"
  | "bun"
  | "supabase"
  | "prisma"
  | "tailwind"
  | "gmail"
  | "python"
  | "java"
  | "django"
  | "redis"
  | "celery"
  | "postgres"
  | "gemini"
  | "vue"
  | "docker"
  | "mongo"
  | "s3"
  | "jenkins"
  | "rust"
  | "flutter"
  | "aws"
  | "onnx"
  | "numba"
  | "pydantic"
  | "fastapi"
  | "tradingview";

export const iconMap: Record<TechKey, IconType> = {
  next: SiNextdotjs,
  ts: SiTypescript,
  react: SiReact,
  three: SiThreedotjs,
  cloud: SiCloudflare,
  node: SiNodedotjs,
  go: SiGoland,
  bun: SiBun,
  supabase: SiSupabase,
  prisma: SiPrisma,
  tailwind: SiTailwindcss,
  gmail: SiGmail,
  python: SiPython,
  java: FaJava,
  django: SiDjango,
  redis: SiRedis,
  celery: SiCelery,
  postgres: SiPostgresql,
  gemini: SiGooglegemini,
  vue: SiVuedotjs,
  docker: SiDocker,
  mongo: SiMongodb,
  s3: SiAmazons3,
  jenkins: SiJenkins,
  rust: SiRust,
  flutter: SiFlutter,
  aws: SiAwsamplify,
  onnx: SiOnnx,
  numba: SiNumba,
  pydantic: SiPydantic,
  fastapi: SiFastapi,
  tradingview: SiTradingview,
};

export const techNames: Record<TechKey, string> = {
  next: "Next.js",
  ts: "TypeScript",
  react: "React",
  three: "Three.js",
  cloud: "Cloudflare",
  node: "Node.js",
  go: "Go",
  bun: "Bun",
  supabase: "Supabase",
  prisma: "Prisma",
  tailwind: "Tailwind CSS",
  gmail: "Gmail API",
  python: "Python",
  java: "Java",
  django: "Django",
  redis: "Redis",
  celery: "Celery",
  postgres: "PostgreSQL",
  gemini: "Gemini",
  vue: "Vue.js",
  docker: "Docker",
  mongo: "MongoDB",
  s3: "Amazon S3",
  jenkins: "Jenkins",
  rust: "Rust",
  flutter: "Flutter",
  aws: "AWS",
  onnx: "ONNX",
  numba: "Numba",
  pydantic: "Pydantic",
  fastapi: "FastAPI",
  tradingview: "TradingView",
};