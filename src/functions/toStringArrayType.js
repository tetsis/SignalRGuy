export default function toStringArrayType(array) {
  let type = "array[";

  if (array.type === "array") {
    type += toStringArrayType(array.array);
  }
  else {
    type += array.type;
  }
  type += "]";

  return type;
}