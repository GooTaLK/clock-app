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
  let didUpdated = false;
  const updateData = data.map((obj) => {
    const passFilter = [];

    for (const key in filter) {
      obj.hasOwnProperty(key) && obj[key] === filter[key]
        ? passFilter.push(true)
        : passFilter.push(false);
    }

    if (passFilter.includes(false)) return obj;

    didUpdated = true;
    return { ...obj, ...newData };
  });

  if (didUpdated) localStorage.setItem(key, JSON.stringify(updateData));
};

const updateAllLocalData = (key, newData) => {
  const data = getLocalData(key);
  const updateData = data.map((obj) => {
    return { ...obj, ...newData };
  });
  localStorage.setItem(key, JSON.stringify(updateData));
};

const deleteLocalData = (key, filter) => {
  const data = getLocalData(key);
  let didUpdated = false;
  const restOfData = data.filter((obj) => {
    const passFilter = [];

    for (const key in filter) {
      obj.hasOwnProperty(key) && obj[key] === filter[key]
        ? passFilter.push(true)
        : passFilter.push(false);
    }

    if (passFilter.includes(false)) return true;

    didUpdated = true;
    return false;
  });

  if (didUpdated) localStorage.setItem(key, JSON.stringify(restOfData));
};

export {
  getLocalData,
  getOneLocalDataById,
  addLocalData,
  updateLocalData,
  updateAllLocalData,
  deleteLocalData,
};
