interface MediaBase {
  src: string;
  caption?: string;
}

export type MediaItem = (MediaBase & { type: "image" }) | (MediaBase & { type: "video"; poster: string });
