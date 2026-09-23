export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { refresh_token } = req.body;

  if (!refresh_token) {
    return res.status(400).json({ error: 'Token ou código não fornecido' });
  }

  // Identifica se é um código de autorização inicial (TG-...) ou um Refresh Token
  const isCode = refresh_token.startsWith('TG-');
  const grantType = isCode ? 'authorization_code' : 'refresh_token';

  // Parâmetros necessários para a API do Mercado Livre
  const params = new URLSearchParams({
    client_id: process.env.MELI_CLIENT_ID,
    client_secret: process.env.MELI_CLIENT_SECRET,
    grant_type: grantType,
    redirect_uri: 'https://api-mercadolivre-nu.vercel.app'
  });

  if (isCode) {
    params.append('code', refresh_token);
  } else {
    params.append('refresh_token', refresh_token);
  }

  try {
    const response = await fetch('https://api.mercadolibre.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: params.toString()
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao comunicar com a API do Mercado Livre', details: error.message });
  }
}
