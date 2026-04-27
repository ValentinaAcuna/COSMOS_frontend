import React from 'react'

export default function CosmosLogo({ size = 1, color = '#ffffff' }) {
  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', userSelect: 'none' }}>
      <svg
        width={36 * size}
        height={32 * size}
        viewBox="0 0 40 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: 'absolute',
          left: -13 * size,
          bottom: -1 * size,
          zIndex: 0,
          opacity: 0.60,
        }}
      >
        <polygon
          points="20,0 25,13 40,13 28,21 32,35 20,27 8,35 12,21 0,13 15,13"
          fill="#ffe328"
          transform="rotate(-12, 20, 18)"
        />
      </svg>
      <span style={{
        position: 'relative',
        zIndex: 1,
        fontFamily: "'Irish Grover', cursive",
        fontWeight: 900,
        fontSize: 22 * size,
        color,
        letterSpacing: 2,
        textTransform: 'uppercase',
      }}>
        COSMOS
      </span>
    </div>
  )
}
