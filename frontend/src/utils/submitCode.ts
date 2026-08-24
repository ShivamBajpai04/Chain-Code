import api from "./api";

function formatCode(input: string) {
  let formattedCode = input.replace(/\\n/g, "\n");
  formattedCode = formattedCode.replace(/\\\\/g, "\\");
  formattedCode = formattedCode.replace(/\\"/g, '"');
  return formattedCode;
}

async function mintNFT(submissionId: string) {
  const mint = await api.post(
    `/nft/mint/${submissionId}`,
    {},
    {
      // the mint is a real on-chain confirmation wait (observed ~23s on
      // Sepolia under normal load, but testnets stall under congestion) —
      // give it real room rather than falsely reporting failure on a mint
      // that's actually still going to succeed. The UI shows a "taking a
      // while" notice well before this fires, so the user isn't just staring
      // at a spinner for up to 5 minutes with no feedback.
      timeout: 5 * 60_000,
    }
  );
  return mint;
}

// Judging happens entirely server-side now: the backend owns the test cases
// (expected outputs are never sent to the browser) and talks to Judge0 via a
// configurable execution provider. The browser just posts code and gets
// per-testcase verdicts back.
export interface JudgeResult {
  status: { id: number; description?: string };
  stdout: string | null;
  stderr: string | null;
  compile_output: string | null;
  time: number | null;
  memory: number | null;
}

async function judge(problemId: string | undefined, language: number, code: string) {
  const response = await api.post(
    `/execute/${problemId}`,
    { code: formatCode(code), language },
    {
      // batched judging of every test case plus originality check downstream;
      // give the whole pipeline room instead of failing on a slow poll cycle
      timeout: 3 * 60_000,
    }
  );

  return response.data.results as JudgeResult[];
}

async function addToDB(problemId: string | undefined, code: string, language: number) {
  const saveSubmissionResponse = await api.post(
    "/submissions/submit",
    {
      problemId: problemId,
      code: formatCode(code),
      language: language.toString(),
    }
  );
  return saveSubmissionResponse;
}

export type SubmitPhase = "judging" | "verifying" | "minting";

export async function submitCode(
  selectedProblem: any,
  language: number,
  code: string,
  onPhaseChange?: (phase: SubmitPhase) => void,
  // awaited right before the irreversible on-chain mint; returning false
  // cancels (the submission itself is already saved)
  confirmMint?: () => Promise<boolean>
) {
  try {
    onPhaseChange?.("judging");
    const results = await judge(selectedProblem?._id, language, code);
    const allTestsPassed = results.every((result) => result.status.id === 3); // 3 is the status ID for "Accepted"

    if (allTestsPassed) {
      onPhaseChange?.("verifying");
      const saveSubmissionResponse = await addToDB(
        selectedProblem?._id,
        code,
        language
      );
      if (saveSubmissionResponse.status !== 201) {
        console.error(
          "Failed to save submission:",
          saveSubmissionResponse.data
        );
        return { error: "Failed to save submission" };
      }
      const submissionId = saveSubmissionResponse.data.submissionId;

      if (confirmMint) {
        const confirmed = await confirmMint();
        if (!confirmed) {
          return {
            cancelled: true,
            error:
              "Mint cancelled. Your solution was saved — you can still view it, but no certificate was created.",
          };
        }
      }

      onPhaseChange?.("minting");
      let mintTxHash: string | undefined;
      try {
        const mint = await mintNFT(submissionId);
        if (mint.status !== 201) {
          return {
            error: "Your solution passed and was saved, but minting the certificate failed.",
          };
        }
        mintTxHash = mint.data.mintTxHash;
      } catch (mintError: any) {
        console.error("Error minting NFT:", mintError.message);
        // the backend now always answers (even on a chain-level error), so a
        // real response here means minting genuinely failed — say so plainly.
        // A client-side timeout with no response is different: the mint may
        // still be confirming on-chain and could still succeed, so don't
        // assert it failed — check My NFTs is the honest answer.
        if (mintError.response?.data?.error) {
          return {
            error: `Your solution passed and was saved, but minting failed: ${mintError.response.data.error}`,
          };
        }
        return {
          error:
            "Your solution passed and was saved, but minting is taking longer than expected. Check My NFTs in a moment — it may still complete.",
        };
      }

      return { results, allTestsPassed, submissionId, mintTxHash };
    } else {
      const passedCount = results.filter((r) => r.status.id === 3).length;
      return {
        results,
        allTestsPassed,
        error: `${passedCount}/${results.length} test cases passed — fix the failing ones and resubmit.`,
      };
    }
  } catch (error: any) {
    if (error.response && error.response.status === 400) {
      // surface the server's actual reason (uniqueness, rate limit,
      // validation…) instead of assuming every 400 means "not unique"
      const serverMsg =
        error.response?.data?.message ||
        error.response?.data?.msg ||
        error.response?.data?.error;
      return { error: serverMsg || "The server rejected this submission." };
    }
    console.error("Error submitting code:", error.message);
    return { error: "An error occurred while submitting your code." };
  }
}
