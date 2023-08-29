export function roundToNearest10(date = new Date()) {
  const minutes = 10;
  const ms = 1000 * 60 * minutes;

  return new Date(Math.ceil(date.getTime() / ms) * ms);
}

export function stripTime(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function removeEmptyAttributes<T extends Object>(obj: T): T {
  const newObj = {} as T;
  for (const key in obj) {
    if (obj[key] !== null && obj[key] !== undefined) {
      newObj[key] = obj[key];
    }
  }
  return newObj;
}