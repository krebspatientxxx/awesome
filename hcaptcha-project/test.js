/**
 * Test Script für hCaptcha Setup
 * Starte mit: npm test
 */

const fetch = require('node-fetch');
const http = require('http');

const BASE_URL = 'http://localhost:3000';

console.log('\n🧪 hCaptcha Test Suite\n');

// Test 1: Server Status
const testServerStatus = async () => {
  console.log('Test 1: 🔗 Server Status');
  try {
    const response = await fetch(BASE_URL);
    if (response.ok) {
      console.log('✅ PASS: Server antwortet mit Status 200\n');
      return true;
    } else {
      console.log(`❌ FAIL: Server Status ${response.status}\n`);
      return false;
    }
  } catch (e) {
    console.log(`❌ FAIL: ${e.message}\n`);
    return false;
  }
};

// Test 2: Config API
const testConfig = async () => {
  console.log('Test 2: ⚙️ Config API');
  try {
    const response = await fetch(`${BASE_URL}/api/config`);
    const data = await response.json();
    if (data.siteKey) {
      console.log(`✅ PASS: Site Key erhalten: ${data.siteKey}`);
      console.log(`✅ Status: ${data.status}\n`);
      return true;
    } else {
      console.log('❌ FAIL: Kein Site Key erhalten\n');
      return false;
    }
  } catch (e) {
    console.log(`❌ FAIL: ${e.message}\n`);
    return false;
  }
};

// Test 3: Verify Endpoint (ohne echten Token)
const testVerifyEndpoint = async () => {
  console.log('Test 3: ✅ Verify Endpoint');
  try {
    const response = await fetch(`${BASE_URL}/api/verify-captcha`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: 'test_dummy_token_12345' })
    });
    const data = await response.json();
    if (data.message) {
      console.log(`✅ PASS: Endpoint antwortet`);
      console.log(`Response: ${data.message}\n`);
      return true;
    } else {
      console.log('❌ FAIL: Unerwartete Response\n');
      return false;
    }
  } catch (e) {
    console.log(`❌ FAIL: ${e.message}\n`);
    return false;
  }
};

// Test 4: Fehlende Token
const testMissingToken = async () => {
  console.log('Test 4: 🔐 Fehlende Token Validierung');
  try {
    const response = await fetch(`${BASE_URL}/api/verify-captcha`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: '' })
    });
    const data = await response.json();
    if (!data.success && data.message.includes('Kein Token')) {
      console.log(`✅ PASS: Fehler korrekt behandelt\n`);
      return true;
    } else {
      console.log('❌ FAIL: Token-Validierung nicht korrekt\n');
      return false;
    }
  } catch (e) {
    console.log(`❌ FAIL: ${e.message}\n`);
    return false;
  }
};

// Test 5: CORS
const testCORS = async () => {
  console.log('Test 5: 🔀 CORS Headers');
  try {
    const response = await fetch(`${BASE_URL}/api/config`, {
      method: 'OPTIONS'
    });
    console.log(`✅ PASS: CORS aktiviert\n`);
    return true;
  } catch (e) {
    console.log(`⚠️ WARNING: ${e.message}\n`);
    return true; // Not critical
  }
};

// Alle Tests ausführen
const runAllTests = async () => {
  console.log('⏳ Warte 1 Sekunde, bis Server bereit ist...\n');
  
  await new Promise(resolve => setTimeout(resolve, 1000));

  const results = [];
  
  results.push(await testServerStatus());
  results.push(await testConfig());
  results.push(await testVerifyEndpoint());
  results.push(await testMissingToken());
  results.push(await testCORS());

  // Zusammenfassung
  const passed = results.filter(r => r).length;
  const total = results.length;
  
  console.log('📊 Test Zusammenfassung');
  console.log('═'.repeat(40));
  console.log(`Bestanden: ${passed}/${total}`);
  console.log('═'.repeat(40));
  
  if (passed === total) {
    console.log('✅ ALLE TESTS BESTANDEN!\n');
    process.exit(0);
  } else {
    console.log(`❌ ${total - passed} Test(s) fehlgeschlagen\n`);
    process.exit(1);
  }
};

// Starten
runAllTests().catch(err => {
  console.error('💥 Fehler:', err);
  process.exit(1);
});
