const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'src', 'assets', 'css', 'style.css');

const hashes = [
  '242838a56424290e37d1.png',
  'b37acad78fe20566a437.jpg',
  '3f77341ef434a5d15cf7.jpg',
  '5121c3302eb1f06371c9.png',
  'f5500c10be2246fe09d0.jpg',
  'c3d838668fc945124df7.png',
  'cf0757cbe6b2636acf74.png',
  '41292787252a245a885c.jpg',
  'fa1f52d77e700f84f29c.png',
  '7ad58be5aefaded3330f.jpg',
  '5a26c6f94edb6f3a8bfa.png',
  '89d72051cfea97909efe.jpg',
  '3ac0847569bcec6851e2.png',
  '1aef5b5a0672be102ebf.jpg',
  '379a4d88052546ea75d2.jpg',
  'ba4b1332ebbe9bc8b53a.png',
  '9728c93f7ee339bc0f54.png'
];

if (!fs.existsSync(cssPath)) {
  console.log('CSS file not found at: ' + cssPath);
  process.exit(1);
}

let content = fs.readFileSync(cssPath, 'utf8');
let replacedCount = 0;

hashes.forEach(hash => {
  const regex = new RegExp(`url\\(${hash}\\)`, 'g');
  if (regex.test(content)) {
    content = content.replace(regex, 'none');
    replacedCount++;
    console.log(`Replaced broken reference to ${hash}`);
  }
});

fs.writeFileSync(cssPath, content, 'utf8');
console.log(`Successfully replaced ${replacedCount} broken references in style.css`);
