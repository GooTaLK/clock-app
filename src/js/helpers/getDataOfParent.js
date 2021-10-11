const getDataOfParent = (target, data) => {
  let parent = target;

  while (!parent.dataset[data]) {
    parent = parent.parentElement;
  }

  return parent.dataset[data];
};

export default getDataOfParent;
