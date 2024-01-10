export type Network = {
  id: string;
  name?: string;
};

export const networks: Network[] = [
  {
    id: "1",
    name: "mainnet",
  },
  {
    id: "10",
    name: "optimism",
  },
  {
    id: "137",
    name: "polygon",
  },
  {
    id: "250",
    name: "fantom",
  },
  {
    id: "280",
    name: "zksync-era-testnet",
  },
  {
    id: "324",
    name: "zksync-era-mainnet",
  },
  {
    id: "42161",
    name: "arbitrum-one",
  },
  {
    id: "421613",
    name: "arbitrum-goerli",
  },
  {
    id: "424",
    name: "pgn-mainnet",
  },
  // No profiles on these networks yet
  // {
  //   id: "80001",
  //   name: "polygon-mumbai",
  // },
  // {
  //   id: "8453",
  //   name: "base",
  // },
];
