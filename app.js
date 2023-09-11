const fs = require('fs');

// Fungsi untuk melakukan horizontal flip pada keyboard
function horizontalFlip(keyboard) {
  return keyboard.map(row => row.split('').reverse().join(''));
}

// Fungsi untuk melakukan vertical flip pada keyboard
function verticalFlip(keyboard) {
  const transposedKeyboard = [];
  for (let col = 0; col < keyboard[0].length; col++) {
    const column = keyboard.map(row => row[col]);
    transposedKeyboard.push(column.join(''));
  }
  return transposedKeyboard.reverse();
}

// Fungsi untuk melakukan shift pada keyboard
function shiftKeyboard(keyboard, n) {
  const shiftedKeyboard = [];
  for (let row = 0; row < keyboard.length; row++) {
    const newRow = [];
    for (let col = 0; col < keyboard[row].length; col++) {
      const currentChar = keyboard[row][col];
      const shiftedCol = (col + n + keyboard[row].length) % keyboard[row].length;
      const shiftedRow = row + Math.floor((col + n) / keyboard[row].length);
      newRow[shiftedCol] = currentChar;
    }
    shiftedKeyboard.push(newRow.join(''));
  }
  return shiftedKeyboard;
}

// Fungsi untuk menerapkan transformasi pada teks
function applyTransforms(transforms, text) {
  let keyboard = [
    '1234567890',
    'qwertyuiop',
    'asdfghjkl;',
    'zxcvbnm,./',
  ];

  for (const transform of transforms) {
    if (transform === 'H') {
      keyboard = horizontalFlip(keyboard);
    } else if (transform === 'V') {
      keyboard = verticalFlip(keyboard);
    } else if (transform.match(/^[-]?\d+$/)) {
      const n = parseInt(transform);
      keyboard = shiftKeyboard(keyboard, n);
    }
  }

  const charMap = new Map();

  // Membangun peta karakter lama dan karakter baru
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 10; col++) {
      charMap[keyboard[row][col]] = text[row * 10 + col] || keyboard[row][col];
    }
  }

  // Mengganti karakter dalam teks sesuai peta karakter
  const transformedText = text.split('').map(char => charMap[char] || char).join('');
  return transformedText;
}

// Fungsi utama
function main() {
  const transforms = fs.readFileSync('./assets/transforms.txt', 'utf8').trim().split(',');
  const text = fs.readFileSync('./assets/text_to_transform.txt', 'utf8');

  const transformedText = applyTransforms(transforms, text);
  console.log(transformedText);
}

// Memanggil fungsi utama
main();
