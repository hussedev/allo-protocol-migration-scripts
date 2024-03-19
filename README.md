# migration-scripts

1. Install Dependencies
```bash
bun install
```
2. Create `.env` file from `.env.sample` and populate the variables.
3. Fetch the projects from allo v1 via the indexer
```bash
bun run fetch > fetch-output.txt
```
The result is:
- writes all projects by chainId onto `data/${chainId}.json`
- groups all project by mainnet / testnet based on the env and write it onto `data/profile-master-{mainnet/testnet}-raw.json`. This will be the input file for the next command to create/migrate profiles on allo v2 

4. Remove duplicates by running 
```bash
bun run dedupe  > dedupe-output.txt
```
This will read the raw master file and generate `data/profile-master-{mainnet/testnet}-final.json`

1. Migrate the profiles (make sure you adjust the BATCH_SIZE to control how many profiles are created per transaction)
```bash
bun run migrate
```
The result is:
- write the mapping from allo v1 project -> allo v2 profile onto `data/mapping-${mainnet/testnet}.json`


Note: The mapping are also stored on-chain.
Events are also emmitted 