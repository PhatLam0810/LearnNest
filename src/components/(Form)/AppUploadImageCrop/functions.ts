export const getCroppedImg = (imageSrc: string, pixelCrop: any) => {
  const image = new Image();
  image.src = imageSrc;

  return new Promise<string>(resolve => {
    image.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;

      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height,
      );

      const base64Image = canvas.toDataURL('image/png');
      resolve(base64Image);
    };
  });
};
