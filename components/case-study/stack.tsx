import type { IconType } from "react-icons";
import {
  SiBun,
  SiCodemirror,
  SiDocker,
  SiEsbuild,
  SiGithubactions,
  SiGmail,
  SiGo,
  SiGoogle,
  SiGooglegemini,
  SiHuggingface,
  SiNextdotjs,
  SiOnnx,
  SiPostgresql,
  SiPrisma,
  SiPrometheus,
  SiPypi,
  SiPython,
  SiRadixui,
  SiReact,
  SiReactquery,
  SiRust,
  SiSupabase,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
  SiVite,
  SiWails,
  SiWebassembly,
  SiZod,
} from "react-icons/si";

const STACK_ICONS: Record<string, IconType> = {
  Bun: SiBun,
  CodeMirror: SiCodemirror,
  Docker: SiDocker,
  esbuild: SiEsbuild,
  "GitHub Actions": SiGithubactions,
  "Gmail API": SiGmail,
  Go: SiGo,
  "Google OAuth": SiGoogle,
  "Google Gemini": SiGooglegemini,
  "Hugging Face tokenizers": SiHuggingface,
  "Next.js": SiNextdotjs,
  "ONNX Runtime": SiOnnx,
  PostgreSQL: SiPostgresql,
  Prisma: SiPrisma,
  Prometheus: SiPrometheus,
  PyPI: SiPypi,
  Python: SiPython,
  "Radix UI": SiRadixui,
  React: SiReact,
  "React DOM": SiReact,
  "TanStack Query": SiReactquery,
  Rust: SiRust,
  Supabase: SiSupabase,
  "Tailwind CSS": SiTailwindcss,
  TypeScript: SiTypescript,
  Vercel: SiVercel,
  "Vercel AI SDK": SiVercel,
  Vite: SiVite,
  Wails: SiWails,
  WebAssembly: SiWebassembly,
  Zod: SiZod,
};

function StackItem({ name }: { name: string }) {
  const Icon = STACK_ICONS[name];
  return (
    <li className="inline-flex items-center gap-2">
      {Icon ? (
        <Icon size={16} aria-hidden="true" className="shrink-0 text-neutral-700 dark:text-neutral-300" />
      ) : (
        <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-neutral-400 dark:bg-neutral-600 mx-[5px]" />
      )}
      {name}
    </li>
  );
}

export function Stack({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  return (
    <section aria-labelledby="stack-heading" className="mt-14 border-t border-neutral-200 dark:border-neutral-800 pt-6">
      <h2 id="stack-heading" className="font-custom2 text-xs uppercase tracking-[0.14em] text-neutral-500">
        Built with
      </h2>
      <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-3 font-custom2 text-sm text-neutral-800 dark:text-neutral-200">
        {items.map((name) => (
          <StackItem key={name} name={name} />
        ))}
      </ul>
    </section>
  );
}
