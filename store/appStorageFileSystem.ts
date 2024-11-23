import RNFS from 'react-native-fs';

const imagesDirectoryPath = `${RNFS.DocumentDirectoryPath}/images`;

// Ensure images directory exists
const ensureDirectoryExists = async (path: string) => {
  const exists = await RNFS.exists(path);
  if (!exists) {
    await RNFS.mkdir(path);
  }
};

// Save JSON data to a file
export const saveJSON = async (filePath: string, data: any): Promise<void> => {
  await RNFS.writeFile(filePath, JSON.stringify(data), 'utf8');
};

// Read JSON data from a file
export const readJSON = async <T>(filePath: string): Promise<T | null> => {
  const exists = await RNFS.exists(filePath);
  if (!exists) return null;
  const content = await RNFS.readFile(filePath, 'utf8');
  return JSON.parse(content) as T;
};

// Delete a file
export const deleteFile = async (filePath: string): Promise<void> => {
  const exists = await RNFS.exists(filePath);
  if (exists) {
    await RNFS.unlink(filePath);
  }
};

// Save image path
export const saveImage = async (id: string, uri: string): Promise<void> => {
  await ensureDirectoryExists(imagesDirectoryPath);
  const targetPath = `${imagesDirectoryPath}/${id}.jpg`;
  await RNFS.copyFile(uri, targetPath);
};

// Get all images
export const getAllImages = async (): Promise<string[]> => {
  await ensureDirectoryExists(imagesDirectoryPath);
  const files = await RNFS.readDir(imagesDirectoryPath);
  return files.map((file) => file.path);
};
