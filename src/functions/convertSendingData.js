export default function convertSendingData(data) {
  if (data.type === "int") {
    return parseInt(data.value, 10);
  }
  else if (data.type === "object" || data.type === "array") {
    return JSON.parse(data.value);
  }
  else {
    return data.value;
  }
}