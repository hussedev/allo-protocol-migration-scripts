import { storeV1Profiles } from "../offchain-data/storeProfiles";

export const indexerUrl = "https://indexer.com";

export const fetchV1Profiles = async () => {
  console.log("Fetching profiles from v1 \n");

  const headers = new Headers();
  headers.append("Content-Type", "application/json");

  const request = new Request(indexerUrl, {
    method: "GET",
    headers: headers,
    mode: "cors",
  });

  // fetch all profiles from the indexer for v1
  fetch(request)
    .then((response) => {
      if (response.status >= 200 && response.status < 300) {
        // Store them in the database
        storeV1Profiles(response);
      } else {
        throw new Error("Error fetching v1 profile data");
      }
    })
    .catch((err) => {
      console.error(err);
    });
};
