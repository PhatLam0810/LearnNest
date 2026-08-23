import api from '@services/api';

export const getVideoDuration = (url: string) => {
  return new Promise<number>((resolve, reject) => {
    const video = document.createElement('video');
    video.src = url;
    video.preload = 'metadata';

    video.onloadedmetadata = () => {
      resolve(video.duration); // Lấy duration của video
    };

    video.onerror = error => {
      reject('Error loading video: ' + error);
    };
  });
};

// Duration lookup goes through the backend (GET /library/youtube-duration/:videoId)
// instead of calling the YouTube API directly from the browser — the API key
// used to be shipped to the client via NEXT_PUBLIC_API_YOUTUBE_KEY, exposing
// it in the bundle. The backend now holds the key server-side only.
export const getYouTubeVideoDuration = async (url: string): Promise<number> => {
  try {
    const match = url.match(
      /(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/|.*embed\/|v\/))([\w-]+)/,
    );
    if (!match) return 0;

    const res = await api.get(`/library/youtube-duration/${match[1]}`);
    return res.data?.data?.seconds ?? 0;
  } catch (error) {
    console.error('Error fetching video duration:', error);
    return 0;
  }
};
