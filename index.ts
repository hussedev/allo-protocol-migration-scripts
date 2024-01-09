import { migrateProfiles } from "./profile/migrateProfiles";

function main() {
  console.log("Starting migration script \n");

  migrateProfiles();

  console.log("Profile migration from v1 to v2 complete 🥳 \n");
}

main();
