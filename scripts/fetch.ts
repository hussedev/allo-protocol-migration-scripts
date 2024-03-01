import fs from "fs";
import { gql, request } from "graphql-request";
import { mainnets, testnets } from "../common/networks";
import { ProfileData, ProjectData } from "../types";

// ====== CONFIG ====== //
export const graphqlEndpoint = "https://indexer-staging.fly.dev/graphql";
const CHAIN = process.env.CHAIN ?? "testnet";
const supportedChainIds = CHAIN == "testnet" ? testnets : mainnets;
const DEFAULT_NONCE = Math.floor(Math.random() * 9000) + 1000;
// ==================== //

// mapping from string to number called nonces
const nonces: { [key: string]: number } = {};

/**
 * Fetch projects from indexer query.
 */
const fetchProjectsFromChain = gql`
  query getProjectsFromChain($chainId: Int!) {
    projects(
      filter: {
        tags: { equalTo: "allo-v1" }
        metadata: { isNull: false }
        chainId: { equalTo: $chainId }
        roles: { every: { role: { equalTo: OWNER } } }
      }
    ) {
      id
      projectNumber
      roles {
        address
      }
      metadataCid
      metadata
    }
  }
`;

/**
 * Transform v1 projects to profiles.
 */
const transformProjectsToProfiles = (
  projects: ProjectData[],
  chainId: number,
) => {
  console.log(
    `Transforming ${projects.length} projects to profiles for chain ${chainId}`,
  );
  const profiles: ProfileData[] = [];

  for (const project of projects) {
    const { id, roles, metadataCid, metadata } = project;
    const ownerAddress = roles[0].address;

    // increment nonce for each owner address
    nonces[ownerAddress] = nonces[ownerAddress]
      ? ++nonces[ownerAddress]
      : DEFAULT_NONCE;

    // create profile data needed for allo v2
    const data = {
      nonce: nonces[ownerAddress],
      name: metadata["title"] || metadata["name"],
      metadata: {
        protocol: 1,
        pointer: metadataCid,
      },
      owner: ownerAddress,
      members: [],
    };

    // console.log(data);

    const profile: ProfileData = {
      projectId: id,
      projectNumber: project.projectNumber,
      chainId: chainId,
      data: data,
    };

    if (!profile.data.name) {
      console.log("no name for profile: ", profile);
    } else {
      profiles.push(profile);
    }
  }

  return profiles;
};

/**
 * Fetch v1 projects from indexer and transform to profiles ready for v2 profile creation.
 */
export const fetchV1Profiles = async () => {
  const profiles: ProfileData[] = [];

  for (const chainId of supportedChainIds) {
    // fetch project by chain from indexer
    const response: any = await request(
      graphqlEndpoint,
      fetchProjectsFromChain,
      {
        chainId: chainId,
      },
    );

    // transform v1 projects to profiles
    const profilesOnChain = transformProjectsToProfiles(
      response.projects,
      chainId,
    );

    profiles.push(...profilesOnChain);

    // Write profiles to file for each chain
    fs.writeFileSync(
      `./data/profiles-${chainId}.json`,
      JSON.stringify(profilesOnChain, null, 2),
    );

    console.log(`total profiles for ${chainId}: `, profilesOnChain.length);
  }

  // Write all profiles to master file
  fs.writeFileSync(
    `./data/profiles-master-${CHAIN}-raw.json`,
    JSON.stringify(profiles, null, 2),
  );

  console.log("total profiles: ", profiles.length);

  return profiles;
};

fetchV1Profiles();
