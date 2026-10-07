import dotenv from 'dotenv';
dotenv.config();

async function run() {
  const key = process.env.AI_API_KEY;
  const model = process.env.AI_MODEL;
  console.log('Sending request to model:', model);

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`
    },
    body: JSON.stringify({
      model: model,
      messages: [
        { role: 'system', content: 'You must respond ONLY with a JSON object: {"status": "ok", "message": "hello"}' },
        { role: 'user', content: 'Please output the JSON' }
      ],
      response_format: { type: 'json_object' }
    })
  });

  console.log('Status code:', res.status);
  const data = await res.text();
  console.log('Response body:', data);
}

run();
