import axios from "axios";

function formatCode(input: string) {
  let formattedCode = input.replace(/\\n/g, "\n");
  formattedCode = formattedCode.replace(/\\\\/g, "\\");
  formattedCode = formattedCode.replace(/\\"/g, '"');
  return formattedCode;
}

async function mintNFT(submissionId: string) {
  const token = window.localStorage.getItem("token");

  const mint = await axios.post(
    `${import.meta.env.VITE_DOMAIN}/nft/mint/${submissionId}`,
    {},
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
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

async function judge(problemId: string | undefined, language: number, code: string) {
  const testCasesResponse = await axios.get(
    `${import.meta.env.VITE_DOMAIN}/problems/${problemId}`
  );
  const testCases = testCasesResponse.data.testcases;

  const results = await Promise.all(
    testCases.map(async (testCase: any) => {
      const response = await axios.post(
        "https://judge0-ce.p.rapidapi.com/submissions",
        {
          language_id: language,
          source_code: formatCode(code),
          stdin: testCase.input,
          expected_output: testCase.output,
        },
        {
          headers: {
            "content-type": "application/json",
            "X-RapidAPI-Key": import.meta.env.VITE_JUDGE0_API_KEY,
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
          },
        }
      );

      const Judgetoken = response.data.token;
      return await pollForResult(Judgetoken);
    })
  );

  return results;
}

async function addToDB(problemId: string | undefined, code: string, language: number) {
  const token = window.localStorage.getItem("token");

  const saveSubmissionResponse = await axios.post(
    import.meta.env.VITE_DOMAIN + "/submissions/submit",
    {
      problemId: problemId,
      code: formatCode(code),
      language: language.toString(),
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
    }
  );
  return saveSubmissionResponse;
}

export type SubmitPhase = "judging" | "verifying" | "minting";

export async function submitCode(
  selectedProblem: any,
  language: number,
  code: string,
  onPhaseChange?: (phase: SubmitPhase) => void
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
      return { error: "Your Solution is not unique" };
    }
    console.error("Error submitting code:", error.message);
    return { error: "An error occurred while submitting your code." };
  }
}

async function pollForResult(Judgetoken: string) {
  let result;
  let attempts = 0;
  const maxAttempts = 10;
  const delay = 2000; // 2 seconds

  while (attempts < maxAttempts) {
    const response = await axios.get(
      `https://judge0-ce.p.rapidapi.com/submissions/${Judgetoken}`,
      {
        headers: {
          "X-RapidAPI-Key": import.meta.env.VITE_JUDGE0_API_KEY,
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
        },
      }
    );

    result = response.data;

    if (result.status.id >= 3) {
      return {
        status: result.status,
        stdout: result.stdout ? result.stdout : null,
        stderr: result.stderr ? result.stderr : null,
        compile_output: result.compile_output ? result.compile_output : null,
        time: result.time,
        memory: result.memory,
      };
    }

    attempts++;
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  throw new Error("Polling timed out");
}
