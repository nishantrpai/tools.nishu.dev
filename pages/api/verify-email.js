import dns from 'dns';
import net from 'net';

// List of valid TLDs
const validTLDs = new Set([
  'com', 'org', 'net', 'edu', 'gov', 'mil', 'io', 'co', 'ai', 'app',
  'dev', 'xyz', 'info', 'biz', 'me', 'tv', 'uk', 'de', 'fr', 'jp', 'cn', 'au'
]);

// Email pattern generator
function generateEmailPatterns(firstName, lastName, companyDomain) {
  const patterns = [
    `${firstName.toLowerCase()}@${companyDomain}`,
    `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${companyDomain}`,
    `${firstName.toLowerCase()[0]}${lastName.toLowerCase()}@${companyDomain}`,
    `${lastName.toLowerCase()}${firstName.toLowerCase()[0]}@${companyDomain}`,
    `${firstName.toLowerCase()}_${lastName.toLowerCase()}@${companyDomain}`,
    `${firstName.toLowerCase()}-${lastName.toLowerCase()}@${companyDomain}`,
    `${lastName.toLowerCase()}.${firstName.toLowerCase()}@${companyDomain}`,
    `${lastName.toLowerCase()}@${companyDomain}`,
  ];
  return patterns;
}

// Email verification functions remain the same
function isValidEmailFormat(email) {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email);
}

function isValidTLD(domain) {
  const tld = domain.split('.').pop().toLowerCase();
  return validTLDs.has(tld);
}

function checkMXRecord(domain) {
  return new Promise((resolve) => {
    dns.resolveMx(domain, (err, addresses) => {
      if (err || !addresses || addresses.length === 0) {
        resolve({ valid: false, reason: 'No MX records found' });
      } else {
        resolve({ valid: true, mxRecords: addresses });
      }
    });
  });
}

async function checkSMTP(domain, mxRecords, email) {
  return new Promise((resolve) => {
    const socket = net.createConnection(25, mxRecords[0].exchange);
    let resolved = false;
    let responseBuffer = '';
    let step = 0;

    const cleanup = () => {
      if (!resolved) {
        resolved = true;
        socket.destroy();
        resolve({ valid: false, reason: 'SMTP connection failed' });
      }
    };

    socket.setTimeout(10000);
    socket.on('timeout', cleanup);
    socket.on('error', cleanup);

    socket.on('data', (data) => {
      responseBuffer += data.toString();
      if (responseBuffer.includes('\r\n')) {
        const response = responseBuffer.split('\r\n')[0];
        responseBuffer = '';

        if (step === 0 && response.startsWith('2')) {
          socket.write(`HELO ${domain}\r\n`);
          step = 1;
        } else if (step === 1 && response.startsWith('2')) {
          socket.write(`MAIL FROM:<verify@${domain}>\r\n`);
          step = 2;
        } else if (step === 2 && response.startsWith('2')) {
          socket.write(`RCPT TO:<${email}>\r\n`);
          step = 3;
        } else if (step === 3) {
          resolved = true;
          socket.destroy();
          resolve({
            valid: response.startsWith('2'),
            reason: response.startsWith('2') ? 'Valid email' : 'Invalid recipient'
          });
        } else if (!response.startsWith('2')) {
          cleanup();
        }
      }
    });

    socket.on('connect', () => {
      // Wait for server greeting
    });
  });
}

// Modified handler for the new use case
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { firstName, lastName, company } = req.body;
  if (!firstName || !lastName || !company) {
    return res.status(400).json({ error: 'First name, last name, and company are required' });
  }

  try {
    // Clean company name to get domain
    let companyDomain = company.toLowerCase();
    // If company doesn't have a domain extension, assume .com
    if (!companyDomain.includes('.')) {
      companyDomain += '.com';
    }

    // Check if domain is valid
    if (!isValidTLD(companyDomain)) {
      return res.status(200).json({
        isValid: false,
        reason: 'Invalid company domain TLD'
      });
    }

    // Step 3: Check MX records
    const mxResult = await checkMXRecord(companyDomain);
    if (!mxResult.valid) {
      return res.status(200).json({
        isValid: false,
        reason: mxResult.reason
      });
    }

    // Generate email patterns and check each one
    const emailPatterns = generateEmailPatterns(firstName, lastName, companyDomain);
    const results = [];

    for (const emailPattern of emailPatterns) {
      if (!isValidEmailFormat(emailPattern)) {
        continue;
      }

      // Check SMTP connection
      const smtpResult = await checkSMTP(companyDomain, mxResult.mxRecords, emailPattern);
      if (smtpResult.valid) {
        results.push({
          email: emailPattern,
          isValid: true
        });
      }
    }

    return res.status(200).json({
      validEmails: results,
      firstName,
      lastName,
      company: companyDomain
    });

  } catch (error) {
    console.error('Error verifying emails:', error);
    return res.status(500).json({
      error: 'Error verifying emails',
      details: error.message
    });
  }
}