// // Path: migration-scripts/profile/migrateProfiles.ts

// import {
//   postV2Profiles
// } from "../offchain-data/storeProfiles";
// import { fetchV1Profiles } from "../scripts/fetchProfiles";

// export const migrateProfiles = async () => {
//   console.table("Migrating profiles from v1 to v2 \n");

//   // Fetch all profiles from the indexer for v1 and store in database
//   await fetchV1Profiles();

//   // Create a new profile for each fetched profile
//   await createV2Profiles();

//   // Post the new profiles to the indexer for v2
//   await postV2Profiles();

//   console.table("Profile migration from v1 to v2 complete 🥳 \n");
// };
