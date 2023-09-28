function generateUniqueKey(str1, str2) {
  // Sort str1 and str2 alphabetically
  const sortedStrings = [str1, str2].sort();

  // Combine the sorted strings
  return sortedStrings.join("");
}
export default generateUniqueKey;
