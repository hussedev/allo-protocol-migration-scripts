import * as dotenv from "dotenv";
import fs from "fs";
import { ProfileData } from "../types";

dotenv.config();

// ====== CONFIG ====== //
const CHAIN = process.env.CHAIN ?? "testnet";
// ==================== //

const deduplicate = () => {
  // read from raw master file for each chain

  const FILE_PATH = `./data/profiles-master-${CHAIN}-raw.json`;

  const rawProfileDatas: ProfileData[] = JSON.parse(
    fs.readFileSync(FILE_PATH).toString()
  );
  
  console.log("Total profiles with duplicates : ", rawProfileDatas.length);

  let seenProfiles: { [x: string]: boolean; } = {};
  let duplicateProfiles: ProfileData[] = [];

 const deduplicatedProfiles = rawProfileDatas.filter((profileData) => {
    // Create a key for each profile
    const key = `${profileData.data.name.replace(/\s/g, "*")}|${profileData.data.owner}`;
  
    // Check if the profile is a duplicate
    if (seenProfiles[key]) {
      duplicateProfiles.push(profileData);
      return false; // Exclude duplicate from the final array
    } else {
      seenProfiles[key] = true;
      return true; // Include non-duplicate in the final array
    }
  });

  console.log("Total profiles after removing duplicates: ", deduplicatedProfiles.length);

  // Log duplicates
  console.log("Duplicate profiles: ", duplicateProfiles.length);

  // Write all duplicates to duplicates master file
  fs.writeFileSync(
    `./data/profiles-master-${CHAIN}-duplicates.json`,
    JSON.stringify(duplicateProfiles, null, 2)
  );

  // Write all profiles to final master file
  fs.writeFileSync(
    `./data/profiles-master-${CHAIN}-final.json`,
    JSON.stringify(deduplicatedProfiles, null, 2)
  );
};

deduplicate();