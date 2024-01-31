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
  roles: Role[];
  metadataCid: string;
  metadata: any;
}

type Role = {
  address: string;
}

export type AlloV1ToV2Mapping = {
  projectId: string;
  projectChainId: number;
  profileId: string;
  profileChainId: number;
}