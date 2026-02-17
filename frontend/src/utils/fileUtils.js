export const getFileNameFromPath = (path) => {
  if (!path) return null;
  return path.split("/").pop();
};
