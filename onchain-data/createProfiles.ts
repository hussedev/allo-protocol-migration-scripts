import { createV1ToV2Mapping } from "../offchain-data/createMappings";

export const createV2Profiles = async () => {
  // TODO: create a new profile for each v1 profile
  console.log("Creating v2 profiles \n");

  // TODO: fetch the v1 profiles from the database

  // TODO: create a new profile for each v1 profile

  console.log("V2 profiles created \n");

  // TODO: create the mappings from v1 to v2 profiles
  createV1ToV2Mapping({});
};
