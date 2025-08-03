const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

// 🔐 Replace with your real values or set as ENV
const PRIVATE_KEY =
  "0xde9be858da4a475276426320d5e9262ecfc3ba460bfac56360bfa6c4c28b4ee0";
const RPC_URL = "http://127.0.0.1:8545";
const FACTORY_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const FACET_NAMES = [
  "FacetRegistryFacet",
  "OwnershipFacet",
  "DiamondLoupeFacet",
];

function loadArtifact(name) {
  const jsonPath = path.join(__dirname, `${name}.json`);
  if (!fs.existsSync(jsonPath)) {
    throw new Error(`Artifact not found: ${jsonPath}`);
  }
  return JSON.parse(fs.readFileSync(jsonPath, "utf8"));
}

function getUniqueSelectorsFromAbi(abi, seen) {
  const iface = new ethers.Interface(abi);
  const selectors = [];

  for (const fragment of iface.fragments) {
    if (fragment.type === "function") {
      const selector = ethers.id(fragment.format()).slice(0, 10);
      if (!seen.has(selector)) {
        seen.add(selector);
        selectors.push(selector);
      }
    }
  }

  return selectors;
}

async function deployFacet(signer, name, seenSelectors, nonce) {
  const artifact = loadArtifact(name);
  const bytecode = artifact.bytecode?.object || artifact.bytecode;

  if (typeof bytecode !== "string" || !bytecode.startsWith("0x")) {
    throw new Error(`Invalid bytecode for ${name}`);
  }

  console.log(`→ Deploying ${name} (nonce ${nonce})...`);
  const tx = await signer.sendTransaction({
    data: bytecode,
    nonce,
    gasLimit: 5_000_000,
    maxFeePerGas: ethers.parseUnits("50", "gwei"),
    maxPriorityFeePerGas: ethers.parseUnits("2", "gwei"),
  });

  const receipt = await tx.wait();
  const address = receipt.contractAddress;
  await signer.provider.call({
    from: address,
    data: bytecode,
  });

  const code = await signer.provider.getCode(address);
  if (code === "0x") {
    throw new Error(`${name} deployment failed (empty code)`);
  }

  console.log(`✓ ${name} deployed at ${address}`);

  const selectors = getUniqueSelectorsFromAbi(artifact.abi, seenSelectors);

  return {
    facetAddress: address,
    action: 0, // Add
    functionSelectors: selectors,
  };
}

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const signer = new ethers.Wallet(PRIVATE_KEY, provider);

  let nonce = await provider.getTransactionCount(signer.address, "latest");
  console.log(`🔢 Starting with nonce: ${nonce}`);

  const factoryArtifact = loadArtifact("CoreGameFactory");
  const factory = new ethers.Contract(
    FACTORY_ADDRESS,
    factoryArtifact.abi,
    signer,
  );

  const seenSelectors = new Set();
  const facets = [];

  for (const name of FACET_NAMES) {
    const facet = await deployFacet(signer, name, seenSelectors, nonce);
    facets.push(facet);
    nonce++; // increment manually
  }

  console.log("→ Creating CoreGame with facets...");
  const tx = await factory.createCoreGame(facets, { nonce });
  const receipt = await tx.wait();

  const event = receipt.logs
    .map((log) => {
      try {
        return factory.interface.parseLog(log);
      } catch {
        return null;
      }
    })
    .find((log) => log?.name === "CoreGameCreated");

  if (event) {
    console.log(`✅ CoreGame deployed at: ${event.args.coreGameDiamond}`);
  } else {
    console.warn("⚠️ CoreGameCreated event not found in logs.");
  }
}

main().catch((err) => {
  console.error("❌ Deployment failed:", err);
});
