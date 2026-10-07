import dotenv from 'dotenv';
dotenv.config();

import { extractProjectsFromTranscript, validateDraft } from '../src/services/ai.js';
import { seedDemoUsers } from '../src/db/seed.js';

// Random / Novel Transcript with custom scope, corrections, and final recap
const RANDOM_TRANSCRIPT = `
Meeting: NovaWorks Rapid Sprint Planning
Date: 12 October 2026
Participants: Ayesha, Ali, Hamza

Ayesha: Good afternoon team. We have a new special client project to deliver: HealthPulse Portal for client MedTech Global.
I will manage this project. The initial deadline was 25 October 2026.
Ali: Does the portal need telemedicine video streaming?
Ayesha: No, video calls are out of scope for this MVP. Strictly patient appointment scheduling and doctor profiles. 
Let's make sure the delivery date is set to 28 October 2026 based on client feedback.
Ali: Understood. I will own Doctor Profile UI. That will take 10 hours, due on 18 October 2026.
Hamza: I will build Appointment Booking APIs. I estimate 14 hours, due on 21 October 2026.
Ali: And I will handle End-to-End System Integration and testing. Let's allocate 8 hours, due on 26 October 2026.
Ayesha: Perfect. Final recap: HealthPulse Portal for MedTech Global, manager Ayesha, deadline 28 October 2026. 
Tasks: Doctor Profile UI (Ali, 10 hours, 18 Oct), Appointment Booking APIs (Hamza, 14 hours, 21 Oct), End-to-End System Integration (Ali, 8 hours, 26 Oct). 
Let's get to work!
`;

async function testLiveModel() {
  console.log('🚀 Testing Live AI Extraction with OpenRouter Model:', process.env.AI_MODEL);

  await seedDemoUsers();

  console.log('\nSending novel random transcript to Nemotron...');
  const startTime = Date.now();
  const draft = await extractProjectsFromTranscript(RANDOM_TRANSCRIPT);
  const duration = ((Date.now() - startTime) / 1000).toFixed(2);

  console.log(`⏱️ AI Response received in ${duration}s!`);
  console.log('\n📄 Extracted Draft:');
  console.log(JSON.stringify(draft, null, 2));

  // Run validation
  const validation = validateDraft(draft);
  console.log('\n🔍 Validation Status:');
  console.log('Valid:', validation.valid);
  if (!validation.valid) {
    console.error('Validation Errors:', validation.errors);
    process.exit(1);
  } else {
    console.log('✅ Validation passed! The model produced 100% compliant schema with directory IDs!');
  }
}

testLiveModel().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
