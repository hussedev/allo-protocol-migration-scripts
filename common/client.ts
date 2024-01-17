import { Contract, ethers } from "ethers";
import alloV1ToV2ProfileMigration from "../abis/AlloV1ToV2ProfileMigration.json";
import { ProfileData } from "../types";

export const provider = new ethers.providers.JsonRpcProvider(
  process.env.PROVIDER_URL as string
);

export const signer = new ethers.Wallet(
  process.env.SIGNER_PRIVATE_KEY as string,
  provider
);

export const bulkCreationContract = new ethers.Contract(
  process.env.ALLO_V1_TO_V2_PROFILE_MIGRATION_ADDRESS as string,
  alloV1ToV2ProfileMigration.abi,
  signer
);

export const abiEncoder = ethers.utils.defaultAbiCoder;

export const encodeDataForCreateProfiles = (data: ProfileData[]) : string => {

  let projectIds = [];
  let sourceChainIds = [];
  let nonces = [];
  let names = [];
  let metadatas = [];
  let owners = [];

  for(let i = 0; i < data.length; i++) {
    projectIds.push(data[i].projectId);
    sourceChainIds.push(data[i].chainId);
    nonces.push(data[i].data.nonce);
    names.push(data[i].data.name);
    metadatas.push(data[i].data.metadata);
    owners.push(data[i].data.owner);
  }

  console.log("projectIds", projectIds);
  console.log("sourceChainIds", projectIds);
  console.log("nonces", nonces);
  console.log("names", names);
  console.log("metadatas", metadatas);
  console.log("owners", owners);
  
  return abiEncoder.encode(
    [
      "bytes32[]",
      "uint256[]",
      "uint256[]",
      "string[]",
      "tuple(uint256 protocol, string pointer)[]",
      "address[]",
    ],
    [
      projectIds,
      sourceChainIds,
      nonces,
      names,
      metadatas,
      owners,
    ]
  );
};

export const decodeResultFromCreateProfiles = (result: string) => {
  return abiEncoder.decode(["bytes32[]"], result)[0] as string[];
};
