import fs from 'fs';
import path from 'path';

function processDir(dir) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const p = path.join(dir, item);
    if (fs.statSync(p).isDirectory()) {
      processDir(p);
    } else if (p.endsWith('.jsx')) {
      let content = fs.readFileSync(p, 'utf8');
      
      let modified = false;
      content = content.replace(/<img\s([^>]+)>/g, (match, attrs) => {
        if (!attrs.includes('loading')) {
          modified = true;
          // Important: in JSX, self closing tags usually have />
          // But our regex matched `<img ...>` not including `/>` unless we captured it.
          // A safer regex for JSX: /<img\s+([^>]+?)\s*\/?>/g
          return match; 
        }
        return match;
      });

      // Let's do a simpler approach:
      // Simply replace `<img ` with `<img loading="lazy" `
      // BUT only if it doesn't already have loading="lazy"
      // Actually, we can just blind replace and manually check.
      
    }
  }
}

// Better approach for script:
function addLazyLoading(dir) {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    for (const file of files) {
        const fullPath = path.join(dir, file.name);
        if (file.isDirectory()) {
            addLazyLoading(fullPath);
        } else if (file.name.endsWith('.jsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let updated = false;
            
            // This regex finds <img .../> and adds loading="lazy" if not present
            content = content.replace(/<img(.*?)>/g, (match, p1) => {
                if (!match.includes('loading=')) {
                    updated = true;
                    // Check if it's self closing jsx tag
                    if (p1.endsWith('/')) {
                        return `<img${p1.slice(0, -1)} loading="lazy" />`;
                    } else {
                        return `<img${p1} loading="lazy">`;
                    }
                }
                return match;
            });
            
            if (updated) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated: ${fullPath}`);
            }
        }
    }
}

addLazyLoading('./src');
console.log('Done!');
