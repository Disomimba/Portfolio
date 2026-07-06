module.exports = async (req, res) => {
  try {
    // 1. Check if it's a POST request
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method Not Allowed' });
    }

    // 2. Check for the Vercel Environment Variable
    const ACCESS_KEY = process.env.WEB3FORMS_KEY;
    if (!ACCESS_KEY) {
      return res.status(500).json({ error: 'No API Key found in Vercel Environment Variables.' });
    }

    // 3. Safely handle the incoming data
    let bodyData = req.body;
    if (typeof req.body === 'string') {
      bodyData = JSON.parse(req.body);
    }

    // Combine your secret key with the form data
    const payload = {
      access_key: ACCESS_KEY,
      ...bodyData
    };

    // 4. Send to Web3Forms
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    return res.status(response.status).json(data);

  } catch (error) {
    // 5. THE DIAGNOSTIC CATCH: This will print the EXACT reason it crashed!
    return res.status(500).json({
      success: false,
      message: 'The server crashed!',
      real_error_details: error.message || error.toString()
    });
  }
};