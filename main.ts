import * as fs from "fs";
import * as path from "path";
import * as XLSX from "xlsx";
import { download } from "./downloader";

async function readExcel(): Promise<void> {
  const filePath = "./data.xlsx";
  const fileBuffer = fs.readFileSync(filePath);
  const workbook = XLSX.read(fileBuffer, { type: "buffer" });

  workbook.SheetNames.forEach(async (sheetName) => {
    console.log(`Processing sheet: ${sheetName}`);
    const sheet = workbook.Sheets[sheetName];
    const rows: any[] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    if (rows.length === 0) {
      console.log("No data found in the sheet.");
      return;
    }

    const parentFolder = rows[0][0]?.toString().trim() || "videos";
    const dirPath = path.join(__dirname, parentFolder);
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created parent folder: ${dirPath}`);

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (!row || row.length < 2) continue;

      const videoName = row[0]?.toString().trim() || `video_${i}`;
      const videoUrl = row[1]?.toString().trim();

      if (!videoUrl) {
        console.log(`Skipping row ${i + 1} - no URL provided`);
        continue;
      }
      const numberedName = `${i}. ${videoName}.mp4`;
      const outputPath = path.join(dirPath, numberedName);
      console.log(`Downloading (${i}/${rows.length - 1}): ${videoUrl}`);
      try {
        await download(videoUrl, outputPath);
        console.log(`✅ Success: ${numberedName}`);
      } catch (error) {
        console.error(`❌ Failed to download ${videoUrl}:`, error);
      }
    }
  });
}

readExcel().catch(console.error);
