const capitalize = ([first, ...rest]) => {
  return first.toUpperCase() + rest.join("").toLowerCase();
};

export { capitalize };
