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
    } else if (filePath.endsWith('.ts') && !filePath.includes('prisma.service.ts')) {
      results.push(filePath);
    }
  });
  return results;
}

const files = walk('src');
let count = 0;
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('return this.transactionContext.getTransaction() ?? this.prisma;')) {
    content = content.replace(/return this\.transactionContext\.getTransaction\(\) \?\? this\.prisma;/g, 'return this.prisma.client;');
    fs.writeFileSync(file, content, 'utf8');
    count++;
    console.log('Updated', file);
  }
});
console.log('Total getPrismaClient files updated:', count);
