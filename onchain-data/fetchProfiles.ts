import { Network, networks } from "../common/networks";
// import { storeV1Profiles } from "../offchain-data/storeProfiles";
// import { Client as AlloClient } from "allo-indexer-client";

export const indexerUrl = "https://indexer-production.fly.dev/data";

export const fetchV1Profiles = async () => {
  console.log("Fetching profiles from v1 \n");

  const headers = new Headers();
  headers.append("Content-Type", "application/json");

  let request: any;

  // loop through the supported networks
  const supportedNetworks = networks;
  supportedNetworks.forEach((network: Network) => {
    request = new Request(`${indexerUrl}/${network.id}/projects.json`, {
      method: "GET",
      headers: headers,
      mode: "cors",
    });

    // fetch all profiles from the indexer for v1
    fetch(request)
      .then(async (response: any) => {
        if (response.status >= 200 && response.status < 300) {
          console.log(
            "Successfully fetched v1 profile data \n",
            await response
          );

          // Store them in the database
          // storeV1Profiles(response);
        } else {
          throw new Error("Error fetching v1 profile data");
        }
      })
      .catch((err) => {
        console.error(err);
      });
  });

  // Use the indexer like builder does here...
  // const client = new AlloClient(
  //   fetch,
  //   indexerUrl,
  //   ""
  // );

  // const profiles = await client.getProfiles();
};
