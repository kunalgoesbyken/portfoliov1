import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { ALL_PROJECTS, projectPath } from "@/lib/projects-data";

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = SITE_URL;

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 1,
        },
        {
            url: `${baseUrl}/projects`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
        },
        ...ALL_PROJECTS.map(({ slug }) => ({
            url: `${baseUrl}${projectPath(slug)}`,
            lastModified: new Date(),
            changeFrequency: "monthly" as const,
            priority: 0.7,
        })),
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: "yearly",
            priority: 0.5,
        },
    ];
}
