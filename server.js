import express from 'express';
const app = express();
import { nuevoUsuario, getUsuarios } from './db.js';

app.use(express.static('static'));

app.post('/usuario', async (req, res) => {
  let data;

  req.on('data', (payload) => {
    data = JSON.parse(payload);
  });

  req.on('end', async () => {
    try {
      const { nombre, balance } = data;

      if (typeof nombre !== 'string' || nombre.length > 255)
        throw 'Formato nombre no valido';

      if (typeof balance !== 'number' || balance <= 0) throw 'Balance invalido';

      const postNuevoUsuario = await nuevoUsuario(nombre, balance);
      console.log(postNuevoUsuario);
      res.status(200).send({ postNuevoUsuario });
    } catch (error) {
      console.log(error);
      res.status(400).send({ error });
    }
  });
});

app.get('/usuarios', async () => {
  const usuarios = await getUsuarios();
  res.status(200).json({ usuarios });
});

app.listen(3000, () => console.log('Servidor funcionando en puerto 3000'));
