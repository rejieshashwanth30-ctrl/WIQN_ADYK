const https = require('https');

function checkLiveDeployment() {
  https.get('https://www.wiqn.in/', (res) => {
    let body = '';
    res.on('data', (c) => (body += c));
    res.on('end', () => {
      console.log('=== VERCEL LIVE DEPLOYMENT AUDIT ===');
      console.log('HTTP Status:', res.statusCode);
      
      const checks = [
        ['Hero Eyebrow', body.includes('AI-POWERED PRODUCT VALIDATION')],
        ['Hero Headline', body.includes('Test Ideas. Discover Truth. Build Smarter.')],
        ['Hero Pipeline', body.includes('VALIDATION PIPELINE')],
        ['Section 02 Features', body.includes('WIQN FEATURES')],
        ['Section 02 Decision Bar', body.includes('EVIDENCE → DECISION')],
        ['Section 03 How WIQN Works', body.includes('HOW WIQN WORKS')],
        ['Section 04 Why WIQN', body.includes('DON&#x27;T JUST BUILD. PROVE IT.') || body.includes("DON'T JUST BUILD. PROVE IT.")],
        ['Section 05 About WIQN', body.includes('ABOUT WIQN')],
        ['Section 06 Built By', body.includes('BUILT BY')],
        ['Rejiesh in Built By', body.includes('REJIESH ASHWANTH V')],
        ['Section 07 Contact', body.includes('Let&#x27;s Talk.') || body.includes("Let's Talk.")],
        ['Dineshraj in Contact', body.includes('Dineshraj S')],
        ['Founder Attribution', body.includes('Founder — ADYK Multi Venture Company')],
        ['Direct Phone', body.includes('8870605699')],
        ['Direct Email', body.includes('adykcompany.in@gmail.com')],
        ['Section 08 Final CTA', body.includes('READY TO TEST YOUR IDEA?')],
        ['Start Validating CTA', body.includes('START VALIDATING')],
      ];

      checks.forEach(([label, pass]) => {
        console.log(`[${pass ? 'PASS' : 'WAITING'}] ${label}`);
      });

      // Exclusion check: Dineshraj must NOT be in Built By
      const builtByIdx = body.indexOf('id="built-by"');
      const contactIdx = body.indexOf('id="contact"');
      if (builtByIdx !== -1 && contactIdx !== -1) {
        const builtBySection = body.substring(builtByIdx, contactIdx);
        const dineshrajInBuiltBy = builtBySection.includes('Dineshraj');
        console.log(`[${!dineshrajInBuiltBy ? 'PASS' : 'FAIL'}] Dineshraj Excluded from Built By: ${!dineshrajInBuiltBy}`);
      }
    });
  }).on('error', (err) => console.error('Error fetching Vercel:', err));
}

checkLiveDeployment();
