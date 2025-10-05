import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { mode, text, instruction } = req.body;

  if (!text) return res.status(400).json({ error: 'text is required' });

  const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;
  if (!REPLICATE_API_TOKEN) return res.status(500).json({ error: 'Missing REPLICATE_API_TOKEN in env' });

  const MODEL_VERSION = process.env.REPLICATE_MODEL_VERSION || '<PON_AQUI_EL_MODEL_VERSION_ID>';

  try {
    const prompt = mode === 'review'
      ? `Revisa este texto y sugiere mejoras concisas, detecta errores ortográficos y gramaticales, y ofrece una versión pulida:\n\n${text}`
      : (instruction || `Escribe un texto nuevo basado en: ${text}`);

    const body = {
      version: MODEL_VERSION,
      input: {
        text: prompt
      }
    };

    const apiRes = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const data = await apiRes.json();
    return res.status(200).json(data);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error calling Replicate API', details: String(err) });
  }
}
