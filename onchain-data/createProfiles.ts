import { Registry } from "@allo-team/allo-v2-sdk/";
import { TransactionData } from "@allo-team/allo-v2-sdk/dist/Common/types";
import { ProfileData } from "../types";


export const batchCreateProfiles = async (
  profiles: ProfileData[],
  chain: number
) => {
  const registry = new Registry({ chain: chain });
  

  // make chunks of 50

  for (const profile of profiles) {
    const { nonce, name, metadata, owner, members } = profile;
    
    const txCreateProfile: TransactionData = await registry.createProfile({
      nonce: nonce,
      name: name,
      metadata: {
        protocol: BigInt(0),
        pointer: metadata.pointer,
      },
      owner: owner,
      members: [],
    });
  
  }

};
