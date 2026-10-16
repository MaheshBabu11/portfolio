import sharp from 'sharp';
import { readdir, mkdir, rm, stat, writeFile, rename } from 'node:fs/promises';
import { basename, dirname, extname, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const sourceRoot = resolve(projectRoot, 'app/assets/gallery');
const outputRoot = resolve(projectRoot, 'public/gallery-optimized');
const manifestPath = resolve(projectRoot, 'app/routes/gallery/gallery-images.json');
const supportedExtensions = new Set([
  '.avif',
  '.bmp',
  '.gif',
  '.heic',
  '.heif',
  '.jpg',
  '.jpeg',
  '.png',
  '.tif',
  '.tiff',
  '.webp',
]);

async function getImageFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const path = resolve(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await getImageFiles(path)));
    } else if (entry.isFile() && supportedExtensions.has(extname(entry.name).toLowerCase())) {
      files.push(path);
    }
  }

  return files.sort();
}

function toAssetUrl(relativePath) {
  return `/gallery-optimized/${relativePath
    .split(sep)
    .map(encodeURIComponent)
    .join('/')}`;
}

async function optimizeImage(sourcePath) {
  const relativePath = relative(sourceRoot, sourcePath);
  const thumbnailRelativePath = `${relativePath}.thumb.webp`;
  const displayRelativePath = `${relativePath}.display.webp`;
  const thumbnailPath = resolve(outputRoot, thumbnailRelativePath);
  const displayPath = resolve(outputRoot, displayRelativePath);
  const metadata = await sharp(sourcePath).metadata();

  if (!metadata.width || !metadata.height) {
    throw new Error(`Unable to read image dimensions for ${relativePath}.`);
  }

  if ((metadata.pages ?? 1) > 1) {
    throw new Error(`Animated images are not supported in the gallery: ${relativePath}.`);
  }

  await mkdir(dirname(thumbnailPath), { recursive: true });
  const thumbnailInfo = await sharp(sourcePath)
    .rotate()
    .resize(640, 640, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 76 })
    .toFile(thumbnailPath);

  const displayUrl =
    Math.max(metadata.width, metadata.height) <= 640
      ? toAssetUrl(thumbnailRelativePath)
      : toAssetUrl(displayRelativePath);

  if (displayUrl !== toAssetUrl(thumbnailRelativePath)) {
    await mkdir(dirname(displayPath), { recursive: true });
    await sharp(sourcePath)
      .rotate()
      .resize(1800, 1800, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(displayPath);
  }

  const sourceStats = await stat(sourcePath);
  const title = basename(relativePath, extname(relativePath))
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return {
    title: title || 'Gallery photo',
    thumbnailUrl: toAssetUrl(thumbnailRelativePath),
    displayUrl,
    width: thumbnailInfo.width,
    height: thumbnailInfo.height,
    uploadedAt: sourceStats.mtime.toISOString(),
    pathname: relativePath,
  };
}

await mkdir(sourceRoot, { recursive: true });
await rm(outputRoot, { recursive: true, force: true });
await mkdir(outputRoot, { recursive: true });

const imageFiles = await getImageFiles(sourceRoot);
const galleryPhotos = [];

for (const imageFile of imageFiles) {
  galleryPhotos.push(await optimizeImage(imageFile));
}

galleryPhotos.sort(
  (first, second) => new Date(second.uploadedAt).getTime() - new Date(first.uploadedAt).getTime()
);

const temporaryManifest = `${manifestPath}.tmp`;
await writeFile(temporaryManifest, JSON.stringify(galleryPhotos, null, 2));
await rename(temporaryManifest, manifestPath);

console.info(`Optimized ${galleryPhotos.length} gallery photo(s).`);
