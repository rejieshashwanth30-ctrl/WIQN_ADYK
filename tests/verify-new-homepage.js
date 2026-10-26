const http = require('http');

function fetchPage(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:3000${path}`, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        resolve({ status: res.statusCode, headers: res.headers, body: data });
      });
    }).on('error', reject);
  });
}

async function run() {
  console.log('=== WIQN HOMEPAGE VERIFICATION ===');
  const res = await fetchPage('/');
  console.log('Status code:', res.status);

  // 1. Check Section Order in HTML
  const heroIdx = res.body.indexOf('id="hero"');
  const featuresIdx = res.body.indexOf('id="features"');
  const howIdx = res.body.indexOf('id="how-it-works"');
  const whyIdx = res.body.indexOf('id="why-wiqn"');
  const aboutIdx = res.body.indexOf('id="about"');
  const builtByIdx = res.body.indexOf('id="built-by"');
  const contactIdx = res.body.indexOf('id="contact"');
  const ctaIdx = res.body.indexOf('id="cta"');

  console.log('\n--- Section Indices ---');
  console.log('01 Hero:', heroIdx);
  console.log('02 Features:', featuresIdx);
  console.log('03 How WIQN Works:', howIdx);
  console.log('04 Why WIQN:', whyIdx);
  console.log('05 About WIQN:', aboutIdx);
  console.log('06 Built By:', builtByIdx);
  console.log('07 Contact:', contactIdx);
  console.log('08 Final CTA:', ctaIdx);

  const isOrdered = (
    heroIdx > 0 &&
    featuresIdx > heroIdx &&
    howIdx > featuresIdx &&
    whyIdx > howIdx &&
    aboutIdx > whyIdx &&
    builtByIdx > aboutIdx &&
    contactIdx > builtByIdx &&
    ctaIdx > contactIdx
  );
  console.log('Exact 8-Section Order Correct?:', isOrdered ? 'YES [PASS]' : 'NO [FAIL]');

  // 2. Check Built By contains ONLY Rejiesh, NO Dineshraj
  const builtBySection = res.body.substring(builtByIdx, contactIdx);
  const rejieshInBuiltBy = builtBySection.includes('REJIESH ASHWANTH V');
  const dineshrajInBuiltBy = builtBySection.includes('Dineshraj');
  console.log('Rejiesh in Built By?:', rejieshInBuiltBy ? 'YES [PASS]' : 'NO [FAIL]');
  console.log('Dineshraj NOT in Built By?:', !dineshrajInBuiltBy ? 'YES [PASS]' : 'NO [FAIL]');

  // 3. Check Contact Section contains Dineshraj with Founder attribution + Rejiesh + Phone + Email
  const contactSection = res.body.substring(contactIdx, ctaIdx);
  const dineshrajInContact = contactSection.includes('Dineshraj S') && contactSection.includes('Founder — ADYK Multi Venture Company');
  const phoneInContact = contactSection.includes('8870605699');
  const emailInContact = contactSection.includes('adykcompany.in@gmail.com');
  console.log('Dineshraj Founder attribution in Contact?:', dineshrajInContact ? 'YES [PASS]' : 'NO [FAIL]');
  console.log('Phone in Contact?:', phoneInContact ? 'YES [PASS]' : 'NO [FAIL]');
  console.log('Email in Contact?:', emailInContact ? 'YES [PASS]' : 'NO [FAIL]');

  // 4. Check Navigation and Footer Anchors
  const navHasFeatures = res.body.includes('href="#features"');
  const navHasHow = res.body.includes('href="#how-it-works"');
  const navHasWhy = res.body.includes('href="#why-wiqn"');
  const navHasAbout = res.body.includes('href="#about"');
  const navHasContact = res.body.includes('href="#contact"');
  console.log('Nav Anchors Valid?:', (navHasFeatures && navHasHow && navHasWhy && navHasAbout && navHasContact) ? 'YES [PASS]' : 'NO [FAIL]');

  console.log('\n=== ALL HOMEPAGE CHECKS COMPLETE ===');
}

run().catch(console.error);
