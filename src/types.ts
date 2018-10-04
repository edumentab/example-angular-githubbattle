import * as firebase from 'firebase/app';
import { User } from '@firebase/auth-types';

// ------- Types provided by our AuthService ------

export interface AuthInfo {
  token?: string
  user?: User | null
  error?: string
}

// ------- Types for our internal data provided by BattleService and consumed by Combatant component --------

export interface CombatantInfo {
  user: GithubUserFullInfo
  repos: CombatantRepoInfo
  id: string
}

export interface CombatantRepoInfo {
  repos: number
  forks: number
  stars: number
  watchers: number
  mostStarred: {
    stargazers_count: number
    name?: string
  }
  mostWatched: {
    watchers_count: number
    name?: string
  }
  mostForked: {
    forks_count: number
    name?: string
  }
  languages: {
    [idx: string]: number
  }
}

// ------- Types for the return values from the Github API:s that we use --------

export interface GihubUserBasicInfo {
  "login": string
  "id": number
  "node_id": string,
  "avatar_url": string,
  "gravatar_id": string,
  "url": string,
  "html_url": string,
  "followers_url": string,
  "following_url": string,
  "gists_url": string,
  "starred_url": string,
  "subscriptions_url": string,
  "organizations_url": string,
  "repos_url": string,
  "events_url": string,
  "received_events_url": string,
  "type": "User",
  "site_admin": boolean,
}

export interface GithubUserFullInfo extends GihubUserBasicInfo {
  "name": string
  "company": null | string
  "blog": null | string
  "location": string
  "email": null | string
  "hireable": null | string
  "bio": null | string
  "public_repos": number
  "public_gists": number
  "followers": number
  "following": number
  "created_at": string
  "updated_at": string
}

export interface GithubRepo {
  "id": number
  "node_id": string
  "name": string
  "full_name": string
  "private": boolean
  "owner": GihubUserBasicInfo
  "html_url": string
  "description": string
  "fork": boolean
  "url": string
  "forks_url": string
  "keys_url": string
  "collaborators_url": string
  "teams_url": string
  "hooks_url": string
  "issue_events_url": string
  "events_url": string
  "assignees_url": string
  "branches_url": string
  "tags_url": string
  "blobs_url": string
  "git_tags_url": string
  "git_refs_url": string
  "trees_url": string
  "statuses_url": string
  "languages_url": string
  "stargazers_url": string
  "contributors_url": string
  "subscribers_url": string
  "subscription_url": string
  "commits_url": string
  "git_commits_url": string
  "comments_url": string
  "issue_comment_url": string
  "contents_url": string
  "compare_url": string
  "merges_url": string
  "archive_url": string
  "downloads_url": string
  "issues_url": string
  "pulls_url": string
  "milestones_url": string
  "notifications_url": string
  "labels_url": string
  "releases_url": string
  "deployments_url": string
  "created_at": string
  "updated_at": string
  "pushed_at": string
  "git_url": string
  "ssh_url": string
  "clone_url": string
  "svn_url": string
  "homepage": null | string
  "size": number
  "stargazers_count": number
  "watchers_count": number
  "language": null | string
  "has_issues": boolean
  "has_projects": boolean
  "has_downloads": boolean
  "has_wiki": boolean
  "has_pages": boolean
  "forks_count": number
  "mirror_url": null
  "archived": boolean
  "open_issues_count": number
  "license": {
    "key": string
    "name": string
    "spdx_id": string
    "url": string
    "node_id": string
  }
  "forks": number
  "open_issues": number
  "watchers": number
  "default_branch": string
}
