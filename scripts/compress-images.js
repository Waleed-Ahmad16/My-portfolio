import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, '../public');

async function compress() {
  console.log('Starting image compression...');

  // 1. my img.jpg -> my-img.webp
  const avatarSrc = path.join(publicDir, 'my img.jpg');
  const avatarDest = path.join(publicDir, 'my-img.webp');
  if (fs.existsSync(avatarSrc)) {
    console.log('Compressing avatar my img.jpg...');
    await sharp(avatarSrc)
      .resize(800) // Resize width to 800px for avatar, maintaining aspect ratio
      .webp({ quality: 82 })
      .toFile(avatarDest);
    console.log('Avatar compressed successfully to my-img.webp!');
  }

  // 2. profile.png -> profile.webp
  const profileSrc = path.join(publicDir, 'profile.png');
  const profileDest = path.join(publicDir, 'profile.webp');
  if (fs.existsSync(profileSrc)) {
    console.log('Compressing profile.png...');
    await sharp(profileSrc)
      .webp({ quality: 80 })
      .toFile(profileDest);
    console.log('Profile compressed successfully to profile.webp!');
  }

  // 3. hero-bg.png -> hero-bg.webp
  const bgSrc = path.join(publicDir, 'hero-bg.png');
  const bgDest = path.join(publicDir, 'hero-bg.webp');
  if (fs.existsSync(bgSrc)) {
    console.log('Compressing hero-bg.png...');
    await sharp(bgSrc)
      .webp({ quality: 75 })
      .toFile(bgDest);
    console.log('Hero background compressed successfully to hero-bg.webp!');
  }

  console.log('Image compression finished!');
}

compress().catch(err => {
  console.error('Error during compression:', err);
});
