import express from 'express';
const app = express();
import {
  nuevoUsuario,
  getUsuarios,
  editarUsuario,
  deleteUsuario,
  newTransferencia,
} from './db.js';
app.use(express.static('static'));

function checkValues(nombre = 'Nombre', balance = 1) {
  if (typeof nombre !== 'string' || nombre.length > 255)
    throw 'Formato nombre no valido';
  if (typeof balance !== 'number' || balance <= 0) throw 'Monto invalido';
}

app.post('/usuario', async (req, res) => {
  let data;
  req.on('data', payload => {
    data = JSON.parse(payload);
  });

  req.on('end', async () => {
    try {
      const { nombre, balance } = data;
      checkValues(nombre, balance);
      const postNuevoUsuario = await nuevoUsuario(nombre, balance);
      console.log(postNuevoUsuario);
      res.status(200).send({ postNuevoUsuario });
    } catch (error) {
      console.log(error);
      res.status(400).send({ error });
    }
  });
});

app.get('/usuarios', async (req, res) => {
  try {
    const usuarios = await getUsuarios();
    res.status(200).send(usuarios);
  } catch (error) {
    console.log(error);
    res.status(400).send({ error });
  }
});

app.put('/usuario', async (req, res) => {
  try {
    let data;
    req.on('data', payload => {
      data = JSON.parse(payload);
    });
    req.on('end', async () => {
      const { id } = req.query;
      const { name, balance } = data;
      const put = await editarUsuario(id, name, balance);
      console.log(put);
      res.status(200).send(put);
    });
  } catch (error) {
    console.log(error);
  }
});

app.delete('/usuario', async (req, res) => {
  try {
    const { id } = req.query;
    const eliminarUsuario = await deleteUsuario(id);
    console.log(eliminarUsuario);
    res.status(200).send(eliminarUsuario);
  } catch (error) {
    console.log(error);
    res.status(400).send({ error });
  }
});

app.post('/transferencia', async (req, res) => {
  let data;
  req.on('data', payload => {
    data = JSON.parse(payload);
  });
  req.on('end', async () => {
    try {
      let { emisor, receptor, monto } = data;
      monto = +monto;
      checkValues('', monto);
      const transferencia = await newTransferencia(emisor, receptor, monto);
      console.log(transferencia);
      res.status(200).send(transferencia);
    } catch (error) {
      console.log(error.message);
      res.status(400).send({ error });
    }
  });
});

app.listen(3000, () => console.log('Servidor funcionando en puerto 3000'));
