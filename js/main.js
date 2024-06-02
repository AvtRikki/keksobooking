// eslint-disable-next-line no-unused-vars
function generateRandomNumber(min, max) {
  if (min > max) {
    [min, max] = [max, min];
  }

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// eslint-disable-next-line no-unused-vars
function generateRandomFloatingNumber(min, max, precision) {
  if (min > max) {
    [min, max] = [max, min];
  }

  const random = Math.random() * (max - min) + min;
  return parseFloat(random.toFixed(precision));
}
