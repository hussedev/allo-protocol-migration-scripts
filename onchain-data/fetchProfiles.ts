import { gql, request } from "graphql-request";
import { ProfileData, ProjectData } from "../types";

export const graphqlEndpoint = "https://indexer-staging.fly.dev/graphql";

const supportedChainIds = [
  1, // mainnet
];

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

const transformProjectsToProfiles = (projects: ProjectData[]) => {
  const profiles: ProfileData[] = [];

  for (const project of projects) {
    const { id, ownerAddresses, metadataCid, metadata } = project;

    const profile: ProfileData = {
      nonce: 0,
      name: metadata["name"],
      metadata: {
        protocol: 0,
        pointer: metadataCid,
      },
      owner: ownerAddresses[0],
      members: ownerAddresses,
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
        chainId: chainId,
        offset: 0
      }
    );

    // transform projects to profiles
    const profilesOnChain = transformProjectsToProfiles(response.projects);

    profiles.push(profilesOnChain);
  }

  return profiles;
}