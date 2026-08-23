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
      // the mint is an on-chain tx wait — without a timeout, a dead RPC node
      // hangs this request (and the "Minting…" UI) forever with no feedback
      timeout: 20_000,
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
      try {
        const mint = await mintNFT(submissionId);
        if (mint.status !== 201) {
          return {
            error: "Your solution passed and was saved, but minting the certificate failed.",
          };
        }
      } catch (mintError: any) {
        const reason =
          mintError.code === "ECONNABORTED"
            ? "the certificate network timed out"
            : "the certificate network is unavailable";
        console.error("Error minting NFT:", mintError.message);
        return {
          error: `Your solution passed and was saved, but ${reason}, so it didn't mint.`,
        };
      }

      return { results, allTestsPassed, submissionId };
    } else {
      return { error: "All testcases not passed" };
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
