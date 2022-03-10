import pg from 'pg';
const { Pool } = pg;

const config = {
  user: 'postgres',
  host: 'localhost',
  password: '1234',
  database: 'bancosolar',
  port: 5432,
  max: 20,
  idleTimeoutMillis: 5000,
  connectionTimeoutMillis: 2000,
};

const pool = new Pool(config);

export async function nuevoUsuario(nombre, balance) {
  try {
    const client = await pool.connect();
    const res = await client.query({
      text: 'insert into usuarios (nombre, balance) values ($1,$2)',
      values: [nombre, balance],
    });
    client.release();

    return res.rowCount && `Usuario ${nombre} registrado con exito`;
  } catch (error) {
    console.log(error);
    throw error.message;
  }
}

export async function getUsuarios(nombre, balance) {
  try {
    const client = await pool.connect();
    const res = await client.query('select * from usuarios;');
    client.release();
    return res.rows;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function editarUsuario(id, nombre, balance) {
  try {
    const client = await pool.connect();
    const res = await client.query({
      text: 'update usuarios set nombre = $2, balance = $3 where id = $1',
      values: [id, nombre, balance],
    });
    client.release();
    if (res.rowCount == 1) return `Usuario ${nombre} editado con exito`;
    else throw `Usuario ${nombre} no existe`;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteUsuario(id) {
  try {
    const client = await pool.connect();
    const res = await client.query({
      text: 'DELETE from usuarios where id = $1;',
      values: [id],
    });
    client.release();
    return res.rowCount ? `Usuario eliminado con exito` : `Usuario no existe`;
  } catch (error) {
    console.log(error.message);
    throw error;
  }
}

export async function newTransferencia(emisor, receptor, monto) {
  try {
    const client = await pool.connect();
    const { rows: datosUsuarios } = await client.query({
      text: 'select * from usuarios where nombre in ($1,$2)',
      values: [emisor, receptor],
    });

    const [datosEmisor, datosReceptor] = datosUsuarios;
    if (monto > datosEmisor.balance)
      throw new Error('Emisor no tiene suficiente saldo');

    const newBalanceEmisor = await client.query({
      text: 'update usuarios set balance = $2 where id=',
      values: [datosEmisor.id, datosReceptor.id, monto],
    });

    const transferencia = await client.query({
      text: 'insert into transferencias (fecha,emisor,receptor, monto) values (now(),$1,$2,$3)',
      values: [datosEmisor.id, datosReceptor.id, monto],
    });

    client.release();
  } catch (error) {
    throw error;
  }
}
