const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const path = require('path');

const database = {
  "2076937": {
    "name": "Alice",
    "course": "Computer Science",
    "class": "3A"
  },
  "1234567": {
    "name": "Bob",
    "course": "Physics",
    "class": "1B"
  },
  "9876543": {
    "name": "Charlie",
    "course": "Chemistry",
    "class": "2C"
  },
  "5555555": {
    "name": "David",
    "course": "Biology",
    "class": "4D"
  },
  "1111111": {
    "name": "Eve",
    "course": "Mathematics",
    "class": "5E"
  }
};

let chamadaAberta = false;


app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/aluno', function (req, res) {
  res.sendFile(path.join(__dirname, 'aluno.html'));
});

app.post('/iniciar_chamada', function (req, res) {
  console.log('Chamada iniciada, aguardando alunos');
  chamadaAberta = true;
  io.emit('chamada', chamadaAberta);
  res.send('Chamada iniciada, aguardando alunos');
});

app.get('/verificar_chamada', function (req, res) {
  res.send(chamadaAberta);
});

// app.post('/registrar_presenca', function (req, res) {
//   const id = req.body.id;
//   console.log('ID inserido:', id);
//   if (chamadaAberta) {
//     if (database[id]) {
//       console.log('Aluno registrado: ' + id);
//       res.json({ status: 'OK' });
//     } else {
//       res.status(400).json({ error: 'ID não encontrado' });
//     }
//   } else {
//     res.status(400).json({ error: 'Chamada fechada' });
//   }
// });

app.post('/registrar_presenca', function (req, res) {
  const id = req.body.id;
  console.log('Request body:', req.body.id); 
  console.log('ID inserido:', id);
  if (chamadaAberta) {
    if (id in database) {
      console.log('Aluno registrado: ' + id);
      res.json({ status: 'OK' });
    } else {
      res.status(400).json({ error: 'ID não encontrado' });
    }
  } else {
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
