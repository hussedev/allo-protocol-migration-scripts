export type ProfileData = {
  nonce: number;
  name: string;
  metadata: {
    protocol: number;
    pointer: string;
  };
  owner: string;
  members: string[];
}


export type ProjectData = {
  id: string;
  ownerAddresses: string[];
  metadataCid: string;
  metadata: any;
}