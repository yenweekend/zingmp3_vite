export const getFirstAndLastInitials = (fullName) => {
  const words = fullName.split(" ");
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
};
