import fs from 'fs';
import path from 'path';

const sourceImg = "C:\\Users\\Renel\\.gemini\\antigravity-ide\\brain\\390bae6a-039c-4119-a352-dcf34d27139a\\.user_uploaded\\media_1792678736141.png";
const destAsset = path.resolve("./src/assets/profile.png");
const destPublic = path.resolve("./public/profile.png");

try {
  fs.copyFileSync(sourceImg, destAsset);
  fs.copyFileSync(sourceImg, destPublic);
  console.log("Successfully copied profile.png to assets and public folders!");
} catch (err) {
  console.error("Error copying file:", err);
}
