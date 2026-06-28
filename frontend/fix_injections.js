const fs = require('fs');
const path = require('path');

function walkDir(dir) {
  if (!fs.existsSync(dir)) return;
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      if (!file.includes('node_modules') && !file.includes('.git')) {
        walkDir(file);
      }
    } else if (file.endsWith('.html')) {
      let content = fs.readFileSync(file, 'utf8');
      
      const oldInject1 = '<script src="../scripts/ai-chat.js"></script>\\n';
      const oldInject2 = '<script src="../scripts/ai-chat.js"></script>';
      
      let modified = false;
      if (content.includes(oldInject1) || content.includes(oldInject2)) {
        content = content.split(oldInject1).join('');
        content = content.split(oldInject2).join('');
        modified = true;
      }
      
      const lastIndex = content.lastIndexOf('</body>');
      if (lastIndex !== -1) {
        content = content.slice(0, lastIndex) + oldInject1 + content.slice(lastIndex);
        modified = true;
      }
      
      if (modified) {
        fs.writeFileSync(file, content);
        console.log('Fixed ' + file);
      }
    }
  });
}

walkDir('.');
