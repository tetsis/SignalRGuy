export default function getArrayContentType(array) {
  if (array.type === "array") {
    return getArrayContentType(array.array);
  }

  return array.type;
}