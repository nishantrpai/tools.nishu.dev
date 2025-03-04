import { createCanvas } from 'canvas';

export default async function handler(req, res) {
  // Get color and method from query parameters
  const { color = 'FF0000', method = 'average' } = req.query;
  
  // Validate color is hexadecimal
  if (!/^[0-9A-F]{6}$/i.test(color)) {
    res.status(400).json({ error: 'Invalid color format' });
    return;
  }
  
  // Create canvas (1200x630 is recommended for frames)
  const width = 1200;
  const height = 630;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  // Draw background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, width, height);
  
  // Draw main blended color
  ctx.fillStyle = `#${color}`;
  ctx.fillRect(width * 0.1, height * 0.1, width * 0.8, height * 0.5);
  
  // Add text for blend method and color code
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 40px Arial';
  ctx.fillText(`Color Blender - ${method.toUpperCase()}`, width * 0.1, height * 0.75);
  
  ctx.font = '36px Arial';
  ctx.fillText(`#${color.toUpperCase()}`, width * 0.1, height * 0.85);
  
  // Add instructional text
  ctx.font = '24px Arial';
  ctx.fillText('Tap to blend colors and create NFTs', width * 0.1, height * 0.92);
  
  // Convert canvas to buffer and send as PNG
  const buffer = canvas.toBuffer('image/png');
  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Cache-Control', 'public, max-age=60'); // Cache for 1 minute
  res.status(200).send(buffer);
}
