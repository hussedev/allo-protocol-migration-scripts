import ethers, { Contract } from "ethers";
import { abi } from "../abis/bulkCreateProfile";
import { mainnets, testnets } from "../common/networks";
import { ProfileData } from "../types";

// ====== CONFIG ====== //
const CHAIN = process.env.CHAIN ?? "testnet";
const supportedChainIds = CHAIN == "testnet" ? testnets : mainnets;
// ==================== //

export const batchCreateProfiles = async (
  profiles: ProfileData[],
  chain: number
) => {
  const url = process.env.RPC_URL ?? "https://mainnet.base.org";

  const provider = new ethers.JsonRpcProvider(url);
  const privateKey = "PRIVATE_KEY";
  const signer = new ethers.Wallet(privateKey, provider);
  const registryContractInstance = new Contract(
    process.env.BULK_REGISTRY_ADDRESS ?? "0x",
    abi,
    signer
  );

  // read from master file

  // break up into chunks of CHUNK_SIZE

  // for each chunk, call createProfiles

  // abi.encode

  try {
    // const tx = await registryContractInstance.createProfiles(profiles);
  } catch (error: any) {
    throw new Error(error);
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
