export default function convertSendingData(data) {
  if (data.type === "int") {
    return parseInt(data.value, 10);
  }
  else if (data.type === "object") {
    return Object.fromEntries(data.properties.map((p) => [p.name, convertSendingData(p)]));
  }
  else {
    return data.value;
  }
}