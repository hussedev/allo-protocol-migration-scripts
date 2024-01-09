// Path: migration-scripts/profile/migrateProfiles.ts

const indexerUrl = "https://indexer.com";

export const migrateProfiles = async () => {
  console.table("Migrating profiles from v1 to v2");

  // Fetch all profiles from the indexer for v1
  fetchV1Profiles();

  // Store them in the database
  storeV1Profiles();

  // Create a new profile for each fetched profile
  createV2Profiles();

  // create a mapping from v1 profile to v2 profile
  createV1ToV2Mapping();

  // Post the new profiles to the indexer for v2
  postV2Profiles();
};

const fetchV1Profiles = async () => {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");

  const request = new Request(indexerUrl, {
    method: "GET",
    headers: headers,
    mode: "cors",
  });

  fetch(request)
    .then((response) => {
      if (response.status >= 200 && response.status < 300) {
        // save the response in the database
      } else {
        throw new Error("Error fetching v1 profile data");
      }
    })
    .catch((err) => {
      console.error(err);
    });
};

const storeV1Profiles = async () => {
  // store the profiles in the database
};

const createV2Profiles = async () => {
  // create a new profile for each v1 profile
};

const createV1ToV2Mapping = async () => {
  // create a mapping from v1 profile to v2 profile
};

const postV2Profiles = async () => {
  // post the new profiles to the indexer
  const headers = new Headers();
  headers.append("Content-Type", "application/json");

  const request = new Request(indexerUrl, {
    method: "GET",
    headers: headers,
    mode: "cors",
  });

  fetch(request)
    .then((response) => {
      if (response.status >= 200 && response.status < 300) {
        // save the response in the database
      } else {
        throw new Error("Error posting back v2 profile data");
      }
    })
    .catch((err) => {
      console.error(err);
    });
};
