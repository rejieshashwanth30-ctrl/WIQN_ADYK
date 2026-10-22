const http = require('http');

function fetchPage(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:3005${path}`, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        resolve({ status: res.statusCode, headers: res.headers, body: data });
      });
    }).on('error', reject);
  });
}

async function runTests() {
  console.log('====================================================');
  console.log('WIQN HOMEPAGE STORY & BRAND LAUNCH VERIFICATION SUITE');
  console.log('====================================================\n');

  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`[PASS] ${message}`);
      passed++;
    } else {
      console.error(`[FAIL] ${message}`);
    }
  }

  // 1. Unified Homepage Verification
  console.log('--- 1. Testing Unified Homepage Story (/) ---');
  const home = await fetchPage('/');
  assert(home.status === 200, 'Homepage returns HTTP 200 OK');
  assert(home.body.includes('Test Ideas. Discover Truth. Build Smarter.'), 'Hero headline present');
  assert(home.body.includes('AI-POWERED PRODUCT VALIDATION'), 'Hero eyebrow badge present');
  assert(home.body.includes('Start Validating'), 'Start Validating CTA present');

  // Navigation anchors
  assert(home.body.includes('#how-it-works'), 'Nav contains #how-it-works anchor');
  assert(home.body.includes('#about'), 'Nav contains #about anchor');
  assert(home.body.includes('#company'), 'Nav contains #company anchor');
  assert(home.body.includes('#contact'), 'Nav contains #contact anchor');

  // How WIQN Works section
  assert(home.body.includes('From Idea to Evidence.'), 'Section: From Idea to Evidence present');
  assert(home.body.includes('WIQN helps you test what people actually do, not just what they say.'), 'How it works tagline present');

  // Why WIQN section
  assert(home.body.includes("Don&#x27;t Just Build. Prove It.") || home.body.includes("Don't Just Build. Prove It."), 'Section: Don\'t Just Build. Prove It. present');

  // About WIQN section
  assert(home.body.includes('About WIQN'), 'Section: About WIQN present');
  assert(home.body.includes('Build Less on Assumptions.'), 'Philosophy: Build Less on Assumptions present');

  // Differentiation & Positioning
  assert(home.body.includes('What makes WIQN different?'), 'Section: What makes WIQN different present');
  assert(home.body.includes('WIQN is not a website builder, an IDE, or a generic analytics dashboard.'), 'Positioning statement present');
  assert(home.body.includes('Where WIQN Fits'), 'Comparison matrix: Where WIQN Fits present');
  assert(home.body.includes('Built for People Who Build.'), 'Audience matrix present');

  // Built By / Founders Section
  assert(home.body.includes('Built by'), 'Section: Built by present');
  assert(home.body.includes('REJIESH ASHWANTH'), 'Founder: REJIESH ASHWANTH present');
  assert(home.body.includes('CEO &amp; CO-FOUNDER') || home.body.includes('CEO & CO-FOUNDER'), 'Rejiesh role present');
  assert(home.body.includes('/brand/rejiesh-ashwanth.jpg'), 'Real uploaded photo of Rejiesh present');
  assert(home.body.includes('https://www.linkedin.com/in/rejiesh-ashwanth-v-33ab1b37b'), 'Rejiesh LinkedIn link present');

  assert(home.body.includes('DINESHRAJ S'), 'Founder: DINESHRAJ S present');
  assert(home.body.includes('FOUNDER'), 'Dineshraj role present');
  assert(home.body.includes('https://www.linkedin.com/in/dineshraj-s-758931390'), 'Dineshraj LinkedIn link present');
  assert(home.body.includes('Launched by ADYK Multi Venture Company') || home.body.includes('Launched by'), 'Launched by ADYK Multi Venture Company present');

  // Contact Section
  assert(home.body.includes("Let&#x27;s Talk.") || home.body.includes("Let's Talk."), 'Section: Let\'s Talk. present');
  assert(home.body.includes('8870605699'), 'Contact phone 8870605699 present');
  assert(home.body.includes('tel:8870605699'), 'Interactive tel: link present');
  assert(home.body.includes('adykcompany.in@gmail.com'), 'Contact email adykcompany.in@gmail.com present');
  assert(home.body.includes('mailto:adykcompany.in@gmail.com'), 'Interactive mailto: link present');
  assert(home.body.includes('https://www.instagram.com/buildby.adyk'), 'Clean Instagram link present');

  // Final CTA
  assert(home.body.includes('Ready to test your next idea?'), 'Final CTA: Ready to test your next idea? present');
  assert(home.body.includes("Don&#x27;t build on assumptions. Build with evidence.") || home.body.includes("Don't build on assumptions. Build with evidence."), 'Final CTA supporting text present');

  // Footer
  assert(home.body.includes('© 2026 ADYK Multi Venture Company. All rights reserved.'), 'Footer copyright present');

  // 2. Existing Routes Verification
  console.log('\n--- 2. Testing Existing Routes & Sitemaps ---');
  const about = await fetchPage('/about');
  assert(about.status === 200, 'Direct /about route returns HTTP 200 OK');

  const contact = await fetchPage('/contact');
  assert(contact.status === 200, 'Direct /contact route returns HTTP 200 OK');

  const login = await fetchPage('/login');
  assert(login.status === 200, 'Direct /login route returns HTTP 200 OK');

  const sitemap = await fetchPage('/sitemap.xml');
  assert(sitemap.status === 200, 'Sitemap returns HTTP 200 OK');

  console.log('\n====================================================');
  console.log(`PAGE VERIFICATION SUMMARY: ${passed}/${total} PASSED`);
  console.log('====================================================');

  if (passed === total) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runTests().catch((e) => {
  console.error('Test suite runner crashed:', e);
  process.exit(1);
});
