import dotenv from 'dotenv';
dotenv.config();

async function checkFreeModels() {
  const key = process.env.AI_API_KEY;
  const res = await fetch('https://openrouter.ai/api/v1/models', {
    headers: { Authorization: `Bearer ${key}` }
  });
  const data = await res.json();
  const freeModels = data.data
    .filter((m: any) => m.id.endsWith(':free') || m.pricing.prompt === '0')
    .map((m: any) => ({
      id: m.id,
      name: m.name,
      context_length: m.context_length
    }));

  console.log(`Found ${freeModels.length} free models:`);
  console.log(JSON.stringify(freeModels.slice(0, 20), null, 2));
}

checkFreeModels();
