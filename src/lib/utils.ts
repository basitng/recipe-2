import axios from "axios";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function downloadAudio(
  url: string,
  filename: string
): Promise<void> {
  try {
    const response = await axios.get(url, { responseType: "blob" });

    if (response.status !== 200) {
      throw new Error(`Request failed with status code ${response.status}`);
    }

    const audioBlob = new Blob([response.data]);

    // Create a URL for the Blob
    const audioUrl = window.URL.createObjectURL(audioBlob);

    const a = document.createElement("a");
    a.href = audioUrl;
    a.download = filename; // Set the desired filename
    a.style.display = "none";

    // Append the anchor element to the body
    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);
    window.URL.revokeObjectURL(audioUrl);
  } catch (error: any) {
    throw new Error(`Download failed: ${error.message}`);
  }
}
