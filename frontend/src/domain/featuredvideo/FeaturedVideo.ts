//src/domain/featuredvideo/FeaturedVideo.ts

export interface FeaturedVideo {
  id: string;
  title: string;
  /**
   * Ready-to-use https://player.vimeo.com/video/{id} URL, or null if the
   * stored vimeo_url couldn't be parsed into a video ID — the component
   * skips rendering an iframe in that case rather than pointing one at a
   * broken src.
   */
  embedUrl: string | null;
}
