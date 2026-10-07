import dotenv from 'dotenv';
dotenv.config();

const modelsToTest = [
  'nvidia/nemotron-3.5-lightning:free',
  'openrouter/free',
  'google/gemma-4-31b-it:free'
];

async function testModels() {
  const key = process.env.AI_API_KEY;

  for (const model of modelsToTest) {
    console.log(`\nTesting: ${model}...`);
    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: 'system',
              content: 'You are a JSON assistant. Respond with ONLY valid JSON: {"status": "ok", "message": "hello"}'
            },
            { role: 'user', content: 'Give JSON' }
          ]
        })
      });

      const data = await res.json();
      if (data.error) {
        console.log(`❌ Error (${data.error.code || 'provider'}): ${data.error.message}`);
      } else {
        const content = data.choices?.[0]?.message?.content;
        console.log(`✅ Success! Response: ${content.trim()}`);
      }
    } catch (e: any) {
      console.log(`❌ Network Exception: ${e.message}`);
    }
  }
}

testModels();
