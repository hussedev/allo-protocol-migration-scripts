import { Contract, ethers } from "ethers";
import bulkCreation from "../abis/BulkCreation.json";
import { ProfileData } from "../types";

export const provider = new ethers.providers.JsonRpcProvider(
  process.env.PROVIDER_URL as string
);

export const signer = new ethers.Wallet(
  process.env.SIGNER_PRIVATE_KEY as string,
  provider
);

export const bulkCreationContract = new ethers.Contract(
  process.env.BULK_CREATION_ADDRESS as string,
  bulkCreation.abi,
  signer
);

export const abiEncoder = ethers.utils.defaultAbiCoder;

export const encodeDataForCreateProfiles = (data: ProfileData[]) : string => {

  let projectIds = [];
  let nonces = [];
  let names = [];
  let metadatas = [];
  let owners = [];

  for(let i = 0; i < data.length; i++) {
    projectIds.push(data[i].projectId);
    nonces.push(data[i].data.nonce);
    names.push(data[i].data.name);
    metadatas.push(data[i].data.metadata);
    owners.push(data[i].data.owner);
  }
  
  return abiEncoder.encode(
    [
      "bytes32[]",
      "uint256[]",
      "string[]",
      "tuple(uint256 protocol, string pointer)[]",
      "address[]",
    ],
    [
      projectIds,
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
