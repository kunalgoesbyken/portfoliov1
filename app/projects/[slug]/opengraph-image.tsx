import { ImageResponse } from "next/og";
import { ALL_PROJECTS, findProject } from "@/lib/projects-data";
import { getCaseStudy } from "@/lib/case-studies";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { OG_SIZE, loadOgFonts, toPngDataUrl } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = `Engineering case study by ${SITE_NAME}`;

const PADDING = 60;
const SHOT_WIDTH = 560;
const SHOT_HEIGHT = 350;
const STAT_COUNT = 2;

export const generateStaticParams = () => ALL_PROJECTS.map(({ slug }) => ({ slug }));

export default async function ProjectOpenGraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = findProject(slug);
  const [{ meta }, fonts, shot] = await Promise.all([
    getCaseStudy(slug),
    loadOgFonts(),
    toPngDataUrl(project.src, SHOT_WIDTH, SHOT_HEIGHT),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#0a0a0a",
          color: "#fafafa",
          padding: PADDING,
          fontFamily: "Instrument Sans",
          position: "relative",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", width: size.width - PADDING * 3 - SHOT_WIDTH }}>
          <div style={{ fontSize: 20, letterSpacing: 3, textTransform: "uppercase", color: "#fbbf24" }}>{project.category}</div>
          <div style={{ fontFamily: "Instrument Serif", fontSize: 76, lineHeight: 1, letterSpacing: -2, marginTop: 14 }}>
            {project.title}
          </div>
          <div style={{ display: "flex", flexDirection: "column", marginTop: 40, gap: 22 }}>
            {meta.stats.slice(0, STAT_COUNT).map((stat) => (
              <div key={stat.label} style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ fontFamily: "Instrument Serif", fontSize: 48, lineHeight: 1 }}>{stat.value}</div>
                <div style={{ fontSize: 20, color: "#a3a3a3", marginTop: 6 }}>{stat.label}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", marginTop: "auto", fontSize: 22, color: "#737373" }}>
            {`${SITE_NAME} · ${new URL(SITE_URL).host}`}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 140,
            right: PADDING,
            width: SHOT_WIDTH,
            height: SHOT_HEIGHT,
            borderRadius: 14,
            overflow: "hidden",
            border: "1px solid #2a2a2a",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={shot} width={SHOT_WIDTH} height={SHOT_HEIGHT} style={{ objectFit: "cover" }} alt="" />
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
