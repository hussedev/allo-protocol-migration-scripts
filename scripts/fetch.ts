import fs from "fs";
import { gql, request } from "graphql-request";
import { mainnets, testnets } from "../common/networks";
import { ProfileData, ProjectData } from "../types";

// ====== CONFIG ====== //
export const graphqlEndpoint = "https://indexer-staging.fly.dev/graphql";
const CHAIN = process.env.CHAIN ?? "testnet";
const supportedChainIds = CHAIN == "testnet" ? testnets : mainnets;
const DEFAULT_NONCE = 1000;
// ==================== //

// mapping from string to number called nonces
const nonces: { [key: string]: number } = {};

/**
 * Fetch projects from indexer query.
 */
const fetchProjectsFromChain = gql`
  query getProjectsFromChain($chainId: Int!) {
    projects(
      condition: { chainId: $chainId }
      filter: { metadata: { isNull: false } }
    ) {
      id
      ownerAddresses
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
    const { id, ownerAddresses, metadataCid, metadata } = project;

    // increment nonce for each owner address
    nonces[ownerAddresses[0]] = nonces[ownerAddresses[0]]
      ? ++nonces[ownerAddresses[0]]
      : DEFAULT_NONCE;

    // create profile data needed for allo v2
    const data = {
      nonce: nonces[ownerAddresses[0]],
      name: metadata["title"],
      metadata: {
        protocol: 1,
        pointer: metadataCid,
      },
      owner: ownerAddresses[0],
      members: [],
    };

    // console.log(data);

    const profile: ProfileData = {
      projectId: id,
      chainId: chainId,
      data: data,
    };

    profiles.push(profile);
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
    `./data/profiles-master-${CHAIN}.json`,
    JSON.stringify(profiles, null, 2),
  );

  console.log("total profiles: ", profiles.length);

  return profiles;
};

fetchV1Profiles();
