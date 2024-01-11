import { Contract, ethers } from "ethers";
import bulkCreation from "../abis/BulkCreation.json";

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

export const encodeDataForCreateProfiles = (data: any[]) : string => {
  return abiEncoder.encode(
    [
      "bytes32[]",
      "uint256[]",
      "string[]",
      "tuple(uint256 protocol, string pointer)[]",
      "address[]",
    ],
    [data]
  );
};

export const decodeResultFromCreateProfiles = (result: string) => {
  return abiEncoder.decode(
    ["bytes32[]"],
    result
  );
};
