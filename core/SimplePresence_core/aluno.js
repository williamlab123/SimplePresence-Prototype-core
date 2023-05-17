// const registrarBtn = document.getElementById('registrar-btn');
// const idInput = document.getElementById('id-input');
// const statusMsg = document.getElementById('status');

// const checkStatus = () => {
//   fetch('http://localhost:3000/verificar_chamada')
//     .then(response => response.json())
//     .then(data => {
//       if (data) {
//         registrarBtn.disabled = false;
//         statusMsg.innerHTML = '';
//       } else {
//         registrarBtn.disabled = true;
//         statusMsg.innerHTML = 'Chamada fechada';
//       }
//     })
//     .catch(err => console.error(err));
// }

// setInterval(checkStatus, 5000);

// const form = document.querySelector('form');
// form.addEventListener('submit', (event) => {
//   event.preventDefault();
//   const id = idInput.value;

//   fetch('http://localhost:3000/registrar_presenca', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({
//         id: id
//       })
//     })
//     .then(response => response.json())
//     .then(data => {
//       console.log('Presença registrada');
//       statusMsg.innerHTML = 'Presença registrada';
//     })
//     .catch(err => console.error(err));
// });
