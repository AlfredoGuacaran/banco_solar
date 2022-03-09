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
    throw error;
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
