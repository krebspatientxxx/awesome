console.log('🚀 App.js geladen');

const form = document.getElementById('captchaForm');
const resultDiv = document.getElementById('result');
const btn = form.querySelector('button');

// hCaptcha Render
function renderCaptcha() {
  try {
    // Fetch Site Key vom Server
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        console.log('📍 Site Key:', data.siteKey);
        
        hcaptcha.render('captcha-container', {
          sitekey: data.siteKey,
          theme: 'light',
          callback: onCaptchaSuccess,
          'error-callback': onCaptchaError,
          'expired-callback': onCaptchaExpired,
        });
        console.log('✅ hCaptcha wurde gerendert');
      })
      .catch(err => {
        console.error('❌ Fehler beim Laden der Config:', err);
        showResult('❌ Fehler: Kann Site Key nicht laden', 'error');
      });
  } catch (error) {
    console.error('❌ Render Fehler:', error);
    showResult('❌ hCaptcha Fehler: ' + error.message, 'error');
  }
}

function onCaptchaSuccess(token) {
  console.log('🎉 Captcha erfolgreich! Token:', token.substring(0, 20) + '...');
  btn.disabled = false;
}

function onCaptchaError() {
  console.warn('⚠️ Captcha Fehler');
  showResult('⚠️ hCaptcha Fehler. Versuche es erneut.', 'error');
}

function onCaptchaExpired() {
  console.warn('⏰ Captcha abgelaufen');
  showResult('⏰ Captcha ist abgelaufen. Versuche es erneut.', 'error');
}

// Form Submit
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const token = hcaptcha.getResponse();
  
  if (!token) {
    showResult('❌ Bitte löse das Captcha', 'error');
    return;
  }
  
  btn.disabled = true;
  btn.textContent = '⏳ Verifiziere...';
  showResult('⏳ Verifiziere dich...', 'loading');
  
  try {
    const response = await fetch('/api/verify-captcha', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: token })
    });
    
    const data = await response.json();
    console.log('📊 Server Response:', data);
    
    if (data.success) {
      showResult(
        `✅ ${data.message}\n🏠 Hostname: ${data.hostname}`,
        'success'
      );
    } else {
      showResult(`❌ ${data.message}`, 'error');
    }
  } catch (error) {
    console.error('❌ Fehler:', error);
    showResult('❌ Fehler: ' + error.message, 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Verifizieren';
    hcaptcha.reset();
  }
});

function showResult(message, type) {
  resultDiv.textContent = message;
  resultDiv.className = `result show ${type}`;
  console.log(`📢 ${type.toUpperCase()}: ${message}`);
}

// Auf hCaptcha warten
if (typeof hcaptcha !== 'undefined') {
  console.log('✅ hCaptcha ist verfügbar');
  renderCaptcha();
} else {
  console.warn('⏳ Warte auf hCaptcha...');
  setTimeout(() => {
    if (typeof hcaptcha !== 'undefined') {
      renderCaptcha();
    } else {
      showResult('❌ hCaptcha konnte nicht geladen werden', 'error');
    }
  }, 2000);
}
