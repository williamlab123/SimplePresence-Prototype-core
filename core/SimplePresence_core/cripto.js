const crypto = require('crypto');
const wifi = require('node-wifi');

wifi.init({
  iface: null // network interface, choose a random wifi interface if set to null
});

function getSSID() {
  return new Promise((resolve, reject) => {
    wifi.getCurrentConnections((err, currentConnections) => {
      if (err) {
        reject(err);
      } else {
        resolve(currentConnections[0].ssid);
      }
    });
  });
}

async function generateHash() {
  const ssid = await getSSID();
  const seed = "my_fixed_seed_value"; // valor fixo para a semente
  const hash = crypto.createHash('sha256').update(`${ssid}${seed}`).digest('hex');
  return hash;
}


// generateHash().then(hash => console.log(hash));

module.exports = {
    generateHash
  };
  



// const crypto = require('crypto');
// const wifi = require('node-wifi');

// wifi.init({
//   iface: null // network interface, choose a random wifi interface if set to null
// });

// function getSSID() {
//   return new Promise((resolve, reject) => {
//     wifi.getCurrentConnections((err, currentConnections) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(currentConnections[0].ssid);
//       }
//     });
//   });
// }

// function generateRandomSeed() {
//   return crypto.randomBytes(16).toString('hex');
// }

// async function generateHash() {
//   const ssid = await getSSID();
//   const seed = generateRandomSeed();
//   const hash = crypto.createHash('sha256').update(`${ssid}${seed}`).digest('hex');
//   return hash;
// }

// generateHash().then(hash => console.log(hash));
