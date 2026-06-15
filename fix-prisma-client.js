const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(filePath));
    } else if (filePath.endsWith('.ts')) {
      results.push(filePath);
    }
  });
  return results;
}

const files = walk('src');
let count = 0;
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  // Match this.prisma. followed by word chars, but not 'client', '$transaction', '$connect', '$disconnect', '$queryRaw'
  const regex = /this\.prisma\.(?!(client|\$transaction|\$connect|\$disconnect|\$queryRaw)\b)([a-zA-Z0-9_]+)/g;
  if (regex.test(content)) {
    content = content.replace(regex, 'this.prisma.client.$2');
    fs.writeFileSync(file, content, 'utf8');
    count++;
    console.log('Updated', file);
  }
});
console.log('Total files updated:', count);
