import archiver from 'archiver';
import fs from 'fs';
import path from 'path';

// Create output directory if it doesn't exist
const outputDir = path.join(process.cwd(), 'output');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// Create a file to stream archive data to
const output = fs.createWriteStream(path.join(outputDir, 'extension.zip'));
const archive = archiver('zip', {
  zlib: { level: 9 } // Maximum compression
});

// Listen for all archive data to be written
output.on('close', () => {
  console.log(`Extension packaged successfully! Size: ${archive.pointer()} bytes`);
  console.log('The extension.zip file is ready in the output directory');
});

archive.on('error', (err) => {
  throw err;
});

// Pipe archive data to the file
archive.pipe(output);

// Add the dist directory contents to the zip
archive.directory('dist/', false);

// Finalize the archive
archive.finalize();