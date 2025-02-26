export const handleConvert = (link: string) => {
  if (!link.includes('https://drive.google.com')) {
    return link;
  }
  try {
    const match = link.match(/\/d\/(.+?)\/view/);
    if (match && match[1]) {
      const fileId = match[1];
      const newLink = `https://drive.google.com/file/d/${fileId}/preview`;
      return newLink;
    } else {
      return link;
    }
  } catch (error) {
    console.error(error);
    return link;
  }
};

export function convertToEmbedLink(shareLink: string) {
  // Kiểm tra xem link có phải dạng hợp lệ không
  const regex = /\/file\/d\/([^/]+)\//;
  const match = shareLink.match(regex);

  if (match && match[1]) {
    const fileId = match[1];
    const link = `https://drive.google.com/uc?id=${fileId}`;
    console.log(link);
    return link;
  } else {
    return shareLink;
  }
}
