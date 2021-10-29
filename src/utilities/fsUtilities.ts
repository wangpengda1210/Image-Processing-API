import { statSync, promises as fs } from 'fs';
import sharp from 'sharp';

/**
 * Check if the image exists
 * @param path The path of the image to check
 */
const checkImageExists = async (path: string): Promise<boolean> => {
  try {
    const file = await fs.open(path, 'r');
    await file.close();
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Get the path of the image
 * @param name The name of the image
 */
const getFilePath = (name: string): string => `./assets/full/${name}.jpg`;

/**
 * Get the name of the thumbnail
 * @param name The name of the image
 * @param width The width of the thumbnail
 * @param height The height of the thumbnail
 */
const getThumbnailPath = (
  name: string,
  width: number,
  height: number
): string => `./assets/thumb/${name}_${width}_${height}.jpg`;

/**
 * Create the thumbnail of the image
 * @param name The name of the thumbnail
 * @param width The width of the thumbnail
 * @param height The height of the thumbnail
 * @return Promise that will be resolved if the resize success
 */
const createThumbnail = async (
  name: string,
  width: number,
  height: number
): Promise<void> => {
  // Create the thumb directory if it does not exist
  try {
    statSync('./assets/thumb');
  } catch (e) {
    await fs.mkdir('./assets/thumb');
  }

  return new Promise((resolve, reject) => {
    sharp(getFilePath(name))
      .resize(width, height)
      .toFile(getThumbnailPath(name, width, height), (err) => {
        if (err) {
          reject(new Error('Error when resizing'));
        } else {
          resolve();
        }
      });
  });
};

/**
 * Read the image to Buffer
 * @param path The path of the image
 */
const readImage = async (path: string): Promise<Buffer> => fs.readFile(path);

export default {
  checkImageExists,
  getFilePath,
  getThumbnailPath,
  createThumbnail,
  readImage,
};
