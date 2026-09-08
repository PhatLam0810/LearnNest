export const convertDurationToTime = (
  duration: number = 0,
  isShortString: boolean = false,
): string => {
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  const seconds = duration % 60;

  const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const formattedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;

  if (isShortString) {
    return hours > 0
      ? `${hours}h ${formattedMinutes}m`
      : `${formattedMinutes}m`;
  } else {
    return hours > 0
      ? `${hours} giờ ${formattedMinutes} phút`
      : `${formattedMinutes} phút`;
  }
};

// Mốc thời gian video kiểu đồng hồ ("M:SS" hoặc "H:MM:SS") - dùng cho chip
// "tua tới" ở ghi chú cá nhân. Khác convertDurationToTime (ra "5 phút").
export const formatVideoTimestamp = (totalSeconds: number = 0): string => {
  const safe =
    Number.isFinite(totalSeconds) && totalSeconds > 0
      ? Math.floor(totalSeconds)
      : 0;
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const seconds = safe % 60;
  const pad = (n: number) => `${n}`.padStart(2, '0');

  return hours > 0
    ? `${hours}:${pad(minutes)}:${pad(seconds)}`
    : `${minutes}:${pad(seconds)}`;
};
