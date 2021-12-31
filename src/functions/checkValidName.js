export default function checkValidName(array) {
  let filtered = array.filter(item => item.name.match(/^[A-Za-z0-9]+$/));
  array.forEach(item => {
    if ("properties" in item) {
      item.properties = this.checkValidName(item.properties);
    }
  });
  return filtered;
}