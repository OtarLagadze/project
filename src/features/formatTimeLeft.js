export const formatTimeLeft = (timeLeft) => {
  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  let timeString = '';
  if (days > 0) timeString += `${days}დღე `;
  if (hours > 0 || days > 0) timeString += `${hours}სთ `;
  if (minutes > 0 || hours > 0 || days > 0) timeString += `${minutes}წთ `;
  timeString += `${seconds}წმ`;

  return timeString;
};
