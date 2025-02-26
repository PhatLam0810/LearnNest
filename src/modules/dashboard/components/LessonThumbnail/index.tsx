import { getYouTubeThumbnail } from '@utils/youtube';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

type LessonThumbnailProps = {
  thumbnail: string;
};
const LessonThumbnail: React.FC<LessonThumbnailProps> = ({ thumbnail }) => {
  const [src, setSrc] = useState('');
  useEffect(() => {
    if (thumbnail?.includes('youtube.com')) {
      setSrc(getYouTubeThumbnail(thumbnail));
    } else {
      setSrc(thumbnail);
    }
  }, []);
  return <Image fill src={src} alt="thumbnail" />;
};

export default LessonThumbnail;
