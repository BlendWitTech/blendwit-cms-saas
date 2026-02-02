const { join } = require('path');
console.log('CWD:', process.cwd());
console.log('__dirname:', __dirname);
console.log('Target Uploads (join):', join(__dirname, '..', __dirname.includes('dist') ? '..' : '', 'uploads'));
console.log('Does uploads exist at CWD/uploads?', require('fs').existsSync(join(process.cwd(), 'uploads')));
console.log('Does uploads exist at CWD/../uploads?', require('fs').existsSync(join(process.cwd(), '..', 'uploads')));
