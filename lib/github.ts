import type { Activity } from "react-activity-calendar";
import { GITHUB_USERNAME } from "@/lib/social-links";

export type PRState = "MERGED" | "OPEN" | "CLOSED";

export interface PR {
    id: string;
    title: string;
    url: string;
    repository: {
        nameWithOwner: string;
    };
    state: PRState;
    createdAt: string;
    mergedAt: string | null;
    closedAt: string | null;
}

export interface Organization {
    login: string;
    avatarUrl: string;
    url: string;
}

export interface GithubData {
    prs: PR[];
    organizations: Organization[];
    contributions: Activity[];
}

interface SearchPage {
    pageInfo: { hasNextPage: boolean; endCursor: string | null };
    nodes: PR[];
}

interface ContributedRepository {
    url: string;
    owner: { __typename: string; login: string; avatarUrl: string };
}

interface ContributionDay {
    date: string;
    contributionCount: number;
    contributionLevel: string;
}

interface ProfileResponse {
    search: SearchPage;
    user: {
        repositoriesContributedTo: { nodes: ContributedRepository[] };
        contributionsCollection: {
            contributionCalendar: { weeks: { contributionDays: ContributionDay[] }[] };
        };
    };
}

const GRAPHQL_URL = "https://api.github.com/graphql";
const REVALIDATE_SECONDS = 3600;
const PR_SEARCH = `author:${GITHUB_USERNAME} -user:${GITHUB_USERNAME} type:pr`;
const CONTRIBUTION_LEVELS = ["NONE", "FIRST_QUARTILE", "SECOND_QUARTILE", "THIRD_QUARTILE", "FOURTH_QUARTILE"];

const EMPTY_DATA: GithubData = { prs: [], organizations: [], contributions: [] };

const SEARCH_PAGE_FRAGMENT = `
  fragment SearchPageFields on SearchResultItemConnection {
    pageInfo { hasNextPage endCursor }
    nodes {
      ... on PullRequest {
        id
        title
        url
        repository { nameWithOwner }
        state
        createdAt
        mergedAt
        closedAt
      }
    }
  }`;

const PROFILE_QUERY = `query ($login: String!, $search: String!) {
    search(query: $search, type: ISSUE, first: 100) { ...SearchPageFields }
    user(login: $login) {
      repositoriesContributedTo(first: 100, includeUserRepositories: false, contributionTypes: [COMMIT, PULL_REQUEST, PULL_REQUEST_REVIEW, ISSUE]) {
        nodes { url owner { __typename login avatarUrl } }
      }
      contributionsCollection {
        contributionCalendar {
          weeks { contributionDays { date contributionCount contributionLevel } }
        }
      }
    }
  }
  ${SEARCH_PAGE_FRAGMENT}`;

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
    const json = await response.json();
    if (!response.ok || json.errors) {
        throw new Error(`GitHub GraphQL request failed: ${JSON.stringify(json.errors ?? json.message)}`);
    }
    return json.data;
}

async function collectPRs(firstPage: SearchPage): Promise<PR[]> {
    const prs = [...firstPage.nodes];
    let { hasNextPage, endCursor } = firstPage.pageInfo;
    while (hasNextPage) {
        const { search } = await graphql<{ search: SearchPage }>(SEARCH_PAGE_QUERY, { search: PR_SEARCH, after: endCursor });
        prs.push(...search.nodes);
        ({ hasNextPage, endCursor } = search.pageInfo);
    }
    return prs;
}

const latestActivity = (pr: PR) => new Date(pr.mergedAt || pr.closedAt || pr.createdAt).getTime();

const toOrganizations = (repositories: ContributedRepository[]): Organization[] => {
    const byLogin = new Map<string, Organization>();
    for (const { url, owner } of repositories) {
        if (owner.__typename !== "Organization" || byLogin.has(owner.login)) continue;
        byLogin.set(owner.login, { login: owner.login, avatarUrl: owner.avatarUrl, url });
    }
    return [...byLogin.values()];
};

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
        const { search, user } = await graphql<ProfileResponse>(PROFILE_QUERY, { login: GITHUB_USERNAME, search: PR_SEARCH });
        const prs = await collectPRs(search);
        return {
            prs: prs.sort((a, b) => latestActivity(b) - latestActivity(a)),
            organizations: toOrganizations(user.repositoriesContributedTo.nodes),
            contributions: toActivities(user.contributionsCollection.contributionCalendar.weeks),
        };
    } catch (error) {
        console.error("Failed to fetch GitHub data:", error);
        return EMPTY_DATA;
    }
}
