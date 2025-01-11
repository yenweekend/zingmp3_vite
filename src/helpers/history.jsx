const HISTORY_KEY = {
  MV: "mv",
  SONG: "song",
  PLAYLIST: "playlist",
};
export const getHistory = () => {
  const data = localStorage.getItem("history");
  return data ? JSON.parse(data) : { mv: [], song: [], playlist: [] };
};
export const saveHistory = (history) => {
  localStorage.setItem("history", JSON.stringify(history));
};
export const addToHistory = (category, newItem) => {
  const history = getHistory();
  if (!history[category]) {
    throw new Error(`Invalid category: ${category}`);
  }
  const categoryHistory = history[category];
  const existingIndex = categoryHistory.findIndex(
    (item) => item.encodeId === newItem.encodeId
  );

  // Remove the existing item if it exists
  if (existingIndex !== -1) {
    categoryHistory.splice(existingIndex, 1);
  }

  // Add the new item to the beginning
  categoryHistory.unshift(newItem);

  // Ensure the array length does not exceed 20
  if (categoryHistory.length > 20) {
    categoryHistory.pop();
  }

  // Save the updated history
  history[category] = categoryHistory;
  saveHistory(history);
};
export const deleteFromHistory = (category, itemId) => {
  const history = getHistory();
  if (!history[category]) {
    throw new Error(`Invalid category: ${category}`);
  }

  const updatedCategoryHistory = history[category].filter(
    (item) => item.encodeId !== itemId
  );
  // Save the updated history
  history[category] = updatedCategoryHistory;
  saveHistory(history);
  return history;
};
export default HISTORY_KEY;
