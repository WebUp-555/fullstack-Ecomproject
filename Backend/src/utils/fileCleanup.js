import fs from "fs";

export const deleteFile = (filePath) => {
  try {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`✅ Deleted temp file: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error deleting file ${filePath}:`, error.message);
  }
};
