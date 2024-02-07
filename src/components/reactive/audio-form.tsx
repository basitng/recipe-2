import { downloadAudio } from "@/lib/utils";
import { Download, Loader, PauseCircle, PlayCircle, Trash } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import WaveSurfer from "wavesurfer.js";

interface WaveformProps {
  url: string;
  height: number;
  loading: boolean;
}

const WaveformAudio: React.FC<WaveformProps> = ({ url, height, loading }) => {
  // Ref for the container in which WaveSurfer will render the waveform
  const waveformRef = useRef<HTMLDivElement | null>(null);

  // Ref for the WaveSurfer instance
  const wavesurfer = useRef<WaveSurfer | null>(null);

  // State to track if the audio is playing
  const [isPlaying, setIsPlaying] = useState(false);

  // State to track if the audio should auto-play
  const [shouldAutoPlay, setShouldAutoPlay] = useState(false);

  // Function to format the time
  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  useEffect(() => {
    if (waveformRef.current) {
      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "#111",
        progressColor: "#ffaa40",
        height,
      });

      wavesurfer.current.load(url);

      if (shouldAutoPlay && !isPlaying) {
        wavesurfer.current.play();
        setIsPlaying(true);
      }

      if (wavesurfer.current) {
        wavesurfer.current.on("finish", () => {
          wavesurfer.current!.seekTo(0); // Start from the beginning
          setIsPlaying(false); // Set playing state to false
        });
      }
    }

    return () => {
      if (wavesurfer.current) {
        wavesurfer.current.destroy();
      }
    };
  }, [url, shouldAutoPlay]);

  // Function to handle the play button click
  const handlePlayClick = () => {
    if (wavesurfer.current) {
      if (isPlaying) {
        wavesurfer.current.pause();
      } else {
        wavesurfer.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const extractFilename = (url: string): string | null => {
    const urlParts = url.split("/");
    if (urlParts.length === 0) return null;
    return urlParts[urlParts.length - 1];
  };

  const handleDownload = (url: string) => {
    const audioFilename = extractFilename(url);
    downloadAudio(url, audioFilename as string)
      .then(() => {
        toast.success(`Audio downloaded as ${audioFilename}`);
      })
      .catch((error) => {
        console.error(error.message);
      });
  };

  return (
    <div className="w-full flex items-center justify-center">
      <div
        className="w-12 h-12 mr-3 flex justify-center items-center bg-gradient-to-r from-violet-500 to-fuchsia-500"
        style={{ borderRadius: 100 }}
        onClick={() => handlePlayClick()}
      >
        {loading ? (
          <Loader className="w-6 h-6 animate-spin" />
        ) : !isPlaying ? (
          <PlayCircle className="text-3xl text-white" />
        ) : (
          <PauseCircle className="text-3xl text-white" />
        )}
      </div>
      <div className="md:w-[400px] w-[150px]">
        <div id="waveform" ref={waveformRef} />
      </div>
      <div className="flex items-center ml-4 text-white space-x-5">
        <span className="text-sm">
          {wavesurfer.current
            ? formatTime(wavesurfer.current.getDuration())
            : "00:00"}
        </span>
        <Download
          onClick={() => handleDownload(url)}
          className="cursor-pointer"
        />
      </div>
    </div>
  );
};

export default WaveformAudio;
