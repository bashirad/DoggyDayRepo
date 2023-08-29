const checkImageAvailable = (imageUrl: string): Promise<boolean> =>
  new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = imageUrl;
  });

// TODO: Global cache is not ideal, should be cleaned up at certain size
const imageAvailabilityCache: Record<string, Promise<boolean>> = {};

export const getImageUrl = async (
  imageUrl: string,
  fallbackUrl?: string
): Promise<string> => {
  if (!imageAvailabilityCache[imageUrl]) {
    imageAvailabilityCache[imageUrl] = checkImageAvailable(imageUrl);
  }
  const imageAvailable = await imageAvailabilityCache[imageUrl];
  return imageAvailable ? imageUrl : fallbackUrl;
};
