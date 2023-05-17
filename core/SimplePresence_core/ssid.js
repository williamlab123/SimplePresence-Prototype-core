const wifi = require('node-wifi');

wifi.init({
  iface: null // passar null para usar a primeira interface disponível
});

wifi.getCurrentConnections((err, currentConnections) => {
  if (err) {
    console.log(err);
    return;
  }

  const ssid = currentConnections[0].ssid;
  console.log('SSID atual:', ssid);
});
