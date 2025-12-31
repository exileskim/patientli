const fs = require('fs');
const path = require('path');

function findFiles(dir, exts) {
  let results = [];
  try {
    const list = fs.readdirSync(dir);
    list.forEach(file => {
      file = path.join(dir, file);
      const stat = fs.statSync(file);
      if (stat && stat.isDirectory()) {
        results = results.concat(findFiles(file, exts));
      } else if (exts.some(ext => file.endsWith(ext))) {
        results.push(file);
      }
    });
  } catch(e) {}
  return results;
}

// Find all image references
const srcFiles = findFiles('./src', ['.tsx', '.json']);
const imageRefs = new Set();

srcFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const matches = content.match(/\"\/images\/[^\"]+\"/g) || [];
  matches.forEach(m => imageRefs.add(m.replace(/\"/g, '')));
});

// Check which are missing
const missing = [];
imageRefs.forEach(ref => {
  if (!fs.existsSync('./public' + ref)) {
    missing.push(ref);
  }
});

if (missing.length > 0) {
  console.log('Missing images:');
  missing.forEach(m => console.log('  ' + m));
  console.log('\nTotal missing:', missing.length);
} else {
  console.log('✓ All images exist!');
}
