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
  console.log('WIQN PAGE & ROUTE LAUNCH VERIFICATION SUITE');
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

  // 1. Homepage Verification
  console.log('--- 1. Testing Homepage (/) ---');
  const home = await fetchPage('/');
  assert(home.status === 200, 'Homepage returns HTTP 200 OK');
  assert(home.body.includes('Test Ideas. Discover Truth. Build Smarter.'), 'Hero headline present');
  assert(home.body.includes('AI-POWERED PRODUCT VALIDATION'), 'Hero eyebrow badge present');
  assert(home.body.includes('Start Validating'), 'Start Validating CTA present');
  assert(home.body.includes('/about'), 'Header contains link to /about');
  assert(home.body.includes('/contact'), 'Header contains link to /contact');
  assert(home.body.includes('REJIESH ASHWANTH'), 'Footer contains founder name');
  assert(home.body.includes('ADYK Multi Venture Company'), 'Footer contains company attribution');
  assert(home.body.includes('https://www.linkedin.com/in/rejiesh-ashwanth-v-33ab1b37b'), 'Footer contains LinkedIn link');
  assert(home.body.includes('https://www.instagram.com/buildby.adyk'), 'Footer contains Instagram link');

  // 2. About Page Verification
  console.log('\n--- 2. Testing About Page (/about) ---');
  const about = await fetchPage('/about');
  assert(about.status === 200, 'About page returns HTTP 200 OK');
  assert(about.body.includes('About WIQN'), 'About page title present');
  assert(about.body.includes('From Idea to Evidence.'), 'About subheading present');
  assert(about.body.includes('Build Less on Assumptions.'), 'Philosophy section present');
  assert(about.body.includes('Everything You Need to Validate an Idea.'), 'Feature grid present');
  assert(about.body.includes('Why WIQN?'), 'Advantages section present');
  assert(about.body.includes('Where WIQN Fits'), 'Positioning matrix present');
  assert(about.body.includes('One Loop. From Idea to Decision.'), 'One Loop pipeline present');
  assert(about.body.includes('Built for People Who Build.'), 'Audience section present');
  assert(about.body.includes('WIQN Is Not Another Website Builder.'), 'Product boundaries block present');
  assert(about.body.includes('REJIESH ASHWANTH'), 'Founder Rejiesh Ashwanth present');
  assert(about.body.includes('CEO &amp; Co-Founder') || about.body.includes('CEO & Co-Founder'), 'CEO & Co-Founder title present');
  assert(about.body.includes('ADYK Multi Venture Company'), 'ADYK Multi Venture Company attribution present');
  assert(about.body.includes('Launch by'), 'Launch attribution present');
  assert(about.body.includes('https://www.linkedin.com/in/rejiesh-ashwanth-v-33ab1b37b'), 'LinkedIn link verified on /about');
  assert(about.body.includes('https://www.instagram.com/buildby.adyk'), 'Instagram link verified on /about');

  // 3. Contact Page Verification
  console.log('\n--- 3. Testing Contact Page (/contact) ---');
  const contact = await fetchPage('/contact');
  assert(contact.status === 200, 'Contact page returns HTTP 200 OK');
  assert(contact.body.includes("Let&#x27;s Talk.") || contact.body.includes("Let's Talk."), 'Contact hero present');
  assert(contact.body.includes('8870605699'), 'Phone number present');
  assert(contact.body.includes('tel:8870605699'), 'Interactive tel: link present');
  assert(contact.body.includes('adykcompany.in@gmail.com'), 'Email address present');
  assert(contact.body.includes('mailto:adykcompany.in@gmail.com'), 'Interactive mailto: link present');
  assert(contact.body.includes('https://www.linkedin.com/in/rejiesh-ashwanth-v-33ab1b37b'), 'Interactive LinkedIn link present');
  assert(contact.body.includes('https://www.instagram.com/buildby.adyk'), 'Interactive Instagram link present');
  assert(contact.body.includes('Rejiesh Ashwanth'), 'Founder name verified on /contact');
  assert(contact.body.includes('ADYK Multi Venture Company'), 'Company verified on /contact');

  // 4. Sitemap Verification
  console.log('\n--- 4. Testing Sitemap (/sitemap.xml) ---');
  const sitemap = await fetchPage('/sitemap.xml');
  assert(sitemap.status === 200, 'Sitemap returns HTTP 200 OK');
  assert(sitemap.body.includes('/about'), 'Sitemap contains /about');
  assert(sitemap.body.includes('/contact'), 'Sitemap contains /contact');

  // 5. Existing Routes Verification
  console.log('\n--- 5. Testing Existing Critical Routes ---');
  const login = await fetchPage('/login');
  assert(login.status === 200, '/login returns HTTP 200 OK');

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
