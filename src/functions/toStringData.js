export default function toStringData(args, data) {
    let result = [];
    for (let i = 0; i < args.length; i++) {
      result.push(args[i].name + ":" + JSON.stringify(data[i]));
    }
    return result;
}