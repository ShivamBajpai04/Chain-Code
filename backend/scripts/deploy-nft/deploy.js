// Deploys MyToken (the NFT contract) to whatever network `API` points at.
// Usage: node scripts/deploy-nft/deploy.js
import path from "path";
import { fileURLToPath } from "url";
import { ethers } from "ethers";
import dotenv from "dotenv";
import { contractFile } from "./compile.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", "..", ".env") });

const contractBytecode = contractFile.evm.bytecode.object;
const contractAbi = contractFile.abi;

const provider = new ethers.JsonRpcProvider(process.env.API);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

async function main() {
  const network = await provider.getNetwork();
  const balance = await provider.getBalance(wallet.address);
  console.log(`Network: ${network.name} (chainId ${network.chainId})`);
  console.log(`Deployer: ${wallet.address}`);
  console.log(`Balance: ${ethers.formatEther(balance)} ETH`);

  const factory = new ethers.ContractFactory(contractAbi, contractBytecode, wallet);
  console.log("Deploying MyToken...");
  const contract = await factory.deploy(wallet.address);
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  const tx = contract.deploymentTransaction();
  console.log(`Deployed at: ${address}`);
  console.log(`Tx hash: ${tx.hash}`);
}

main().catch((err) => {
  console.error("Deploy failed:", err.message);
  process.exit(1);
});
