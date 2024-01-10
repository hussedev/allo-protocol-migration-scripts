import { gql, request } from "graphql-request";
import { ProfileData, ProjectData } from "../types";
import { testnets } from "../common/networks";
import fs from "fs";

// ====== CONFIG ====== //
export const graphqlEndpoint = "https://indexer-staging.fly.dev/graphql";
const CHAIN = "testnet";
const supportedChainIds = testnets;
const DEFAULT_NONCE = 1000;
// ==================== //

// mapping from string to number called nonces
const nonces: { [key: string]: number } = {};

const fetchProjectsFromChain = gql`
  query getProjectsFromChain($chainId: number!) {
    projects(condition: {chainId: $chainId}) {
      id
      ownerAddresses
      metadataCid
      metadata
    }
  }
`

const transformProjectsToProfiles = (projects: ProjectData[], chainId: number) => {
  const profiles: ProfileData[] = [];

  for (const project of projects) {
    const { id, ownerAddresses, metadataCid, metadata } = project;
    
    // increment nonce for each owner address
    nonces[ownerAddresses[0]] = nonces[ownerAddresses[0]]++ || DEFAULT_NONCE;

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

    const profile: ProfileData = {
      projectId: id,
      chainId: chainId,
      data: data,
    };

    profiles.push(profile);
  }

  return profiles;
}

export const fetchV1Profiles = async () => {
  const profiles: ProfileData[] = [];

  for (const chainId of supportedChainIds) {

    // fetch project by chain from indexer
    const response: any = await request(
      graphqlEndpoint,
      fetchProjectsFromChain,
      {
        chainId: chainId
      }
    );

    // transform projects to profiles
    const profilesOnChain = transformProjectsToProfiles(response.projects, chainId);

    console.log(`Fetched ${profilesOnChain.length} profiles from chain ${chainId}`);

    profiles.push(...profilesOnChain);

    // Write profiles to file for each chain
    fs.writeFileSync(
      `./data/profiles-${chainId}.json`,
      JSON.stringify(profilesOnChain, null, 2)
    );
  }

  // Write all profiles to master file
  fs.writeFileSync(
    `./data/profiles-master-${CHAIN}.json`,
    JSON.stringify(profiles, null, 2)
  );

  return profiles;
}


fetchV1Profiles();