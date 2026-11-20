import type { ReactNode } from "react";
import { ImageResponse } from "next/og";
import { EXPERIENCES } from "@/lib/experience-data";
import { byStars, getGithubData, mergedCount } from "@/lib/github";
import { DEPLOYED_PROJECTS } from "@/lib/projects-data";
import { SITE_AVATAR, SITE_LOCATION, SITE_NAME, SITE_ROLE, SITE_URL } from "@/lib/site";
import { countOf } from "@/lib/utils";
import { OG_SIZE, loadOgFonts, toLogoDataUrl, toPngDataUrl } from "@/lib/og";

export const alt = `${SITE_NAME}: backend and applied AI engineer working in Rust, Go and AI tools that run in production`;
export const size = OG_SIZE;
export const contentType = "image/png";

const PAGE_PADDING = 64;
const AVATAR_SIZE = 96;
const AVATAR_GAP = 28;
const MARK_HEIGHT = 40;
const MARK_MAX_WIDTH = 150;
const WORDMARK_RATIO = 2;
const HEADLINE_REPOSITORIES = 4;
const LABEL_WIDTH = 236;
const MUTED = "#6f6f6f";

const Mark = ({ src, width, height, name }: { src: string; width: number; height: number; name?: string }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={src} width={width} height={height} style={{ borderRadius: 7 }} alt="" />
    {name && <div style={{ fontSize: 26 }}>{name}</div>}
  </div>
);

const Row = ({ label, note, children }: { label: string; note?: string; children: ReactNode }) => (
  <div style={{ display: "flex", alignItems: "center" }}>
    <div style={{ display: "flex", flexDirection: "column", width: LABEL_WIDTH }}>
      <div style={{ fontSize: 15, letterSpacing: 2.5, textTransform: "uppercase", color: MUTED }}>{label}</div>
      {note && <div style={{ fontSize: 15, color: "#4f4f4f", marginTop: 6 }}>{note}</div>}
    </div>
    <div style={{ display: "flex", alignItems: "center", flex: 1, gap: 36 }}>{children}</div>
  </div>
);

const toMark = async (path: string, name: string) => {
  const logo = await toLogoDataUrl(path, MARK_MAX_WIDTH, MARK_HEIGHT);
  return { ...logo, key: name, name: logo.width > logo.height * WORDMARK_RATIO ? undefined : name };
};

export default async function OpenGraphImage() {
  const current = EXPERIENCES.find(({ end }) => !end);
  const projects = DEPLOYED_PROJECTS.filter((project): project is typeof project & { logo: string } => Boolean(project.logo));
  const [fonts, avatar, companies, built, { repositories }] = await Promise.all([
    loadOgFonts(),
    toPngDataUrl(SITE_AVATAR, AVATAR_SIZE, AVATAR_SIZE),
    Promise.all(EXPERIENCES.map(({ logoDark, logo, company }) => toMark(logoDark ?? logo, company))),
    Promise.all(projects.map(({ logo, title }) => toMark(logo, title))),
    getGithubData(),
  ]);
  const headline = [current && `${current.designation} at ${current.company}`, SITE_ROLE, SITE_LOCATION].filter(Boolean).join("  ·  ");
  const contributed = byStars(repositories).slice(0, HEADLINE_REPOSITORIES);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0a0a",
          color: "#fafafa",
          padding: PAGE_PADDING,
          fontFamily: "Instrument Sans",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: AVATAR_GAP }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={avatar} width={AVATAR_SIZE} height={AVATAR_SIZE} style={{ borderRadius: AVATAR_SIZE }} alt="" />
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontFamily: "Instrument Serif", fontSize: 80, lineHeight: 1, letterSpacing: -2 }}>{SITE_NAME}</div>
              <div style={{ fontSize: 22, color: MUTED }}>{new URL(SITE_URL).host}</div>
            </div>
            <div style={{ display: "flex", marginTop: 14, fontSize: 23, color: "#9a9a9a" }}>{headline}</div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 40, paddingBottom: 8 }}>
          <Row label="Worked at">
            {companies.map(({ key, ...mark }) => (
              <Mark key={key} {...mark} />
            ))}
          </Row>
          {contributed.length > 0 && (
            <Row label="Contributed to" note={countOf(mergedCount(repositories), "merged PR", "merged PRs")}>
              {contributed.map(({ nameWithOwner, name, avatarUrl }) => (
                <Mark key={nameWithOwner} src={avatarUrl} width={MARK_HEIGHT - 4} height={MARK_HEIGHT - 4} name={name} />
              ))}
            </Row>
          )}
          <Row label="Built">
            {built.map(({ key, ...mark }) => (
              <Mark key={key} {...mark} />
            ))}
          </Row>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
