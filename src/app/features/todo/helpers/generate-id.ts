export const updateId = (function generateId() {
  let currentId = 0;
  function updateId() {
    currentId++;
    return currentId;
  }
  return updateId;
})();
