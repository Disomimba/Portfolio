module.exports = async (req, res) => {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // Grab the hidden key from Vercel's environment variables
  const ACCESS_KEY = process.env.WEB3FORMS_KEY;

  if (!ACCESS_KEY) {
    return res.status(500).json({ success: false, message: 'Missing WEB3FORMS_KEY environment variable.' });
  }

  // Combine the access key with the incoming form data
  const payload = {
    access_key: ACCESS_KEY,
    ...req.body
  };

  try {
    // Send data securely to Web3Forms
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (response.ok) {
      return res.status(200).json({ success: true, result });
    } else {
      return res.status(response.status).json({ success: false, result });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error processing contact form.' });
  }
};
