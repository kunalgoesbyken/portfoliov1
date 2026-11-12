import { ImageResponse } from "next/og";
import { DEPLOYED_PROJECTS } from "@/lib/projects-data";
import { SITE_NAME, SITE_TAGLINES, SITE_URL } from "@/lib/site";
import { OG_SIZE, loadOgFonts, toPngDataUrl } from "@/lib/og";

export const alt = `${SITE_NAME}: backend and applied AI engineer working in Rust, Go and AI tools that run in production`;
export const size = OG_SIZE;
export const contentType = "image/png";

const PREVIEW_COUNT = 2;
const PAGE_PADDING = 60;
const CARD_GAP = 24;
const CARD_WIDTH = (size.width - PAGE_PADDING * 2 - CARD_GAP * (PREVIEW_COUNT - 1)) / PREVIEW_COUNT;
const CARD_HEIGHT = Math.round((CARD_WIDTH * 9) / 16);
const CARD_TOP = 336;

export default async function OpenGraphImage() {
  const featured = DEPLOYED_PROJECTS.slice(0, PREVIEW_COUNT);
  const [fonts, previews] = await Promise.all([
    loadOgFonts(),
    Promise.all(featured.map(async ({ title, src }) => ({ title, src: await toPngDataUrl(src, CARD_WIDTH, CARD_HEIGHT) }))),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#0a0a0a",
          color: "#fafafa",
          padding: `48px ${PAGE_PADDING}px 0`,
          fontFamily: "Instrument Sans",
          position: "relative",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ fontFamily: "Instrument Serif", fontSize: 84, lineHeight: 1, letterSpacing: -2 }}>
            {SITE_NAME}
          </div>
          <div style={{ fontSize: 24, color: "#737373", paddingBottom: 10 }}>
            {new URL(SITE_URL).host}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", marginTop: 22, fontSize: 25, color: "#d4d4d4" }}>
          {SITE_TAGLINES.map((line) => (
            <div key={line} style={{ display: "flex", marginTop: 6 }}>
              {line}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", position: "absolute", top: CARD_TOP, left: PAGE_PADDING, gap: CARD_GAP }}>
          {previews.map(({ title, src }) => (
            <div
              key={title}
              style={{
                display: "flex",
                width: CARD_WIDTH,
                height: CARD_HEIGHT,
                borderRadius: 14,
                overflow: "hidden",
                border: "1px solid #2a2a2a",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} width={CARD_WIDTH} height={CARD_HEIGHT} style={{ objectFit: "cover" }} alt="" />
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
