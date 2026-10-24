import { GITHUB_USERNAME } from "@/lib/social-links";

export interface PR {
    id: number;
    title: string;
    url: string;
    repository: {
        nameWithOwner: string;
    };
    state: string;
    createdAt: string;
    mergedAt?: string;
    closedAt?: string;
}

export interface Organization {
    login: string;
    avatarUrl: string;
    url: string;
}

export interface GithubData {
    merged: PR[];
    open: PR[];
    closed: PR[];
    organizations: Organization[];
}

interface GraphQLEdge<T> {
    node: T;
}

interface ContributedRepository {
    url: string;
    owner: { __typename: string; login: string; avatarUrl: string };
}

const EMPTY_DATA: GithubData = { merged: [], open: [], closed: [], organizations: [] };

const prSearch = (alias: string, filters: string) => `
    ${alias}: search(query: "author:${GITHUB_USERNAME} -user:${GITHUB_USERNAME} type:pr ${filters}", type: ISSUE, first: 12) {
      edges { node { ...PRFields } }
    }`;

const query = `query {
    ${prSearch("merged", "is:merged")}
    ${prSearch("open", "is:open")}
    ${prSearch("closed", "is:closed is:unmerged")}
    user(login: "${GITHUB_USERNAME}") {
      repositoriesContributedTo(first: 100, includeUserRepositories: false, contributionTypes: [COMMIT, PULL_REQUEST, PULL_REQUEST_REVIEW, ISSUE]) {
        nodes { url owner { __typename login avatarUrl } }
      }
    }
  }
  fragment PRFields on PullRequest {
    id
    title
    url
    repository { nameWithOwner }
    state
    createdAt
    mergedAt
    closedAt
  }`;

const latestActivity = (pr: PR) => new Date(pr.mergedAt || pr.closedAt || pr.createdAt).getTime();

const processEdges = (edges: GraphQLEdge<PR>[] | undefined): PR[] =>
    (edges ?? []).map((edge) => edge.node).sort((a, b) => latestActivity(b) - latestActivity(a));

const toOrganizations = (repositories: ContributedRepository[] | undefined): Organization[] => {
    const byLogin = new Map<string, Organization>();
    for (const { url, owner } of repositories ?? []) {
        if (owner.__typename !== "Organization" || byLogin.has(owner.login)) continue;
        byLogin.set(owner.login, { login: owner.login, avatarUrl: owner.avatarUrl, url });
    }
    return [...byLogin.values()];
};

export async function getGithubData(): Promise<GithubData> {
    try {
        const response = await fetch("https://api.github.com/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN || ""}`,
            },
            body: JSON.stringify({ query }),
            next: { revalidate: 3600 },
        });

        const json = await response.json();

        if (json.errors) {
            console.error("GitHub API Errors:", json.errors);
            return EMPTY_DATA;
        }

        return {
            merged: processEdges(json.data?.merged?.edges),
            open: processEdges(json.data?.open?.edges),
            closed: processEdges(json.data?.closed?.edges),
            organizations: toOrganizations(json.data?.user?.repositoriesContributedTo?.nodes),
        };
    } catch (error) {
        console.error("Failed to fetch PRs:", error);
        return EMPTY_DATA;
    }
}
