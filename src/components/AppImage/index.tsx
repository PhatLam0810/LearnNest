import { Image } from 'antd';
import React, { PropsWithChildren } from 'react';

type AppImageProps = {
  source: any;
} & React.ComponentProps<typeof Image>;
const AppImage: React.FC<AppImageProps> = ({ source, ...props }) => {
  return (
    <Image
      {...props}
      src={source || 'https://placehold.it/350x250 '}
      alt=""
      preview={false}
      fallback="https://placehold.it/350x250 "
    />
  );
};

export default AppImage;
