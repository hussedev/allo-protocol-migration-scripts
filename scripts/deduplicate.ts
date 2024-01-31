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

  const deduplicatedProfiles = rawProfileDatas.filter((profileData: any) => (obj: any) => {
    (key => !profileData[key] && (profileData[key] = true))(obj.data.name.join("-")) + "|" + obj.data.owner;
  });

  console.log("total profiles after removing duplicates: ", deduplicatedProfiles.length);

  // Write all profiles to master file
  fs.writeFileSync(
    `./data/profiles-master-${CHAIN}-final.json`,
    JSON.stringify(deduplicatedProfiles, null, 2)
  );
};

deduplicate();