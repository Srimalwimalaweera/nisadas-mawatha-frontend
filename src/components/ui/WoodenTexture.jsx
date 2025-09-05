import React from 'react';

const WoodenTexture = () => {
  return (
    <div className='wooden-texture-background'>
      {/* Wood Panel Background */}
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="100%" 
        height="100%" 
        style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          zIndex: 1 
        }}
        viewBox="0 0 800 600"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Wood grain noise pattern */}
          <filter id="woodGrain" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence 
              type="fractalNoise" 
              baseFrequency="0.04 0.8" 
              numOctaves="4" 
              seed="7"
              result="noise"
            />
            <feColorMatrix 
              in="noise" 
              type="saturate" 
              values="0"
              result="desaturatedNoise"
            />
            <feComponentTransfer in="desaturatedNoise" result="grain">
              <feFuncA type="discrete" tableValues="0 .5 0 .7 0 .3 0 .8 0 .1"/>
            </feComponentTransfer>
          </filter>

          {/* Fine wood texture */}
          <filter id="fineTexture" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence 
              type="turbulence" 
              baseFrequency="0.9 0.1" 
              numOctaves="2" 
              seed="3"
              result="fineTurbulence"
            />
            <feColorMatrix 
              in="fineTurbulence" 
              type="saturate" 
              values="0"
              result="fineGrain"
            />
          </filter>

          {/* Wood panel gradients */}
          <linearGradient id="woodPanel1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#D2B48C" stopOpacity="1"/>
            <stop offset="10%" stopColor="#DEB887" stopOpacity="1"/>
            <stop offset="25%" stopColor="#CD853F" stopOpacity="1"/>
            <stop offset="40%" stopColor="#D2B48C" stopOpacity="1"/>
            <stop offset="55%" stopColor="#BC9A6A" stopOpacity="1"/>
            <stop offset="70%" stopColor="#D2B48C" stopOpacity="1"/>
            <stop offset="85%" stopColor="#CD853F" stopOpacity="1"/>
            <stop offset="100%" stopColor="#DEB887" stopOpacity="1"/>
          </linearGradient>

          <linearGradient id="woodPanel2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#C19A6B" stopOpacity="1"/>
            <stop offset="15%" stopColor="#D2B48C" stopOpacity="1"/>
            <stop offset="35%" stopColor="#A0522D" stopOpacity="1"/>
            <stop offset="50%" stopColor="#CD853F" stopOpacity="1"/>
            <stop offset="65%" stopColor="#D2B48C" stopOpacity="1"/>
            <stop offset="80%" stopColor="#BC9A6A" stopOpacity="1"/>
            <stop offset="100%" stopColor="#C19A6B" stopOpacity="1"/>
          </linearGradient>

          <linearGradient id="woodPanel3" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#DEB887" stopOpacity="1"/>
            <stop offset="20%" stopColor="#CD853F" stopOpacity="1"/>
            <stop offset="40%" stopColor="#D2B48C" stopOpacity="1"/>
            <stop offset="60%" stopColor="#A0522D" stopOpacity="1"/>
            <stop offset="80%" stopColor="#D2B48C" stopOpacity="1"/>
            <stop offset="100%" stopColor="#DEB887" stopOpacity="1"/>
          </linearGradient>

          {/* Shadow gradient for panel separation */}
          <linearGradient id="panelShadow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8B4513" stopOpacity="0.3"/>
            <stop offset="5%" stopColor="#654321" stopOpacity="0.5"/>
            <stop offset="95%" stopColor="#654321" stopOpacity="0.5"/>
            <stop offset="100%" stopColor="#8B4513" stopOpacity="0.3"/>
          </linearGradient>
        </defs>

        {/* Wood panels */}
        <g>
          {/* Panel 1 */}
          <rect x="0" y="0" width="800" height="150" fill="url(#woodPanel1)"/>
          <rect x="0" y="0" width="800" height="150" fill="url(#panelShadow)" opacity="0.3"/>
          <rect x="0" y="0" width="800" height="150" filter="url(#woodGrain)" opacity="0.4"/>
          <rect x="0" y="0" width="800" height="150" filter="url(#fineTexture)" opacity="0.2"/>
          
          {/* Wood grain lines */}
          <path d="M50,20 Q200,25 350,22 T650,20 Q750,18 800,20" 
                stroke="#A0522D" strokeWidth="0.5" fill="none" opacity="0.6"/>
          <path d="M0,45 Q150,48 300,45 T600,42 Q750,40 800,42" 
                stroke="#8B4513" strokeWidth="0.3" fill="none" opacity="0.4"/>
          <path d="M100,80 Q300,83 500,80 T800,78" 
                stroke="#A0522D" strokeWidth="0.4" fill="none" opacity="0.5"/>
          <path d="M0,110 Q200,113 400,110 T800,108" 
                stroke="#654321" strokeWidth="0.2" fill="none" opacity="0.3"/>

          {/* Panel 2 */}
          <rect x="0" y="150" width="800" height="150" fill="url(#woodPanel2)"/>
          <rect x="0" y="150" width="800" height="150" fill="url(#panelShadow)" opacity="0.3"/>
          <rect x="0" y="150" width="800" height="150" filter="url(#woodGrain)" opacity="0.4"/>
          <rect x="0" y="150" width="800" height="150" filter="url(#fineTexture)" opacity="0.2"/>
          
          {/* Wood grain lines */}
          <path d="M0,170 Q250,173 500,170 T800,168" 
                stroke="#8B4513" strokeWidth="0.4" fill="none" opacity="0.5"/>
          <path d="M75,200 Q275,203 475,200 T800,198" 
                stroke="#A0522D" strokeWidth="0.3" fill="none" opacity="0.6"/>
          <path d="M0,235 Q200,238 400,235 T800,233" 
                stroke="#654321" strokeWidth="0.5" fill="none" opacity="0.4"/>
          <path d="M150,270 Q350,273 550,270 T800,268" 
                stroke="#8B4513" strokeWidth="0.2" fill="none" opacity="0.3"/>

          {/* Panel 3 */}
          <rect x="0" y="300" width="800" height="150" fill="url(#woodPanel3)"/>
          <rect x="0" y="300" width="800" height="150" fill="url(#panelShadow)" opacity="0.3"/>
          <rect x="0" y="300" width="800" height="150" filter="url(#woodGrain)" opacity="0.4"/>
          <rect x="0" y="300" width="800" height="150" filter="url(#fineTexture)" opacity="0.2"/>
          
          {/* Wood grain lines */}
          <path d="M25,320 Q225,323 425,320 T800,318" 
                stroke="#A0522D" strokeWidth="0.6" fill="none" opacity="0.5"/>
          <path d="M0,355 Q300,358 600,355 T800,353" 
                stroke="#654321" strokeWidth="0.3" fill="none" opacity="0.4"/>
          <path d="M120,390 Q320,393 520,390 T800,388" 
                stroke="#8B4513" strokeWidth="0.4" fill="none" opacity="0.6"/>
          <path d="M0,425 Q200,428 400,425 T800,423" 
                stroke="#A0522D" strokeWidth="0.2" fill="none" opacity="0.3"/>

          {/* Panel 4 */}
          <rect x="0" y="450" width="800" height="150" fill="url(#woodPanel1)"/>
          <rect x="0" y="450" width="800" height="150" fill="url(#panelShadow)" opacity="0.3"/>
          <rect x="0" y="450" width="800" height="150" filter="url(#woodGrain)" opacity="0.4"/>
          <rect x="0" y="450" width="800" height="150" filter="url(#fineTexture)" opacity="0.2"/>
          
          {/* Wood grain lines */}
          <path d="M80,470 Q280,473 480,470 T800,468" 
                stroke="#654321" strokeWidth="0.5" fill="none" opacity="0.5"/>
          <path d="M0,505 Q250,508 500,505 T800,503" 
                stroke="#8B4513" strokeWidth="0.3" fill="none" opacity="0.4"/>
          <path d="M160,540 Q360,543 560,540 T800,538" 
                stroke="#A0522D" strokeWidth="0.4" fill="none" opacity="0.6"/>
          <path d="M0,575 Q200,578 400,575 T800,573" 
                stroke="#654321" strokeWidth="0.2" fill="none" opacity="0.3"/>
        </g>

        {/* Panel separation shadows */}
        <rect x="0" y="148" width="800" height="4" fill="#654321" opacity="0.6"/>
        <rect x="0" y="298" width="800" height="4" fill="#654321" opacity="0.6"/>
        <rect x="0" y="448" width="800" height="4" fill="#654321" opacity="0.6"/>

        {/* Wood knots */}
        <ellipse cx="200" cy="75" rx="8" ry="12" fill="#8B4513" opacity="0.7"/>
        <ellipse cx="200" cy="75" rx="4" ry="6" fill="#654321" opacity="0.8"/>
        
        <ellipse cx="450" cy="225" rx="6" ry="10" fill="#A0522D" opacity="0.6"/>
        <ellipse cx="450" cy="225" rx="3" ry="5" fill="#8B4513" opacity="0.8"/>
        
        <ellipse cx="650" cy="375" rx="7" ry="11" fill="#654321" opacity="0.7"/>
        <ellipse cx="650" cy="375" rx="3" ry="5" fill="#8B4513" opacity="0.9"/>

        <ellipse cx="150" cy="525" rx="5" ry="8" fill="#A0522D" opacity="0.6"/>
        <ellipse cx="150" cy="525" rx="2" ry="4" fill="#654321" opacity="0.8"/>
      </svg>

      {/* Animated Dust Particles */}
      <div style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        pointerEvents: 'none',
        
      }}>
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              backgroundColor: '#DEB887',
              borderRadius: '50%',
              opacity: 0.3 + Math.random() * 0.4,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `dustFloat${i % 3} ${8 + Math.random() * 12}s infinite ease-in-out`,
            }}
          />
        ))}
        
        {[...Array(15)].map((_, i) => (
          <div
            key={`large-${i}`}
            style={{
              position: 'absolute',
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              backgroundColor: '#CD853F',
              borderRadius: '50%',
              opacity: 0.2 + Math.random() * 0.3,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `dustFloat${(i + 1) % 3} ${10 + Math.random() * 15}s infinite ease-in-out`,
            }}
          />
        ))}
      </div>

      <style>
        {`
          @keyframes dustFloat0 {
            0%, 100% {
              transform: translate(0, 0) rotate(0deg);
            }
            25% {
              transform: translate(10px, -15px) rotate(90deg);
            }
            50% {
              transform: translate(-5px, -25px) rotate(180deg);
            }
            75% {
              transform: translate(-15px, -10px) rotate(270deg);
            }
          }

          @keyframes dustFloat1 {
            0%, 100% {
              transform: translate(0, 0) rotate(0deg);
            }
            33% {
              transform: translate(-12px, -20px) rotate(120deg);
            }
            66% {
              transform: translate(8px, -30px) rotate(240deg);
            }
          }

          @keyframes dustFloat2 {
            0%, 100% {
              transform: translate(0, 0) rotate(0deg);
            }
            20% {
              transform: translate(15px, -10px) rotate(72deg);
            }
            40% {
              transform: translate(5px, -25px) rotate(144deg);
            }
            60% {
              transform: translate(-10px, -20px) rotate(216deg);
            }
            80% {
              transform: translate(-8px, -5px) rotate(288deg);
            }
          }
        `}
      </style>
    </div>
  );
};

export default WoodenTexture;