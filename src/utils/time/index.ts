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
      ? `${hours} hours ${formattedMinutes} minutes`
      : `${formattedMinutes} minutes`;
  }
};
