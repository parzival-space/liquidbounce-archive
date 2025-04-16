import axios, { type AxiosResponse } from 'axios'

interface LiquidBounceBranchesResponse {
  branches: string[],
  defaultBranch: string,
  default_branch: string,
}

export interface LiquidBounceBuild {
  build_id: number,
  commit_id: string,
  branch: string,
  subsystem: string,
  lb_version: string,
  mc_version: string,
  release: boolean,
  date: string,
  message: string,
  url: string,
  jre_version: number,
  jre_distribution: string,
  fabric_api_version: string,
  fabric_loader_version: string,
  kotlin_version: string,
  kotlin_mod_version: string
}

const apiClient = axios.create({
  baseURL: `https://api.liquidbounce.net`,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

export const getBranches = async (): Promise<string[]> => {
  const response: AxiosResponse<LiquidBounceBranchesResponse> =
    await apiClient.get('/api/v1/version/branches');

  if (response.status !== 200) {
    throw new Error(`Error fetching branches: ${response.statusText}`);
  }

  return response.data.branches;
}

export const getBuildsOfBranch = async (branch: string, onlyReleases: boolean): Promise<LiquidBounceBuild[]> => {
  const response: AxiosResponse<LiquidBounceBuild[]> =
    await apiClient.get(`/api/v1/version/builds/${branch}/${onlyReleases ? 'release' : ''}`);

  if (response.status !== 200) {
    throw new Error(`Error fetching builds: ${response.statusText}`);
  }

  // sort by version
  // 0.1.7
  // b96
  // a10
  // sort highest to lowest
  return response.data;
}

export const lbVersionSorter = (aVersion: LiquidBounceBuild, bVersion: LiquidBounceBuild): number => {
  // some version begin with a for alpha and b for beta and some are semver
  // alpha and beta version are sorted before semver
  // alpha is sorted before beta
  // semver is sorted by major, minor, patch

  const isAlphaA = aVersion.lb_version.startsWith('a');
  const isAlphaB = bVersion.lb_version.startsWith('a');
  const isBetaA = aVersion.lb_version.startsWith('b');
  const isBetaB = bVersion.lb_version.startsWith('b');
  const isSemverA = !isAlphaA && !isBetaA;
  const isSemverB = !isAlphaB && !isBetaB;

  // one is semver or beta
  if (isAlphaA && (isBetaB || isSemverB)) return -1;
  if (isAlphaB && (isBetaA || isSemverA)) return 1;

  // one is semver
  if (isBetaA && isSemverB) return -1;
  if (isBetaB && isSemverA) return 1;

  // compare beta and alpha versions
  if ((isAlphaB && isAlphaB) || (isBetaA && isBetaB)) {
    return Number(aVersion.lb_version.slice(1)) - Number(bVersion.lb_version.slice(1));
  }

  // compare semver versions
  const [majorA, minorA, patchA] = aVersion.lb_version.split('.').map(Number);
  const [majorB, minorB, patchB] = bVersion.lb_version.split('.').map(Number);
  if (majorA !== majorB) return majorA - majorB;
  if (minorA !== minorB) return minorA - minorB;
  if (patchA !== patchB) return patchA - patchB;

  // if they are equal, sort by build id
  return aVersion.build_id - bVersion.build_id;
};
