export default function fileNameConverter(filename: string) {
  const convertedArr = filename.split('.');
  convertedArr.pop();

  const regex = /[!@#$%^&*()_]/g;

  let converted = convertedArr.join('');

  while (regex.test(converted)) {
    converted = converted.replace(regex, '');
  }

  return converted;
}
