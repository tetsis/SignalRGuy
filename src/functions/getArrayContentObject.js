export default function getArrayContentObject(array) {
  if (array.type === "array") {
    return getArrayContentObject(array.array);
  }

  return array;
}