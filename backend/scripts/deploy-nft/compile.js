import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import solc from "solc";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const filePath = path.resolve(__dirname, "MyToken.sol");
const source = fs.readFileSync(filePath, "utf8");

// OpenZeppelin lives in the backend's own node_modules, two levels up
const basePath = path.resolve(__dirname, "..", "..", "node_modules", "@openzeppelin", "contracts");

function findImports(importPath) {
  try {
    const fullPath = path.resolve(basePath, importPath.replace("@openzeppelin/contracts/", ""));
    const content = fs.readFileSync(fullPath, "utf8");
    return { contents: content };
  } catch (e) {
    return { error: "File not found" };
  }
}

const input = {
  language: "Solidity",
  sources: {
    "MyToken.sol": { content: source },
  },
  settings: {
    outputSelection: {
      "*": { "*": ["abi", "evm.bytecode.object"] },
    },
  },
};

const compiled = JSON.parse(solc.compile(JSON.stringify(input), { import: findImports }));

if (compiled.errors) {
  const fatal = compiled.errors.filter((e) => e.severity === "error");
  if (fatal.length) {
    console.error(fatal.map((e) => e.formattedMessage).join("\n"));
    throw new Error("Solidity compilation failed");
  }
}

if (!compiled.contracts?.["MyToken.sol"]?.["MyToken"]) {
  throw new Error("Compilation succeeded but MyToken contract not found in output");
}

export const contractFile = compiled.contracts["MyToken.sol"]["MyToken"];
