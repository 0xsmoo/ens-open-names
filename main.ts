import { Presets, SingleBar } from "cli-progress";
import fs from "fs";
import { Provider } from "ethers-multicall";
import { namehash } from "ethers/lib/utils";
import {
  args,
  DOMAIN_ALPHABET,
  getENSRegistryContract,
  getPermutations,
  MAX_CONCURRENT_REQUESTS,
  provider,
  ZERO_ADDRESS,
} from "./utils";

const findOpenENSDomains = async (
  domains: Set<string>,
  chunkSize: number = 1000
): Promise<Set<string>> => {
  // Setup multicall provider
  const multicallProvider = new Provider(provider);
  await multicallProvider.init();
  const ensRegistry = getENSRegistryContract();
  const openDomains: Set<string> = new Set();

  // Helper function for chunked calls
  const updateOpenDomains = async (domains: string[]): Promise<void> => {
    const ownerCalls = domains.map((d) =>
      ensRegistry.owner(namehash(`${d}.eth`))
    );
    const owners = await multicallProvider.all(ownerCalls);
    for (let i = 0; i < domains.length; i++) {
      if (owners[i] === ZERO_ADDRESS) openDomains.add(domains[i]);
    }
  };

  // Create a progress bar
  const progress = new SingleBar({}, Presets.rect);
  progress.start(domains.size, 0);

  const updateOpenDomainsWithChunk = async (chunk: string[]): Promise<void> => {
    await updateOpenDomains(chunk);
    progress.increment(chunk.length);
  };

  const domainChunks = [...domains];
  const updates = [];
  while (domainChunks.length > 0) {
    if (updates.length >= MAX_CONCURRENT_REQUESTS) {
      await Promise.all(updates);
      updates.splice(0, updates.length);
    }
    const chunk = domainChunks.splice(0, chunkSize);
    updates.push(updateOpenDomainsWithChunk(chunk));
  }
  await Promise.all(updates);
  progress.stop();
  return openDomains;
};

const main = async () => {
  const permutations = getPermutations(args.length, DOMAIN_ALPHABET);
  const openDomains = await findOpenENSDomains(permutations);
  fs.writeFileSync(args.outputFile, JSON.stringify([...openDomains].sort()));
};

main();
