const getDataOfParent = (target, data) => {
  let currentElement = target;

  while (!currentElement.dataset[data]) {
    if (currentElement === document.body) return null;
    currentElement = currentElement.parentElement;
  }

  return currentElement.dataset[data];
};

export default getDataOfParent;
