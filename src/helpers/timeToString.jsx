 const numberToTime = (timestamp) => {
const date = new Date(timestamp * 1000); // Multiply by 1000 to convert seconds to milliseconds
return date.toLocaleDateString('en-GB').replaceAll("/", ".")
}
export default numberToTime;