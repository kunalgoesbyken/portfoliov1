# Portfolio Website

A modern, responsive, and fast developer portfolio built using Next.js, Tailwind CSS, TypeScript, Framer Motion, MDX, and GitHub API integration.
Features include blog support, project pages, contribution graph, SEO optimization, and a clean minimal design.

---

## Live Demo

[kunalrc.vercel.app](https://kunalrc.vercel.app/)

---

## Features

- **Next.js App Router** architecture
- **Tailwind CSS** with Shadcn UI
- **MDX** support for blogs and project pages
- **GitHub Contribution Graph** integration
- **GitHub API** integration to fetch repositories
- **Framer Motion** animations
- **SEO** and Open Graph metadata
- **Production-grade performance** with optimized media assets
- Fully responsive and accessible

---

## Performance Optimizations

This portfolio implements modern web performance best practices to ensure blazing-fast load times and minimal bandwidth usage.

### Asset Optimization Strategy

#### **Image Optimization (AVIF + WebP)**
- **Format**: All images are served in **AVIF format** (with WebP fallback)
- **Compression**: 12.7MB PNG → **129KB AVIF** (99% reduction)
- **Why AVIF?** Offers 30-50% better compression than WebP while maintaining visual quality
- **Browser Support**: 92%+ coverage (Chrome 85+, Firefox 93+, Safari 16+)

#### **Video Optimization (The "Poster Pattern")**
Progressive loading strategy to eliminate unnecessary bandwidth:

1. **Poster Frame** (Default State) - **14KB AVIF**
   - Static image extracted from video
   - Loads immediately on page visit
   - Zero performance impact

2. **Preview Video** (Hover State) - **81KB MP4**
   - Muted, 640px width, 10-second clip
   - Only loads when user hovers over project
   - Compressed with `-crf 28` and `-movflags faststart`

**FFmpeg Commands Used:**
```bash
# Extract poster frame
ffmpeg -i video.mp4 -vframes 1 -vf "scale=1920:-2" poster.png

# Create preview video with faststart
ffmpeg -i video.mp4 \
  -an \                              # Strip audio
  -vf "scale=640:-2" \              # Downscale to 640px
  -vcodec libx264 \
  -crf 28 \                         # Higher compression
  -preset slow \                    # Better compression quality
  -movflags faststart \             # Enable instant streaming
  -t 10 \                           # Limit to 10 seconds
  preview.mp4
```

### Performance Impact

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| **Initial Media Weight** | ~27MB | **~200KB** | **99% ↓** |
| **Time to Interactive** | ~8s (3G) | **~1.5s** | **81% ↓** |
| **CLS** | Variable | **0.005** | 95% within "Good" range |
| **Data on Hover** | N/A | +81KB | Progressive |

### Why `-movflags faststart`?

This FFmpeg flag moves video metadata to the file header, allowing browsers to **stream the video immediately** instead of waiting for the entire file to download. Without it, users see a black screen until 100% of the video is loaded.

### Next.js Image Optimization

All images use the `next/image` component with:
- **Automatic format negotiation** (AVIF → WebP → PNG fallback)
- **Lazy loading** for below-the-fold content
- **Priority loading** for above-the-fold images (reduces LCP)
- **Responsive sizing** via the `sizes` prop

### Core Web Vitals

- **LCP (Largest Contentful Paint)**: < 1.8s
- **CLS (Cumulative Layout Shift)**: 0.005 (locked aspect ratios prevent reflows)
- **FID (First Input Delay)**: < 50ms

---

## Tech Stack

| Technology | Description |
|------------|-------------|
| Next.js    | React framework for production |
| TypeScript | Static typing |
| Tailwind CSS | Utility-first styling |
| Shadcn UI  | Accessible UI components |
| MDX        | Markdown with React support |
| Framer Motion | Animation library |
| GitHub API | Dynamic repo fetching |
| Vercel     | Deployment platform |

---

## Getting Started

### Prerequisites

- Node.js or Bun installed on your machine.
- A GitHub Personal Access Token (for fetching pinned repositories).

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/kunalgoesbyken/Portfoliov1.git
   cd Portfoliov1
   ```

2. **Install dependencies:**

   ```bash
   npm install
   # or
   bun install
   ```

3. **Set up Environment Variables:**

   Create a `.env` file in the root directory:

   ```env
   # Required for GitHub API repo fetching
   GITHUB_TOKEN="your_github_personal_access_token"
   ```

4. **Run the development server:**

   ```bash
   npm run dev
   # or
   bun dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

Deploy to **Vercel** for the best experience.

> **Note:** After deploying, remember to set the `GITHUB_TOKEN` in your Vercel Project Settings > Environment Variables.

---

## License

This project is licensed under the MIT License.
