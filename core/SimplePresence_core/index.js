const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const wifi = require('node-wifi');
const mysql = require('mysql2');
const path = require('path');
const readline = require('readline');

app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));



//esta porra conecta com o servidor mysql do railway, mas só cai e n funfa direito ent fodase
const connection = mysql.createConnection({
  host: 'mysql-hcontainers-us-west-207.railway.app',
  user: 'uroot',
  password: 'pgYcpuAjmMsgJ1fnHy9Kq',
  database: 'railway',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 50000, //esperando pra dar timout pq essa porra so cai e mesmo assim o sql cai
  acquireTimeout: 10000,
  waitForConnections: true,
  autoReconnect: true, 
  reconnectDelay: 5000, 
});


//verifica se o id do viadao do aluno existe na porcaria do  banco de dados

function verificarAluno(id) {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM alunos WHERE id = ${id}`;
    connection.query(query, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results.length > 0); 
      }
    });
  });
}



//armazena os alunos que registraram presença na ultima aula
let alunos_presentes = [];

var ssidAluno = "";
var ssidProf = "";


//funcao que pega o ssid do corno do professor e do viado do aluno, as vezes resolve nao funcionar mas
//na maioria das vezes funciona 
function getCurrentSSID() {
  return new Promise((resolve, reject) => {
    wifi.init({
      iface: null 
    });

    wifi.getCurrentConnections((err, currentConnections) => {
      if (err) {
        reject(err);
      } else {
        const ssid = currentConnections[0].ssid;
        resolve(ssid);
      }
    });
  });
}


//pega o ssid do professor (ou tenta)
getCurrentSSID().then((ssid) => {
  ssidProf = ssid;
  console.log('SSID atual do:', ssidProf);
}).catch((err) => {
  console.log(err);
});


let chamadaAberta = false;

//aq carrega o endpoint main, index.html, mais conhecido tb como pagina do professor
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');




});


//aq é o endpoint do aluno, como da pra ler ai em baixo 
app.get('/aluno', function (req, res) {
  res.sendFile(path.join(__dirname, 'aluno.html'));

  //aq pega o ssid do aluno
  getCurrentSSID()
    .then((ssid) => {
      ssidAluno = ssid;
      console.log('ssid do aluno:', ssidAluno);
    })
    .catch((err) => {
      console.log(err);
    });


 

});






//aq inicia a chamada 
app.post('/iniciar_chamada', function (req, res) {
  console.log('Chamada iniciada, aguardando alunos');
  chamadaAberta = true;
  io.emit('chamada', chamadaAberta);
  res.send('Chamada iniciada, aguardando alunos');
});

//aq já é bem obvio oq faz né acho que nao preciso nem dizer caralho
app.post('/fechar_chamada', function (req, res) {
  console.log("chamada fechada")
  chamadaAberta = false;
  io.emit('chamada', chamadaAberta)
  res.send("chamada fechada")
  console.log("os alunos que registraram presença foram:")
  console.log(alunos_presentes)
})


//aq verifica se a chamada está aberta ou nao, retornando true ou false
app.get('/verificar_chamada', function (req, res) {
  res.send(chamadaAberta);
});


//aq é pra testar se o bagui de pegar ssid ta funcionando
app.get('/ssid', function (req, res) {
  res.send(ssidAluno)
})

//aq é pra testar e ver os alunos que registraram presença na ultima chamada
app.get('/alunos_presentes', function (req, res) {
  res.send(alunos_presentes)
})


//aq nem vou explicar oq faz pq pqp se n souber tb pode larga mao
app.post('/registrar_presenca', function (req, res) {
  const id = req.body.id


  var pode_iniciar = 0;


  //esta merda aq pega as coordenadas polares do prof e do aluno
  const latitudeAluno = req.body.latitude;
  const longitudeAluno = req.body.longitude;
  const latitudeProf = req.body.latitudeProf;
  const longitudeProf = req.body.longitudeProf;


  function calcularDistancia(lat1, lon1, lat2, lon2) {
    //aq pega o raio da terra para calcular com precisao a distancia
    const raioTerra = 6371000; 

//aq transforma essa porra pra radiano pra poder fazer os calculos    
    const lat1Rad = degToRad(lat1);
    const lon1Rad = degToRad(lon1);
    const lat2Rad = degToRad(lat2);
    const lon2Rad = degToRad(lon2);

   
    const dLat = lat2Rad - lat1Rad;
    const dLon = lon2Rad - lon1Rad;


    //aq é a formula que faz o calculo
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

 
  function calcularDistanciaEntrePontos(latitudeAluno, longitudeAluno, latitudeProf, longitudeProf) {
    const distancia = calcularDistancia(latitudeAluno, longitudeAluno, latitudeProf, longitudeProf);

    if (distancia <= 20) {
      console.log('As coordenadas estão dentro do limite de 20 metros.');
      pode_iniciar = 1;
      
    } else {
      console.log('As coordenadas estão fora do limite de 20 metros.');
      pode_iniciar = 0;
      
    }
  }
  calcularDistanciaEntrePontos(latitudeAluno, longitudeAluno, latitudeProf, longitudeProf);


  ////////////////////////////

  
//ai dps de verificar se o aluno está proximo ao professor, vai verifiar se o ssid é o mesmo tb
//se for, ele vai verificar se o id do aluno existe no banco de dados, ai dps de toda essa bagaça 
//a presença pode ser registrada
    console.log('Chamada aberta:', chamadaAberta);
    console.log('ID inserido:', id);
    if (chamadaAberta && ssidAluno === ssidProf) {

      verificarAluno(id)
        .then(existe => {
          if (existe) {
            console.log(`O aluno com ID ${id} registrou presença.`);
            res.send("Sua presença foi registrada!")
            alunos_presentes.push(id)
          } else {
            console.log(`O aluno com ID ${id} não foi encontrado no banco de dados.`);
            res.send("Id insediro incorreto!")
          }
        })
        .catch(err => {
          console.error('Erro ao verificar aluno:', err);
        });



    } else if (ssidAluno !== ssidProf) {
      console.log("Voce precisa estar na mesma rede para registrar presença!")
      res.status(400).json({ error: "Voce precisa estar na mesma rede para registrar presença!" })
    }

    else {
      console.log("chamada fechada")
      res.status(400).json({ error: 'Chamada fechada' });
    }

 
});


io.on('connection', (socket) => {
  console.log('Um usuário conectado');
  socket.emit('chamada', chamadaAberta);
});


const server = http.listen(3000, function () {
  console.log('Servidor iniciado, aguardando início da chamada');
});

// Código para adicionar

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (input) => {
  if (input === 'fechar_chamada') {
    // console.log('Chamada fechada');
    // console.log("os alunos que registraram presença foram:")
    // console.log(alunos_presentes)
    // chamadaAberta = false;
    // io.emit('chamada', chamadaAberta);

  }

  else if (input === "abrir_chamada" && chamadaAberta == false) {
    console.log("Chamada aberta");
    chamadaAberta = true;
    io.emit('chamada', chamadaAberta)
  }
});

// const form = document.getElementById('form');
// form.addEventListener('submit', (event) => {
//   event.preventDefault();
//   const profId = document.getElementById('id').value;
//   console.log(`O professor com id ${profId} abriu a chamada`);
//   // Adicione o código para enviar o ID do professor para o servidor aqui
// });



