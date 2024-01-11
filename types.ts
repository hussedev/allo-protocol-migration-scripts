export type ProfileData = {
  projectId: string;
  chainId: number;
  data: {
    nonce: number;
    name: string;
    metadata: {
      protocol: number;
      pointer: string;
    };
    owner: string;
    members: string[];
  }
}


export type ProjectData = {
  id: string;
  ownerAddresses: string[];
  metadataCid: string;
  metadata: any;
}

export type AlloV1ToV2Mapping = {
  projectId: string;
  projectChainId: number;
  profileId: string;
  profileChainId: number;
}