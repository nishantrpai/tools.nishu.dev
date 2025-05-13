import dns from 'dns';
import net from 'net';

// List of valid TLDs - this is a simplified list, you might want to use a more complete one
const validTLDs = new Set([
  'com', 'org', 'net', 'edu', 'gov', 'mil', 'io', 'co', 'ai', 'app',
  'dev', 'xyz', 'info', 'biz', 'me', 'tv', 'uk', 'de', 'fr', 'jp', 'cn', 'au'
]);

// Check basic email format
function isValidEmailFormat(email) {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email);
}

// Check if domain TLD is valid
function isValidTLD(domain) {
  const tld = domain.split('.').pop().toLowerCase();
  return validTLDs.has(tld);
}

// Check MX records
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

// Check SMTP connection and email existence
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

    socket.setTimeout(10000); // 10 second timeout
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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    // Step 1: Check email format
    if (!isValidEmailFormat(email)) {
      return res.status(200).json({
        isValid: false,
        reason: 'Invalid email format'
      });
    }

    // Step 2: Check domain TLD
    const [, domain] = email.split('@');
    if (!isValidTLD(domain)) {
      return res.status(200).json({
        isValid: false,
        reason: 'Invalid domain TLD'
      });
    }

    // Step 3: Check MX records
    const mxResult = await checkMXRecord(domain);
    if (!mxResult.valid) {
      return res.status(200).json({
        isValid: false,
        reason: mxResult.reason
      });
    }

    // Step 4: Check SMTP connection
    const smtpResult = await checkSMTP(domain, mxResult.mxRecords, email);
    if (!smtpResult.valid) {
      return res.status(200).json({
        isValid: false,
        reason: smtpResult.reason
      });
    }

    // All checks passed
    return res.status(200).json({
      isValid: true,
      reason: 'Email is valid'
    });

  } catch (error) {
    console.error('Error verifying email:', error);
    return res.status(500).json({
      error: 'Error verifying email',
      details: error.message
    });
  }
}