import axios from 'axios';

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

export const uploadToWalrus = async (file: File) => {
  const publisherUrl = process.env.NEXT_PUBLIC_PUBLISHER_URL; // vd https://publisher.walrus-testnet.walrus.space
  const aggregatorUrl = process.env.NEXT_PUBLIC_AGGREGATOR_URL; // vd https://aggregator.walrus-testnet.walrus.space
  const epochs = 1;

  const res = await fetch(`${publisherUrl}/v1/blobs?epochs=${epochs}`, {
    method: 'PUT',
    body: file,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }

  /**
   * Walrus thường trả về:
   * {
   *   blobId: "...",
   *   ...
   * }
   */
  const info = await res.json();

  const blobId = info?.blobId ?? info?.newlyCreated?.blobObject?.blobId;

  if (!blobId) {
    console.error('Walrus response invalid:', info);
    throw new Error('Cannot extract blobId from Walrus response');
  }

  const videoUrl = `${aggregatorUrl}/v1/blobs/${blobId}`;
  return {
    blobId,
    videoUrl,
    info,
  };
};

export const getYouTubeVideoDuration = async (url: string): Promise<number> => {
  try {
    const match = url.match(
      /(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/|.*embed\/|v\/))([\w-]+)/,
    );
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?id=${match[1]}&part=contentDetails&key=${process.env.NEXT_PUBLIC_API_YOUTUBE_KEY}`,
    );
    const data = await response.json();

    if (data.items.length === 0) {
      throw new Error('Video not found');
    }

    const durationISO = data.items[0].contentDetails.duration;
    return parseYouTubeDuration(durationISO);
  } catch (error) {
    console.error('Error fetching video duration:', error);
    return 0;
  }
};

// Hàm chuyển đổi duration từ ISO 8601 (VD: "PT5M30S") sang giây
const parseYouTubeDuration = (duration: string): number => {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  const hours = match?.[1] ? parseInt(match[1]) : 0;
  const minutes = match?.[2] ? parseInt(match[2]) : 0;
  const seconds = match?.[3] ? parseInt(match[3]) : 0;
  return hours * 3600 + minutes * 60 + seconds;
};
