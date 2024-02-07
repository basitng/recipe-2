"use client";
import WaveformAudio from "@/components/reactive/audio-form";
import GridPattern from "@/components/reactive/grid-pattern";
import SparklesCore from "@/components/reactive/particles";
import Spotlight from "@/components/reactive/spotlight";
import { AnimatedTooltip } from "@/components/reactive/tooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { voices } from "@/lib/mock";
import { cn } from "@/lib/utils";
import axios from "axios";
import { Loader } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [voice, setVoice] = useState<Voice>(voices[0]);
  const [audio, setAudio] = useState("");
  const [text, setText] = useState("");
  const handleGenerate = () => {
    setLoading(true);
    axios
      .post("/api/tts", { text, voice: voice.name })
      .then(({ data }) => {
        setAudio(data.status.OutputUri[0]);
        toast.success("Audio generated successfully");
      })
      .catch((error) => toast.error("Unable to generate audio"))
      .finally(() => setLoading(false));
  };

  return (
    <main className="flex w-full md:px-0 px-3 min-h-screen items-center bg-black flex-col justify-around">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="#06b6d4"
      />

      <GridPattern
        squares={[
          [4, 4],
          [5, 1],
          [8, 2],
          [6, 6],
          [10, 5],
          [13, 3],
          [15, 6],
          [20, 3],
        ]}
        className={cn(
          "[mask-image:radial-gradient(4000px_circle_at_center,white,transparent)]",
          "inset-x-0 fill-gray-700/15 stroke-gray-700/15"
        )}
      />

      <div className="md:max-w-screen-sm relative z-50 w-full flex flex-col justify-center items-center">
        <h1 className="text-4xl font-bold capitalize text-transparent tracking-tighter bg-gradient-to-tl text-center from-black to-stone-200 bg-clip-text [text-wrap:balance] md:text-7xl md:leading-[5rem]">
          blog post to audio in few seconds
        </h1>
        <div className="w-full mt-8 mb-4 bg-[#1d1d1d] shadowm-md border-[1px] h-[50px] border-gray-200/15 rounded-md">
          <Input
            value={text}
            placeholder="Paste blog post url"
            onChange={(e) => setText(e.target.value)}
            className="bg-transparent text-white border-none h-full"
          />
        </div>
        <div className="flex my-5 items-center space-x-4">
          <AnimatedTooltip setVoice={setVoice} items={voices} />
        </div>
        <Button
          disabled={!voice || !text || loading}
          onClick={handleGenerate}
          className="bg-gradient-to-r mt-10 from-cyan-500 to-blue-500 w-[180px] h-12"
        >
          Convert
          {loading && <Loader className="w-6 h-6 ml-2 animate-spin" />}
        </Button>
      </div>
      {audio && (
        <div
          className="w-full z-50 relative md:max-w-screen-sm p-2 flex items-center bg-[#18191c]"
          style={{ borderRadius: 100 }}
        >
          <WaveformAudio loading={loading} height={70} url={audio} />
        </div>
      )}
    </main>
  );
}
