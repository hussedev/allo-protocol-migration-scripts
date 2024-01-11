import * as dotenv from "dotenv";
import ethers, { Contract } from "ethers";
import fs from "fs";
import { mainnets, testnets } from "../common/networks";
import { AlloV1ToV2Mapping, ProfileData } from "../types";
import { abiEncoder, bulkCreationContract, decodeResultFromCreateProfiles, encodeDataForCreateProfiles } from "../common/client";

dotenv.config();

// ====== CONFIG ====== //
const CHAIN = process.env.CHAIN ?? "testnet";
const CANONICAL_CHAIN_ID = process.env.CANONICAL_CHAIN_ID;
const CHUNK_SIZE = Number(process.env.CHUNK_SIZE);
// ==================== //

export const migrate = async () => {
  // read from master file for each chain

  const FILE_PATH = `./data/profiles-master-${CHAIN}.json`; 

  const profileDatas: ProfileData[] = JSON.parse(fs.readFileSync(FILE_PATH).toString());
  
  const BATCHES = profileDatas.length / CHUNK_SIZE;

  console.table({
    "task": `migrating profiles onto ${CANONICAL_CHAIN_ID}`,
    "input": FILE_PATH,
    "profiles": profileDatas.length,
    "number of transactions": BATCHES,
  });

  let projectToProfileMapping: AlloV1ToV2Mapping[] = [];

  for (let i = 0; i < BATCHES; i++) {
    const batch = profileDatas.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);

    // Get actual data needed for creation
    const profiles = [];
    let encodedProfileData;
    let decodedProfiles: string[] = [];

    for (let j = 0; j < batch.length; j++) {
      const profileData = batch[j];
      profiles.push(profileData.data);
      encodedProfileData = encodeDataForCreateProfiles(profiles);
    }

    // Create profiles
    try {
      console.log("Creating profiles for batch", i);
      
      const staticCallResult = await bulkCreationContract.callStatic.createProfiles(encodedProfileData);
      const createTx = await bulkCreationContract.createProfiles(
        encodedProfileData
      );

      await createTx.wait();
      const response =  staticCallResult.toString();
      console.log("Response from txn:", response);
      decodedProfiles = decodeResultFromCreateProfiles(response);

    } catch (e) {
      // TODO: handle error
      console.log(e);
    }

    // Create the mapping
    for (let j = 0; j < batch.length; j++) {
      const profileData = batch[j];

      projectToProfileMapping.push({
        projectId: profileData.projectId,
        projectChainId: profileData.chainId,
        profileId: decodedProfiles[j] as string,
        profileChainId: Number(CANONICAL_CHAIN_ID),
      });
    }

    // TODO: append mapping in a file for a batch

  }
  // Write mapping to file
  fs.writeFileSync(
    `./data/mapping-${CHAIN}.json`,
    JSON.stringify(projectToProfileMapping, null, 2)
  );

};

migrate();
