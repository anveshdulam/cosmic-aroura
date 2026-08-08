const https = require('https');
const fs = require('fs');
const path = require('path');

const textures = {
  sun: 'https://www.solarsystemscope.com/textures/download/2k_sun.jpg',
  mercury: 'https://www.solarsystemscope.com/textures/download/2k_mercury.jpg',
  venus: 'https://www.solarsystemscope.com/textures/download/2k_venus_surface.jpg',
  earth: 'https://www.solarsystemscope.com/textures/download/2k_earth_daymap.jpg',
  clouds: 'https://www.solarsystemscope.com/textures/download/2k_earth_clouds.jpg',
  mars: 'https://www.solarsystemscope.com/textures/download/2k_mars.jpg',
  jupiter: 'https://www.solarsystemscope.com/textures/download/2k_jupiter.jpg',
  saturn: 'https://www.solarsystemscope.com/textures/download/2k_saturn.jpg',
  uranus: 'https://www.solarsystemscope.com/textures/download/2k_uranus.jpg',
  neptune: 'https://www.solarsystemscope.com/textures/download/2k_neptune.jpg',
};

const dir = path.join(__dirname, '..', 'public', 'textures');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

async function download() {
  for (const [name, url] of Object.entries(textures)) {
    const dest = path.join(dir, `${name}.jpg`);
    console.log(`Downloading ${name}...`);
    await new Promise((resolve, reject) => {
      https.get(url, (response) => {
        if (response.statusCode === 200) {
          const file = fs.createWriteStream(dest);
          response.pipe(file);
          file.on('finish', () => {
            file.close();
            resolve();
          });
        } else if (response.statusCode === 301 || response.statusCode === 302) {
           https.get(response.headers.location, (res2) => {
             const file = fs.createWriteStream(dest);
             res2.pipe(file);
             file.on('finish', () => {
               file.close();
               resolve();
             });
           });
        } else {
          console.error(`Failed to download ${name}: ${response.statusCode}`);
          resolve();
        }
      }).on('error', (err) => {
        console.error(`Error downloading ${name}: ${err.message}`);
        resolve();
      });
    });
  }
  console.log('Done!');
}

download();
