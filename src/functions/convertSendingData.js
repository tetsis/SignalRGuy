export default function convertSendingData(data) {
  if (data.type === "int") {
    return parseInt(data.value, 10);
  }
  else {
    return data.value;
  }
}