export const convertDurationToTime = (
  duration: number = 0,
  isShortString: boolean = false,
): string => {
  const hours = Math.floor(duration / 3600); // Lấy số giờ
  const minutes = Math.floor((duration % 3600) / 60); // Lấy số phút
  const seconds = duration % 60; // Lấy số giây

  // Đảm bảo mỗi đơn vị có ít nhất 2 chữ số
  const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const formattedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;

  if (isShortString) {
    // Định dạng ngắn (vd: 1h 30m)
    return `${formattedHours}h ${formattedMinutes}m`;
  } else {
    // Định dạng đầy đủ (vd: 1 hour 30 minutes)
    return `${formattedHours} hours ${formattedMinutes} minutes`;
  }
};
