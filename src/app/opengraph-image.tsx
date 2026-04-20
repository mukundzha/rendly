import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Rendly - Create stunning demo videos with code';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
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
          backgroundColor: '#000000',
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(249, 115, 22, 0.15) 0%, transparent 50%)',
          }}
        />
        
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 120,
            height: 120,
            backgroundColor: '#f97316',
            borderRadius: 28,
            marginBottom: 40,
            boxShadow: '0 20px 60px rgba(249, 115, 22, 0.4)',
          }}
        >
          <span
            style={{
              fontSize: 56,
              fontWeight: 700,
              color: '#ffffff',
              fontFamily: 'system-ui',
            }}
          >
            R
          </span>
        </div>

        <div
          style={{
            fontSize: 80,
            fontWeight: 700,
            color: '#ffffff',
            fontFamily: 'system-ui',
            letterSpacing: '-0.04em',
            marginBottom: 16,
          }}
        >
          Rendly
        </div>

        <div
          style={{
            fontSize: 28,
            color: '#a1a1a1',
            fontFamily: 'system-ui',
            letterSpacing: '-0.02em',
          }}
        >
          Create stunning demo videos with code
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: 48,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '12px 24px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: 9999,
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 6,
              backgroundColor: '#f97316',
            }}
          />
          <span
            style={{
              fontSize: 18,
              color: '#ffffff',
              fontFamily: 'monospace',
            }}
          >
            Text "Hello" → Video
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}