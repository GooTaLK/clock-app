const getLocalData = (key) => {
  const localData = localStorage.getItem(key);
  const data = localData ? JSON.parse(localData) : null;
  return data;
};

const getOneLocalDataById = (key, id) => {
  const localData = getLocalData(key);
  const data = localData.filter(({ id: localId }) => localId === id);
  return data[0];
};

const addLocalData = (key, newData) => {
  const data = getLocalData(key);
  const updateData = data ? [...data, newData] : [newData];

  localStorage.setItem(key, JSON.stringify(updateData));
};

const updateLocalData = (key, newData, filter) => {
  const data = getLocalData(key);
  const updateData = [];

  const restOfData = data.filter((obj) => {
    let objAgree = false;

    for (const key in filter) {
      if (obj.hasOwnProperty(key) && obj[key] === filter[key]) {
        updateData.push({ ...obj, ...newData });
        objAgree = true;
      }
    }

    return !objAgree;
  });

  if (updateData.length !== 0)
    localStorage.setItem(key, JSON.stringify([...restOfData, ...updateData]));
};

const deleteLocalData = (key, filter) => {
  const data = getLocalData(key);

  const restOfData = data.filter((obj) => {
    let objAgree = false;

    for (const key in filter) {
      if (obj.hasOwnProperty(key) && obj[key] === filter[key]) {
        objAgree = true;
      }
    }

    return !objAgree;
  });

  localStorage.setItem(key, JSON.stringify(restOfData));
};

export {
  getLocalData,
  getOneLocalDataById,
  addLocalData,
  updateLocalData,
  deleteLocalData,
};
