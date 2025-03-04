export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Extract frame data from the request
    const { untrustedData, trustedData } = req.body;
    
    // Get colors from the URL if they exist
    const url = new URL(untrustedData?.inputText || 'https://tools.nishu.dev/addcolors');
    const colors = url.searchParams.get('colors');
    
    // Generate response frame
    const frame = {
      version: 'vNext',
      image: {
        src: `https://tools.nishu.dev/api/og/addcolors${colors ? `?colors=${colors}` : ''}`,
        aspectRatio: '1.91:1'
      },
      buttons: [
        {
          label: "Start Blending",
          action: "link",
          target: `https://tools.nishu.dev/addcolors${colors ? `?colors=${colors}` : ''}`
        }
      ]
    };

    return res.status(200).json(frame);
  } catch (error) {
    console.error('Frame error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
