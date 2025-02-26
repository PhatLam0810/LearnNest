import { ImagePDF, ImageVideo, ImageYoutube } from 'public/images';

export const typeItem: { [type: string]: any } = {
  Youtube: ImageYoutube,
  Video: ImageVideo,
  Short: ImageYoutube,
  PDF: ImagePDF,
  Text: ImagePDF,
};
