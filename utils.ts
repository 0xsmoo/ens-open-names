import { InfuraProvider } from "@ethersproject/providers";
import { Contract } from "ethers-multicall";
import { parse } from "ts-command-line-args";
// @ts-ignore
import words from "an-array-of-english-words";

interface ICheckENSArguments {
  length: number;
  infuraAPIKey: string;
  outputFile: string;
}

export const args = parse<ICheckENSArguments>({
  length: Number,
  infuraAPIKey: String,
  outputFile: String,
});
export const MAX_CONCURRENT_REQUESTS = 50;
export const DOMAIN_ALPHABET: Set<string> = new Set();
[..."abcdefghijklmnopqrstuvwxyz".split("")].map((c) => DOMAIN_ALPHABET.add(c));
const ENS_REGISTRY_CONTRACT_ADDRESS =
  "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e";
const ENS_REGISTRY_ABI = [
  "function owner(bytes32 node) external view returns (address)",
];
export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
export const provider = new InfuraProvider("mainnet", args.infuraAPIKey);
const ENGLISH_WORDS = new Set();
words.forEach((word: string) => ENGLISH_WORDS.add(word));
export const getENSRegistryContract = (): Contract => {
  return new Contract(ENS_REGISTRY_CONTRACT_ADDRESS, ENS_REGISTRY_ABI);
};

export const getPermutations = (
  length: number,
  characters: Set<string>
): Set<string> => {
  if (length === 0) return new Set([""]);
  const prevPermutations = getPermutations(length - 1, characters);
  const permutations: Set<string> = new Set();
  characters.forEach((c) => {
    prevPermutations.forEach((p) => {
      permutations.add(`${c}${p}`);
    });
  });
  return permutations;
};

export const isWord = (s: string): boolean => {
  return ENGLISH_WORDS.has(s);
};
