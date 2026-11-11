export const IMAGE_QUALITY = {
  thumb: 60,
  card: 75,
  full: 85,
} as const;

export const IMAGE_QUALITIES = Object.values(IMAGE_QUALITY);

export const LCP_IMAGE_PROPS = {
  preload: true,
  fetchPriority: "high",
} as const;
