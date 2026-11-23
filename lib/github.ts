import type { Activity } from "react-activity-calendar";
import { GITHUB_USERNAME } from "@/lib/social-links";
import { DOC_FILE_EXTENSIONS, MIN_REPO_STARS, REVALIDATE_SECONDS } from "@/lib/config";

export type PRState = "MERGED" | "OPEN" | "CLOSED";

export interface PR {
    id: string;
    title: string;
    url: string;
    repository: {
        nameWithOwner: string;
        name: string;
        url: string;
        stargazerCount: number;
        owner: { avatarUrl: string };
    };
    files: { nodes: { path: string }[] };
    state: PRState;
    createdAt: string;
    mergedAt: string | null;
    closedAt: string | null;
}

export interface PullRequest {
    id: string;
    title: string;
    url: string;
    repository: string;
    state: PRState;
}

export interface RepositoryContribution {
    nameWithOwner: string;
    name: string;
    url: string;
    avatarUrl: string;
    stars: number;
    merged: [PullRequest, ...PullRequest[]];
}

export interface GithubData {
    prs: PullRequest[];
    repositories: RepositoryContribution[];
    inReview: number;
    contributions: Activity[];
}

interface SearchPage {
    pageInfo: { hasNextPage: boolean; endCursor: string | null };
    nodes: PR[];
}

interface ContributionDay {
    date: string;
    contributionCount: number;
    contributionLevel: string;
}

interface CalendarResponse {
    user: {
        contributionsCollection: {
            contributionCalendar: { weeks: { contributionDays: ContributionDay[] }[] };
        };
    };
}

const GRAPHQL_URL = "https://api.github.com/graphql";
const PR_SEARCH = `author:${GITHUB_USERNAME} -user:${GITHUB_USERNAME} type:pr`;
const CONTRIBUTION_LEVELS = ["NONE", "FIRST_QUARTILE", "SECOND_QUARTILE", "THIRD_QUARTILE", "FOURTH_QUARTILE"];

const EMPTY_DATA: GithubData = { prs: [], repositories: [], inReview: 0, contributions: [] };

const SEARCH_PAGE_FRAGMENT = `
  fragment SearchPageFields on SearchResultItemConnection {
    pageInfo { hasNextPage endCursor }
    nodes {
      ... on PullRequest {
        id
        title
        url
        repository { nameWithOwner name url stargazerCount owner { avatarUrl } }
        files(first: 100) { nodes { path } }
        state
        createdAt
        mergedAt
        closedAt
      }
    }
  }`;

const CALENDAR_QUERY = `query ($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          weeks { contributionDays { date contributionCount contributionLevel } }
        }
      }
    }
  }`;

const SEARCH_PAGE_QUERY = `query ($search: String!, $after: String) {
    search(query: $search, type: ISSUE, first: 100, after: $after) { ...SearchPageFields }
  }
  ${SEARCH_PAGE_FRAGMENT}`;

async function graphql<T>(query: string, variables: Record<string, unknown>): Promise<T> {
    const response = await fetch(GRAPHQL_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN || ""}`,
        },
        body: JSON.stringify({ query, variables }),
        next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!response.ok) {
        throw new Error(`GitHub GraphQL request failed with status ${response.status}`);
    }
    const json = await response.json();
    if (json.errors) {
        throw new Error(`GitHub GraphQL request failed: ${JSON.stringify(json.errors)}`);
    }
    return json.data;
}

async function collectPRs(): Promise<PR[]> {
    const prs: PR[] = [];
    let after: string | null = null;
    do {
        const { search }: { search: SearchPage } = await graphql(SEARCH_PAGE_QUERY, { search: PR_SEARCH, after });
        prs.push(...search.nodes);
        after = search.pageInfo.hasNextPage ? search.pageInfo.endCursor : null;
    } while (after);
    return prs;
}

async function collectActivities(): Promise<Activity[]> {
    const { user } = await graphql<CalendarResponse>(CALENDAR_QUERY, { login: GITHUB_USERNAME });
    return toActivities(user.contributionsCollection.contributionCalendar.weeks);
}

const latestActivity = (pr: PR) => new Date(pr.mergedAt || pr.closedAt || pr.createdAt).getTime();

const toPullRequest = ({ id, title, url, repository, state }: PR): PullRequest => ({ id, title, url, repository: repository.nameWithOwner, state });

const isDocFile = (path: string) => DOC_FILE_EXTENSIONS.some((extension) => path.toLowerCase().endsWith(extension));

const isNotable = (pr: PR) =>
    pr.repository.stargazerCount >= MIN_REPO_STARS && pr.files.nodes.some((file) => !isDocFile(file.path));

const byMergedThenStars = (a: RepositoryContribution, b: RepositoryContribution) =>
    b.merged.length - a.merged.length || b.stars - a.stars;

const toRepositories = (prs: PR[]): RepositoryContribution[] => {
    const byName = new Map<string, RepositoryContribution>();
    for (const pr of prs) {
        if (pr.state !== "MERGED") continue;
        const { nameWithOwner, name, url, stargazerCount, owner } = pr.repository;
        const existing = byName.get(nameWithOwner);
        if (existing) {
            existing.merged.push(toPullRequest(pr));
            continue;
        }
        byName.set(nameWithOwner, { nameWithOwner, name, url, avatarUrl: owner.avatarUrl, stars: stargazerCount, merged: [toPullRequest(pr)] });
    }
    return [...byName.values()].sort(byMergedThenStars);
};

export const byStars = (repositories: RepositoryContribution[]) => [...repositories].sort((a, b) => b.stars - a.stars);

export const mergedCount = (repositories: RepositoryContribution[]) =>
    repositories.reduce((total, repository) => total + repository.merged.length, 0);

const toActivities = (weeks: { contributionDays: ContributionDay[] }[]): Activity[] =>
    weeks.flatMap((week) =>
        week.contributionDays.map((day) => ({
            date: day.date,
            count: day.contributionCount,
            level: Math.max(0, CONTRIBUTION_LEVELS.indexOf(day.contributionLevel)),
        }))
    );

export async function getGithubData(): Promise<GithubData> {
    try {
        const [collected, contributions] = await Promise.all([collectPRs(), collectActivities()]);
        const prs = collected.sort((a, b) => latestActivity(b) - latestActivity(a));
        const notable = prs.filter(isNotable);
        return {
            prs: prs.map(toPullRequest),
            repositories: toRepositories(notable),
            inReview: notable.filter((pr) => pr.state === "OPEN").length,
            contributions,
        };
    } catch (error) {
        console.error("Failed to fetch GitHub data:", error);
        return EMPTY_DATA;
    }
}
