import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  try {
    // Get colors from query parameters
    const { searchParams } = new URL(req.url);
    const colors = searchParams.get('colors')?.split(',') || ['FF0000', '00FF00', '0000FF'];
    
    // Validate colors and ensure they're proper hex
    const validColors = colors.map(color => `#${color.replace('#', '')}`);

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fff',
            fontSize: 32,
            fontWeight: 600,
          }}
        >
          <div style={{ marginBottom: '20px' }}>Color Blender</div>
          <div
            style={{
              display: 'flex',
              backgroundColor: '#f0f0f0',
              padding: '20px',
              borderRadius: '10px',
            }}
          >
            {validColors.map((color, index) => (
              <div
                key={index}
                style={{ 
                  width: '50px', 
                  height: '50px', 
                  backgroundColor: color,
                  marginRight: index < validColors.length - 1 ? '10px' : '0',
                  borderRadius: '5px'
                }}
              />
            ))}
          </div>
          <div style={{ fontSize: 24, marginTop: '20px' }}>
            Blend colors to create new ones
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (e) {
    console.error(e);
    return new Response('Failed to generate image', { status: 500 });
  }
}
