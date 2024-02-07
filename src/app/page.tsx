"use client";
import WaveformAudio from "@/components/reactive/audio-form";
import { BorderBeam } from "@/components/reactive/beam";
import GridPattern from "@/components/reactive/grid-pattern";
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

const isValidUrl = (url: string) => {
  const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;
  return urlPattern.test(url);
};

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [voice, setVoice] = useState<Voice>(voices[0]);
  const [audio, setAudio] = useState("");
  const [url, setUrl] = useState("");

  const handleGenerate = () => {
    if (!isValidUrl(url)) {
      toast.error("Invalid URL");
      return;
    }

    setLoading(true);
    axios
      .post("/api/tts", { url, voice: voice.name })
      .then(({ data }) => {
        setAudio(data.status.OutputUri[0]);
        toast.success("Audio generated successfully");
      })
      .catch((error) => toast.error("Unable to generate audio"))
      .finally(() => setLoading(false));
  };

  return (
    <main className="flex relative w-full md:px-0 px-3 min-h-screen items-center bg-gradient-to-r from-violet-400 to-fuchsia-400 flex-col justify-around">
      <BorderBeam size={700} borderWidth={8} colorFrom="#fff" />
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
          "inset-x-0 fill-gray-200/15 stroke-gray-200/15"
        )}
      />
      <div className="md:max-w-screen-sm relative z-50 py-2 w-full flex flex-col justify-center items-center">
        <h1 className="text-4xl font-bold capitalize text-transparent tracking-tighter bg-gradient-to-tl text-center from-white to-stone-200 bg-clip-text [text-wrap:balance] md:text-7xl md:leading-[5rem]">
          AI Blog to Audio summarizer
        </h1>
        <div className="w-full relative px-5 mt-8 mb-4 bg-[#fff] text-black/75 shadowm-md border-[1px] h-[80px] border-gray-200/15 rounded-full">
          <Input
            value={url}
            placeholder="Paste blog post url"
            onChange={(e) => setUrl(e.target.value)}
            className="bg-transparent outline-none text-black/75 border-none h-full"
          />
        </div>
        <div className="flex my-5 items-center space-x-4">
          <AnimatedTooltip setVoice={setVoice} items={voices} />
        </div>
        <Button
          disabled={!voice || !url}
          onClick={handleGenerate}
          className="mt-10 text-violet-500 hover:bg-violet-500 hover:text-white bg-white w-[180px] h-12"
        >
          Generate
          {loading && <Loader className="w-6 h-6 ml-2 animate-spin" />}
        </Button>
      </div>
      {audio && (
        <div
          className="w-full z-50 relative md:max-w-screen-sm p-2 flex items-center bg-white/95"
          style={{ borderRadius: 100 }}
        >
          <WaveformAudio loading={loading} height={70} url={audio} />
        </div>
      )}
    </main>
  );
}
