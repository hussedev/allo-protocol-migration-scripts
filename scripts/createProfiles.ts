import * as dotenv from "dotenv";
import ethers, { Contract } from "ethers";
import fs from "fs";
import { abi } from "../abis/BulkCreation";
import { mainnets, testnets } from "../common/networks";
import { ProfileData } from "../types";

dotenv.config();

// ====== CONFIG ====== //
const CHAIN = process.env.CHAIN ?? "testnet";
const supportedChainIds = CHAIN == "testnet" ? testnets : mainnets;
// ==================== //

export const batchCreateProfiles = async (chainId: number) => {
  // read from master file for each chain
  const profileData = fs.readFileSync(`./data/profiles-${chainId}.json`);
  const v1Profiles: ProfileData[] = JSON.parse(profileData.toString());
  console.log(`Found ${v1Profiles.length} profiles for chain ${chainId}`);

  const url = process.env.RPC_URL ?? "https://mainnet.base.org";
  const provider = new ethers.JsonRpcProvider(url);
  const privateKey = process.env.PRIVATE_KEY ?? "";
  const signer = new ethers.Wallet(privateKey, provider);
  const registryContractInstance = new Contract(
    process.env.BULK_REGISTRY_ADDRESS ?? "0x",
    abi,
    signer
  );

  let chunkedProfiles: number = 0;
  let profileIndex: number = 0;

  // break up into chunks of CHUNK_SIZE
  while (chunkedProfiles < v1Profiles.length) {
    const profilesToCreate = [];

    // for each chunk, call createProfiles

    // abi.encode

    try {
      // const tx = await registryContractInstance.createProfiles(profiles);
    } catch (error: any) {
      throw new Error(error);
    }

    chunkedProfiles += 50;
    profileIndex++;
  }

  // for (const profile of profiles) {
  //   const { nonce, name, metadata, owner, members } = profile;
  //   const txCreateProfile: TransactionData = await registry.createProfile({
  //     nonce: nonce,
  //     name: name,
  //     metadata: {
  //       protocol: BigInt(0),
  //       pointer: metadata.pointer,
  //     },
  //     owner: owner,
  //     members: [],
  //   });
  // }
};

batchCreateProfiles(1);
