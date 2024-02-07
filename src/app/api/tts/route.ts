import { NextResponse } from "next/server";
//@ts-ignore
import { UnrealSpeechAPI } from "unrealspeech";

export async function POST(req: Request) {
  try {
    const { text, voice } = await req.json();

    const unrealSpeech = new UnrealSpeechAPI(
      process.env.UNREAL_SPEECH_API_KEY!
    );

    console.log(text, voice);

    const taskId = await unrealSpeech.createSynthesisTask(text, voice);

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
