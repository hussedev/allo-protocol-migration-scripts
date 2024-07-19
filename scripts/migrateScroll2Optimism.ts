import {
  registryAbi,
  registryContract,
  ScrollProjectData,
  scrollProjects,
} from "./scrollMigration";

import { ethers } from "ethers";

interface ProfileData {
  nonce: number;
  name: string;
  metadata: {
    protocol: number;
    pointer: string;
  };
  owner: string;
  members: string[];
}

const provider = new ethers.providers.JsonRpcProvider(
  process.env.PROVIDER_URL as string
);

const signer = new ethers.Wallet(
  process.env.SIGNER_PRIVATE_KEY as string,
  provider
);
// console.log("signer:", signer);

const registryCreationContract = new ethers.Contract(
  registryContract,
  registryAbi,
  signer
);
// console.log("registryCreationContract:", registryCreationContract);

export const migrate = async () => {
  console.log("MIGRATE");
  const profileDatas: ProfileData[] = scrollProjects.map(
    ({
      project: { nonce, name, createdByAddress: owner, metadataCid },
    }: ScrollProjectData) => ({
      nonce: Number(nonce),
      name,
      metadata: { protocol: 1, pointer: metadataCid },
      owner: process.env.OWNER as string,
      members: [owner],
    })
  );
  for (let i = 0; i < profileDatas.length; i++) {
    const profile = profileDatas[i];
    console.log("Profile:", profile, i);
    const staticCallResult =
      await registryCreationContract.callStatic.createProfile(
        profile.nonce,
        profile.name,
        [profile.metadata.protocol, profile.metadata.pointer],
        profile.owner,
        profile.members
      );
    console.log("staticCallResult:", staticCallResult, i);

    const createTx = await registryCreationContract.createProfile(
      profile.nonce,
      profile.name,
      [profile.metadata.protocol, profile.metadata.pointer],
      profile.owner,
      profile.members
    );

    console.log("Txn hash:", createTx.hash);

    await createTx.wait();
    const response = staticCallResult.toString();
    console.log("Response from txn:", response);
  }
};

migrate();
