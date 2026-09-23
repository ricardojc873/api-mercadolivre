const fetch = require('node-fetch');

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { refresh_token } = req.body || {};

  const APP_ID = process.env.MELI_APP_ID;
  const SECRET_KEY = process.env.MELI_SECRET_KEY;

  if (!refresh_token) {
    return res.status(400).json({ error: 'Refresh Token não fornecido.' });
  }

  try {
    const response = await fetch('https://api.mercadolibre.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: APP_ID,
        client_secret: SECRET_KEY,
        refresh_token: refresh_token
      })
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
