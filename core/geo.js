const readline = require('readline');

function calcularDistancia(lat1, lon1, lat2, lon2) {
  const raioTerra = 6371000; // Raio médio da Terra em metros

  // Converter as coordenadas de graus para radianos
  const lat1Rad = degToRad(lat1);
  const lon1Rad = degToRad(lon1);
  const lat2Rad = degToRad(lat2);
  const lon2Rad = degToRad(lon2);

  // Calcular diferenças de latitude e longitude
  const dLat = lat2Rad - lat1Rad;
  const dLon = lon2Rad - lon1Rad;

  // Calcular a distância usando a fórmula de Haversine
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1Rad) *
      Math.cos(lat2Rad) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distancia = raioTerra * c;

  return distancia;
}

function degToRad(deg) {
  return deg * (Math.PI / 180);
}

// Criar uma interface para leitura de entrada
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Função para ler as coordenadas do usuário
function lerCoordenadas() {
  return new Promise((resolve, reject) => {
    rl.question('Insira a latitude: ', (lat) => {
      rl.question('Insira a longitude: ', (lon) => {
        resolve({ latitude: parseFloat(lat), longitude: parseFloat(lon) });
      });
    });
  });
}

// Função principal assíncrona
async function main() {
  console.log('=== Comparação de Distância ===\n');

  console.log('Coordenadas do Ponto 1:');
  const ponto1 = await lerCoordenadas();

  console.log('\nCoordenadas do Ponto 2:');
  const ponto2 = await lerCoordenadas();

  const distancia = calcularDistancia(ponto1.latitude, ponto1.longitude, ponto2.latitude, ponto2.longitude);

  console.log('\nDistância:', distancia.toFixed(2), 'metros');

  if (distancia <= 20) {
    console.log('True.');
  } else {
    console.log('False.');
  }

  rl.close();
}

// Chamar a função principal
main();
