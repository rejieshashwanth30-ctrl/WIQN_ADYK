const https = require('https');

function checkLiveDeployment() {
  https.get('https://adykwiqn.vercel.app/', (res) => {
    let body = '';
    res.on('data', (c) => (body += c));
    res.on('end', () => {
      console.log('HTTP Status:', res.statusCode);
      console.log('Has Built by:', body.includes('Built by'));
      console.log('Has REJIESH ASHWANTH V:', body.includes('REJIESH ASHWANTH V'));
      
      const companySection = body.split('id="company"')[1]?.split('</section>')[0] || '';
      const dineshrajInBuiltBy = companySection.includes('Dineshraj') || companySection.includes('DINESHRAJ');
      console.log('Dineshraj in Built By (#company):', dineshrajInBuiltBy ? 'YES (UNEXPECTED)' : 'NO (CORRECT - EXCLUDED)');

      const contactSection = body.split('id="contact"')[1]?.split('</section>')[0] || '';
      const dineshrajInContact = contactSection.includes('Dineshraj S');
      const rejieshInContact = contactSection.includes('Rejiesh Ashwanth V');
      console.log('Dineshraj in Contact (#contact):', dineshrajInContact ? 'YES (CORRECT)' : 'NOT YET (WAIT FOR DEPLOY)');
      console.log('Rejiesh in Contact (#contact):', rejieshInContact ? 'YES (CORRECT)' : 'NOT YET (WAIT FOR DEPLOY)');
      console.log('Has Phone 8870605699:', contactSection.includes('8870605699'));
      console.log('Has Email adykcompany.in@gmail.com:', contactSection.includes('adykcompany.in@gmail.com'));
      console.log('Has Instagram:', contactSection.includes('https://www.instagram.com/buildby.adyk'));
    });
  }).on('error', (err) => console.error('Error fetching Vercel:', err));
}

checkLiveDeployment();
