import youtubedl from "youtube-dl-exec";
import path from "path";

export const download = async (url: string, output?: string) => {
  try {
    const outputFile = output || "%(title)s.%(ext)s";
    const outputPath = path.resolve(process.cwd(), outputFile);

    console.log("Downloading the highest quality...");

    await youtubedl(url, {
      output: outputPath,
      format: "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best",
      mergeOutputFormat: "mp4",
      restrictFilenames: true,
      verbose: true,
      preferFfmpeg: true,
    });

    console.log(`✅ Video downloaded and saved to:\n${outputPath}`);
  } catch (error) {
    console.error("❌ Error during download:", error);
  }
};

download("https://www.youtube.com/watch?v=ycWIQfIVkTM", "output.mp4");
