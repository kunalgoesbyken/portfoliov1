# kunalrc.xyz

My portfolio: projects with case studies, work history, writing, and a chat assistant that answers from the same data.

Live at [kunalrc.xyz](https://kunalrc.xyz).

## Content

Each fact lives in one file, and every page that shows it reads from there.

| What | Where |
| :--- | :--- |
| Project cards, categories and links | `lib/projects-data.ts` |
| Case studies: summary, stats, screenshots, write-up | `data/projects/<slug>.mdx` |
| Architecture diagrams | `data/projects/diagrams/*.d2`, rendered to `public/diagrams` |
| Work history | `lib/experience-data.ts` |
| Blog posts | `data/*.mdx`, plus Medium posts pulled from RSS |
| Chat assistant context | built in `lib/context.ts` from the files above |

## Run it

```bash
npm install
npm run dev
```

Optional environment variables:

| Variable | Used for |
| :--- | :--- |
| `GEMINI_API_KEY` | the chat assistant (`app/api/chat`) |
| `NEXT_PUBLIC_GITHUB_TOKEN` | higher GitHub API limits for the contribution graph and open source section |

After editing a `.d2` file, run `npm run diagrams` (needs the [d2](https://d2lang.com) CLI) and commit the SVGs it writes.

## Stack

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Motion, and MDX through next-mdx-remote. Deployed on Vercel; image optimization is off to stay within the Hobby plan.
