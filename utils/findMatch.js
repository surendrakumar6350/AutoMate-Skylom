const { fetchChat } = require('./fetchkaro');

function find(array, word) {
  for (let index = 0; index < array.length; index++) {
    if (array[index] == word) {
      return index;
    }
  }

  function countCommonLetters(str1, str2) {
    const str1Lower = str1.toLowerCase();
    const str2Lower = str2.toLowerCase();
    let count = 0;
    for (let i = 0; i < str1Lower.length; i++) {
      if (str2Lower.includes(str1Lower[i])) {
        count++;
      }
    }
    return count;
  }
  let maxCount = 0;
  let maxIndex = 0;
  array.forEach((element, index) => {
    const count = countCommonLetters(element, word);
    if (count > maxCount) {
      maxCount = count;
      maxIndex = index;
    }
  });
  return maxIndex;
}


async function findUniquePhotoIndex(buffer) {
  const base64Image = buffer.toString('base64');
  const ans = await fetchChat("what is in this image, answer in one word", `data:image/png;base64,${base64Image}`);
  return ans;
}


function findOddWordIndex(arr) {
  const wordCounts = {};
  arr.forEach((word) => {
    const trimmedWord = word.trim();
    if (wordCounts[trimmedWord]) {
      wordCounts[trimmedWord]++;
    } else {
      wordCounts[trimmedWord] = 1;
    }
  });
  for (let i = 0; i < arr.length; i++) {
    const trimmedWord = arr[i].trim();
    if (wordCounts[trimmedWord] === 1) {
      return i + 1;
    }
  }
  return 1;
}


module.exports = { find, findUniquePhotoIndex, findOddWordIndex };