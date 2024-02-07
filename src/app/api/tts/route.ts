import { NextResponse } from "next/server";
import { generateText, openai } from "modelfusion";

//@ts-ignore
import { UnrealSpeechAPI } from "unrealspeech";

export async function POST(req: Request) {
  try {
    const { url, voice } = await req.json();

    const unrealSpeech = new UnrealSpeechAPI(
      process.env.UNREAL_SPEECH_API_KEY!
    );

    const extractedText = await generateText({
      model: openai.CompletionTextGenerator({
        model: "gpt-3.5-turbo-instruct",
        maxGenerationTokens: 500,
      }),
      prompt: `
        You are a professional blog summarizer, and you have been tasked with summarizing the blog post below:
        ${url}
        `,
    });

    console.log(extractedText, voice);

    const taskId = await unrealSpeech.createSynthesisTask(extractedText, voice);

    while (true) {
      const status = await unrealSpeech.getSynthesisTaskStatus(taskId);
      if (status.TaskStatus === "completed") {
        console.log(status);
        return NextResponse.json({ status });
      } else if (status.TaskStatus === "failed") {
        throw new Error("Synthesis task failed.");
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error || "An error occurred" });
  }
}
