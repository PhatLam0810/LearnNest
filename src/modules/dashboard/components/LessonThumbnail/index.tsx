import { getYouTubeThumbnail } from '@utils/youtube';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

type LessonThumbnailProps = {
  thumbnail?: string;
};
const LessonThumbnail: React.FC<LessonThumbnailProps> = ({ thumbnail }) => {
  const isYoutube = thumbnail?.includes('youtube.com');
  const resolvedSrc = thumbnail
    ? isYoutube
      ? getYouTubeThumbnail(thumbnail)
      : thumbnail
    : '/images/ImageVideo.webp';

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
