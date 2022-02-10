export default function getArrayContent(array) {
  if (array.type === "array") {
    return getArrayContent(array.array);
  }

  return array;
}