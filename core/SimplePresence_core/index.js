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



// const connection = mysql.createConnection({
//   host: '192.168.1.106', // Substitua pelo endereço IP do outro computador
//   user: 'root',
//   password: '12345',
//   database: 'alunos'
// });


// function verificarAluno(id) {
//   return new Promise((resolve, reject) => {
//     const query = `SELECT * FROM alunos WHERE id = ${id}`;
//     connection.query(query, (err, results) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(results.length > 0); // Retorna true se houver resultados, caso contrário, retorna false
//       }
//     });
//   });
// }


// const database = {
//   "2076937": {
//     "name": "Alice",
//     "course": "Computer Science",
//     "class": "3A"
//   },
//   "1234567": {
//     "name": "Bob",
//     "course": "Physics",
//     "class": "1B"
//   },
//   "9876543": {
//     "name": "Charlie",
//     "course": "Chemistry",
//     "class": "2C"
//   },
//   "5555555": {
//     "name": "David",
//     "course": "Biology",
//     "class": "4D"
//   },
//   "1111111": {
//     "name": "Eve",
//     "course": "Mathematics",
//     "class": "5E"
//   }
// };

let alunos_presentes = [];
var ssidAluno = "";
var ssidProf = "";



function getCurrentSSID() {
  return new Promise((resolve, reject) => {
    wifi.init({
      iface: null // passar null para usar a primeira interface disponível
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



getCurrentSSID().then((ssid) => {
  ssidProf = ssid;
  console.log('SSID atual do professor:', ssidProf);
}).catch((err) => {
  console.log(err);
});


let chamadaAberta = false;

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');




});

app.get('/aluno', function (req, res) {
  res.sendFile(path.join(__dirname, 'aluno.html'));

  getCurrentSSID()
  .then((ssid) => {
    ssidAluno = ssid; // Atribui o valor do ssid à variável ssidAluno
    console.log('ssid do aluno:', ssidAluno);
  })
  .catch((err) => {
    console.log(err);
  });

  
//   ssidAluno =  getCurrentSSID().then((ssid) => {

//   console.log('ssid do aluno:', ssidAluno);
// }).catch((err) => {
//   console.log(err);
// });

  

  
 


  // ssid = getCurrentSSID().then((ssid) => {
  //   console.log('SSID atual:', ssid);
  // }).catch((err) => {
  //   console.log(err);
  // });

 // ssidAluno = ssid;


});




// app.post('/ssid', function (req, res) {
//   const wifi = require('node-wifi');

//   wifi.init({
//     iface: null // passar null para usar a primeira interface disponível
//   });

//   wifi.getCurrentConnections((err, currentConnections) => {
//     if (err) {
//       console.log(err);
//       return;
//     }

//     const ssid = currentConnections[0].ssid;
//     console.log('SSID atual:', ssid);
//   });

// })





app.post('/iniciar_chamada', function (req, res) {
  console.log('Chamada iniciada, aguardando alunos');
  chamadaAberta = true;
  io.emit('chamada', chamadaAberta);
  res.send('Chamada iniciada, aguardando alunos');
});

app.post('/fechar_chamada', function (req, res) {
  console.log("chamada fechada")
  chamadaAberta = false;
  io.emit('chamada', chamadaAberta)
  res.send("chamada fechada")
  console.log("os alunos que registraram presença foram:")
  console.log(alunos_presentes)
})



app.get('/verificar_chamada', function (req, res) {
  res.send(chamadaAberta);
});


app.get('/ssid', function (req, res) {
  res.send(ssidAluno)
})


app.get('/alunos_presentes', function (req, res) {
  res.send(alunos_presentes)
})

app.post('/registrar_presenca', function (req, res) {
  const id = req.body.id
  console.log('Chamada aberta:', chamadaAberta);
  console.log('ID inserido:', id);
  if (chamadaAberta && ssidAluno === ssidProf) {

   // verificarAluno(id)
     // .then(existe => {
       // if (existe) {
          console.log(`O aluno com ID ${id} registrou presença.`);
          res.send("Sua presença foi registrada!")
          alunos_presentes.push(id)
    //    } else {
          console.log(`O aluno com ID ${id} não foi encontrado no banco de dados.`);
          res.send("Id insediro incorreto!")
          
        }
            
   else if (ssidAluno !== ssidProf)
   {
    console.log("Voce precisa estar na mesma rede para registrar presença!")
    res.status(400).json({ error: "Voce precisa estar na mesma rede para registrar presença!" })
  }

  else
   {
    console.log("chamada fechada")
    res.status(400).json({ error: 'Chamada fechada' });
  }
      })
      // .catch(err => {
      //   console.error('Erro ao verificar aluno:', err);
      // });

      
    // if (database.hasOwnProperty(id)) {

    //   console.log(`Aluno registrado: ${id} - Nome: ${database[id].name} - Curso: ${database[id].course} - Turma: ${database[id].class}`);
    //   alunos_presentes.push(id);



    //   res.json({ status: 'OK' });
    // } else {
    //   console.log("id nao encontrado")
    //   res.status(400).json({ error: 'ID não encontrado' });
    // }




  // }

// });


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



