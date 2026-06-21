import { getYouTubeThumbnail } from '@utils/youtube';
import Image from 'next/image';
import React from 'react';

type LessonThumbnailProps = {
  thumbnail?: string;
  width?: number;
  height?: number;
};

const LessonThumbnail: React.FC<LessonThumbnailProps> = ({
  thumbnail,
  width = undefined,
  height = undefined,
}) => {
  const isYoutube = thumbnail?.includes('youtube.com');
  const resolvedSrc = thumbnail
    ? isYoutube
      ? getYouTubeThumbnail(thumbnail)
      : thumbnail
    : '/images/ImageVideo.webp';

  // Nếu có width/height thì dùng fixed dimensions, không thì dùng fill (responsive)
  if (width && height) {
    return (
      <Image
        src={resolvedSrc}
        alt="Lesson thumbnail"
        width={width}
        height={height}
        style={{ objectFit: 'cover' }}
        unoptimized
      />
    );
  }

  return (
    <Image
      fill
      src={resolvedSrc}
      alt="Lesson thumbnail"
      sizes="(max-width: 768px) 100vw, 400px"
      style={{ objectFit: 'cover' }}
    />
  );
};

export default LessonThumbnail;
