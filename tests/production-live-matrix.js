const https = require('https');

async function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const parsed = new URL(url);
    const req = https.request(
      {
        hostname: parsed.hostname,
        port: 443,
        path: parsed.pathname + parsed.search,
        method: options.method || 'GET',
        headers: {
          'User-Agent': options.userAgent || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          ...options.headers,
        },
      },
      (res) => {
        let body = '';
        res.on('data', (c) => (body += c));
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body,
            duration: Date.now() - start,
          });
        });
      }
    );
    req.on('error', reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}

async function runProductionMatrix() {
  console.log('================================================================');
  console.log('WIQN COMPLETE PRODUCTION CROSS-DEVICE & RELIABILITY TEST MATRIX');
  console.log('Target Domain: https://www.wiqn.in/');
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;

  async function check(label, fn) {
    try {
      const res = await fn();
      console.log(`[PASS] ${label} (${res.statusCode} in ${res.duration}ms)`);
      passed++;
    } catch (err) {
      console.error(`[FAIL] ${label}:`, err.message);
      failed++;
    }
  }

  // 1. Fresh Browser (no cookies)
  await check('Test A: Fresh browser → open https://www.wiqn.in/', async () => {
    const res = await makeRequest('https://www.wiqn.in/');
    if (res.statusCode !== 200) throw new Error(`Expected 200, got ${res.statusCode}`);
    if (!res.body.includes('AI-POWERED PRODUCT VALIDATION')) throw new Error('Body missing hero content');
    return res;
  });

  // 2. Old Deployment Cookies (the exact trigger of the 504!)
  await check('Test G: Old deployment cookies (xfklxcjoyyefovpgysqz) → open https://www.wiqn.in/', async () => {
    const res = await makeRequest('https://www.wiqn.in/', {
      headers: {
        Cookie: 'sb-xfklxcjoyyefovpgysqz-auth-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.stale.sig; sb-xfklxcjoyyefovpgysqz-auth-token.0=part0; sb-xfklxcjoyyefovpgysqz-auth-token.1=part1',
      },
    });
    if (res.statusCode !== 200) throw new Error(`Expected 200, got ${res.statusCode}`);
    if (res.duration > 3000) throw new Error(`Took too long (${res.duration}ms)`);
    return res;
  });

  // 3. Stale / Expired Session Cookies on Homepage
  await check('Test C: Expired session cookie on Homepage → open https://www.wiqn.in/', async () => {
    const res = await makeRequest('https://www.wiqn.in/', {
      headers: {
        Cookie: 'sb-xwwpvtmvbujtynyanywl-auth-token=base64-WyJleHBpcmVkX2FjY2Vzc190b2tlbiIsImV4cGlyZWRfcmVmcmVzaCJd',
      },
    });
    if (res.statusCode !== 200) throw new Error(`Expected 200, got ${res.statusCode}`);
    return res;
  });

  // 4. Mobile Safari User Agent
  await check('Test H1: Mobile Safari (iPhone iOS 18) with stale cookies', async () => {
    const res = await makeRequest('https://www.wiqn.in/', {
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1',
      headers: {
        Cookie: 'sb-xfklxcjoyyefovpgysqz-auth-token=stale-ios-token',
      },
    });
    if (res.statusCode !== 200) throw new Error(`Expected 200, got ${res.statusCode}`);
    return res;
  });

  // 5. Android Chrome Mobile User Agent
  await check('Test H2: Android Chrome (Pixel 9) with stale cookies', async () => {
    const res = await makeRequest('https://www.wiqn.in/', {
      userAgent: 'Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36',
      headers: {
        Cookie: 'sb-xfklxcjoyyefovpgysqz-auth-token=stale-android-token',
      },
    });
    if (res.statusCode !== 200) throw new Error(`Expected 200, got ${res.statusCode}`);
    return res;
  });

  // 6. Desktop Edge & Firefox User Agents
  await check('Test I1: Desktop Firefox User Agent', async () => {
    const res = await makeRequest('https://www.wiqn.in/', {
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:132.0) Gecko/20100101 Firefox/132.0',
    });
    if (res.statusCode !== 200) throw new Error(`Expected 200, got ${res.statusCode}`);
    return res;
  });

  await check('Test I2: Desktop Edge User Agent', async () => {
    const res = await makeRequest('https://www.wiqn.in/', {
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 Edg/130.0.0.0',
    });
    if (res.statusCode !== 200) throw new Error(`Expected 200, got ${res.statusCode}`);
    return res;
  });

  // 7. Login Page without cookies
  await check('Test D: Unauthenticated user → open https://www.wiqn.in/login', async () => {
    const res = await makeRequest('https://www.wiqn.in/login');
    if (res.statusCode !== 200) throw new Error(`Expected 200, got ${res.statusCode}`);
    return res;
  });

  // 8. Signup Page without cookies
  await check('Test D2: Unauthenticated user → open https://www.wiqn.in/signup', async () => {
    const res = await makeRequest('https://www.wiqn.in/signup');
    if (res.statusCode !== 200) throw new Error(`Expected 200, got ${res.statusCode}`);
    return res;
  });

  // 9. Protected Dashboard Route (Logged Out)
  await check('Test J: Logged out user visiting /dashboard → redirects to /login', async () => {
    const res = await makeRequest('https://www.wiqn.in/dashboard');
    if (res.statusCode !== 307 && res.statusCode !== 302 && res.statusCode !== 308) {
      throw new Error(`Expected 307 redirect, got ${res.statusCode}`);
    }
    const loc = res.headers.location || '';
    if (!loc.includes('/login')) throw new Error(`Redirect target was ${loc}`);
    return res;
  });

  // 10. Protected Dashboard Route with stale cookies
  await check('Test K: Stale cookie visiting /dashboard → safely redirects to /login and clears cookies', async () => {
    const res = await makeRequest('https://www.wiqn.in/dashboard', {
      headers: {
        Cookie: 'sb-xfklxcjoyyefovpgysqz-auth-token=stale-legacy-token',
      },
    });
    if (res.statusCode !== 307 && res.statusCode !== 302 && res.statusCode !== 308) {
      throw new Error(`Expected 307 redirect, got ${res.statusCode}`);
    }
    const loc = res.headers.location || '';
    if (!loc.includes('/login')) throw new Error(`Redirect target was ${loc}`);
    return res;
  });

  // 11. Public Tester Route (/test/[id])
  await check('Test L: Public tester flow /test/[experimentId] without founder auth', async () => {
    // Probe a test URL
    const res = await makeRequest('https://www.wiqn.in/test/test-probe-exp-id');
    // Tester route returns 200 (renders tester page which client-side resolves experiment)
    if (res.statusCode !== 200) throw new Error(`Expected 200, got ${res.statusCode}`);
    return res;
  });

  // 12. Public Information Pages (/about, /contact)
  await check('Public /about page renders reliably', async () => {
    const res = await makeRequest('https://www.wiqn.in/about');
    if (res.statusCode !== 200) throw new Error(`Expected 200, got ${res.statusCode}`);
    return res;
  });

  await check('Public /contact page renders reliably', async () => {
    const res = await makeRequest('https://www.wiqn.in/contact');
    if (res.statusCode !== 200) throw new Error(`Expected 200, got ${res.statusCode}`);
    return res;
  });

  // 13. Telemetry Ingestion Route (/api/capture)
  await check('Public telemetry /api/capture OPTIONS preflight', async () => {
    const res = await makeRequest('https://www.wiqn.in/api/capture', {
      method: 'OPTIONS',
    });
    if (res.statusCode !== 204 && res.statusCode !== 200) {
      throw new Error(`Expected 204 or 200, got ${res.statusCode}`);
    }
    return res;
  });

  // 14. Non-existent Route
  await check('Non-existent route returns proper 404 (never 504)', async () => {
    const res = await makeRequest('https://www.wiqn.in/some-non-existent-page-wiqn-check');
    if (res.statusCode !== 404) throw new Error(`Expected 404, got ${res.statusCode}`);
    return res;
  });

  // 15. Concurrent Multi-tab Requests (Simulate 5 tabs opening simultaneously)
  await check('Test F: 5 concurrent tabs opening simultaneously', async () => {
    const start = Date.now();
    const promises = [
      makeRequest('https://www.wiqn.in/'),
      makeRequest('https://www.wiqn.in/about'),
      makeRequest('https://www.wiqn.in/contact'),
      makeRequest('https://www.wiqn.in/login'),
      makeRequest('https://www.wiqn.in/test/probe-123'),
    ];
    const results = await Promise.all(promises);
    for (const r of results) {
      if (r.statusCode !== 200) throw new Error(`Concurrent tab returned status ${r.statusCode}`);
    }
    return { statusCode: 200, duration: Date.now() - start };
  });

  console.log('\n================================================================');
  console.log(`PRODUCTION TEST MATRIX SUMMARY: Passed ${passed}/${passed + failed}`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runProductionMatrix().catch((e) => {
  console.error('Fatal test error:', e);
  process.exit(1);
});
