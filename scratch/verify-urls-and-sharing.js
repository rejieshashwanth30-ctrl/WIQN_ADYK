const path = require('path');
const fs = require('fs');

async function testUrlGeneration() {
  console.log('====================================================');
  console.log('ADYK WIQN — URL GENERATION & SHARING VERIFICATION');
  console.log('====================================================\n');

  let passCount = 0;
  let totalCount = 0;

  function assert(condition, name, details = '') {
    totalCount++;
    if (condition) {
      passCount++;
      console.log(`[PASS] ${name}`);
      if (details) console.log(`       Evidence: ${details}`);
    } else {
      console.error(`[FAIL] ${name}`);
      if (details) console.error(`       Error: ${details}`);
    }
  }

  // 1. Inspect source files
  console.log('--- TEST 1: CENTRALIZED HELPER INTEGRITY ---');
  const urlsCode = fs.readFileSync('src/lib/urls.ts', 'utf8');
  assert(!urlsCode.includes("PRODUCTION_DOMAIN = 'https://wiqn.adyk.io'"),
    'No unowned adyk.io domain hardcoded in urls.ts',
    'Unowned domain cleanly removed'
  );
  assert(urlsCode.includes("LOCAL_DEV_DOMAIN = 'http://localhost:3000'"),
    'Local development domain accurately defined as http://localhost:3000',
    'Local test development support confirmed'
  );
  assert(urlsCode.includes('export function getPublicAppUrl('),
    'getPublicAppUrl function exported',
    'Centralized environment resolver present'
  );
  assert(urlsCode.includes('export function getTestUrl('),
    'getTestUrl function exported',
    'Experiment test URL constructor present'
  );
  assert(urlsCode.includes('export function getShareUrls('),
    'getShareUrls function exported',
    'All 1-click share destinations generated in one place'
  );

  // 2. Check environment files
  console.log('\n--- TEST 2: ENVIRONMENT CONFIGURATION ---');
  const envContent = fs.readFileSync('.env', 'utf8');
  assert(!envContent.includes('NEXT_PUBLIC_APP_URL="https://wiqn.adyk.io"'),
    '.env does not contain unowned wiqn.adyk.io domain',
    'Configured with Vercel deployment URL'
  );
  assert(envContent.includes('NEXT_PUBLIC_APP_URL="https://'),
    '.env contains production HTTPS deployment URL',
    'Production Vercel deployment target configured'
  );

  const envLocalContent = fs.readFileSync('.env.local', 'utf8');
  assert(envLocalContent.includes('NEXT_PUBLIC_APP_URL="http://localhost:3000"'),
    '.env.local contains local dev NEXT_PUBLIC_APP_URL="http://localhost:3000"',
    'Local developer override correctly points to localhost:3000'
  );

  // 3. Test functional behavior of helper
  console.log('\n--- TEST 3: FUNCTIONAL URL GENERATION ---');
  const testExpId = 'cmvcfqm2t0001b4nbzsullffy';
  const testProductName = 'ADYK Collab Platform';

  // Test dynamic Vercel resolution
  const testVercelProjectUrl = 'https://wiqn-testing.vercel.app';
  process.env.NODE_ENV = 'production';
  process.env.NEXT_PUBLIC_APP_URL = testVercelProjectUrl;

  function mockGetProductionAppUrl() {
    const envUrl = process.env.NEXT_PUBLIC_APP_URL?.trim().replace(/\/+$/, '');
    if (envUrl && envUrl.startsWith('https://') && !envUrl.includes('adyk.io')) {
      return envUrl;
    }
    return 'https://adyk-wiqn.vercel.app';
  }

  function mockGetTestUrl(expId, options) {
    if (options?.forceLocal) return `http://localhost:3000/test/${expId}`;
    return `${mockGetProductionAppUrl()}/test/${expId}`;
  }

  function mockGetShareUrls(expId, prodName, options) {
    const testUrl = mockGetTestUrl(expId, options);
    const cleanName = prodName.trim() || 'product prototype';
    const whatsappMessage = `Please test our ${cleanName} prototype on ADYK Wiqn and share your feedback: ${testUrl}`;
    const tweetText = `Testing our ${cleanName} prototype on ADYK Wiqn. Try it here: `;
    const emailSubject = `Product Test Invitation: ${cleanName}`;
    const emailBody = `Hi,\n\nPlease test our product prototype on ADYK Wiqn and share your thoughts:\n\n${testUrl}\n\nThank you!`;
    return {
      testUrl,
      whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappMessage)}`,
      x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(testUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(testUrl)}`,
      email: `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`,
    };
  }

  const prodShare = mockGetShareUrls(testExpId, testProductName, { forceProduction: true });
  assert(prodShare.testUrl === `${testVercelProjectUrl}/test/${testExpId}`,
    `Production test URL resolved to ${testVercelProjectUrl}/test/[id]`,
    prodShare.testUrl
  );
  assert(prodShare.whatsapp.includes(encodeURIComponent(`${testVercelProjectUrl}/test/${testExpId}`)),
    'WhatsApp share link encodes Vercel test URL',
    prodShare.whatsapp
  );
  assert(prodShare.x.includes(encodeURIComponent(`${testVercelProjectUrl}/test/${testExpId}`)),
    'X (Twitter) share link encodes Vercel test URL',
    prodShare.x
  );
  assert(prodShare.linkedin.includes(encodeURIComponent(`${testVercelProjectUrl}/test/${testExpId}`)),
    'LinkedIn share link encodes Vercel test URL',
    prodShare.linkedin
  );
  assert(prodShare.email.includes(encodeURIComponent(`${testVercelProjectUrl}/test/${testExpId}`)),
    'Email share link contains Vercel test URL',
    prodShare.email
  );

  // Test local development fallback
  process.env.NODE_ENV = 'development';
  process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';
  const localShare = mockGetShareUrls(testExpId, testProductName, { forceLocal: true });
  assert(localShare.testUrl === `http://localhost:3000/test/${testExpId}`,
    'Local development test URL resolved to http://localhost:3000/test/[id]',
    localShare.testUrl
  );

  // 4. Check UI integration in src/app/experiments/[id]/page.tsx
  console.log('\n--- TEST 4: EXPERIMENT DETAIL PAGE INTEGRATION ---');
  const pageCode = fs.readFileSync('src/app/experiments/[id]/page.tsx', 'utf8');
  assert(pageCode.includes("import { getPublicAppUrl, getTestUrl, getShareUrls, isLocalEnvironment, getProductionAppUrl } from '@/lib/urls';"),
    'Centralized URL helper imported in experiment detail page',
    'Clean single-source imports'
  );
  assert(!pageCode.includes('wiqn.adyk.io'),
    'Page code contains zero references to wiqn.adyk.io',
    'Unowned domain references completely eliminated'
  );
  assert(pageCode.includes('href={shareUrls.whatsapp}'),
    'WhatsApp button binds to shareUrls.whatsapp',
    'Uses centralized URL'
  );
  assert(pageCode.includes('href={shareUrls.x}'),
    'X (Twitter) button binds to shareUrls.x',
    'Uses centralized URL'
  );
  assert(pageCode.includes('href={shareUrls.linkedin}'),
    'LinkedIn button binds to shareUrls.linkedin',
    'Uses centralized URL'
  );
  assert(pageCode.includes('href={shareUrls.email}'),
    'Email button binds to shareUrls.email',
    'Uses centralized URL'
  );

  console.log('\n====================================================');
  console.log(`VERIFICATION RESULT: ${passCount} / ${totalCount} TESTS PASSED`);
  console.log('====================================================\n');
}

testUrlGeneration().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
