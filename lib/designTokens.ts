/**
 * Design Tokens for Premium Game Show Experience
 * 
 * Visual Language: Modern Game Show × Premium Mobile Game × Interactive Reward UI
 */

// ============================================
// SPACING SCALE (50% smaller than before)
// ============================================
export const spacing = {
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '0.75rem',    // 12px
  lg: '1rem',       // 16px
  xl: '1.5rem',     // 24px
  '2xl': '2rem',    // 32px
  '3xl': '3rem',    // 48px
  '4xl': '4rem',    // 64px
};

// ============================================
// TYPOGRAPHY SCALE (50% smaller)
// ============================================
export const fontSize = {
  xs: '0.625rem',   // 10px
  sm: '0.75rem',    // 12px
  base: '0.875rem', // 14px
  lg: '1rem',       // 16px
  xl: '1.125rem',   // 18px
  '2xl': '1.25rem', // 20px
  '3xl': '1.5rem',  // 24px
  '4xl': '1.875rem', // 30px
  '5xl': '2.25rem',  // 36px
  '6xl': '3rem',     // 48px
};

// ============================================
// COLOR PALETTE
// ============================================
export const colors = {
  // Deep background
  background: {
    primary: '#0a0118',
    secondary: '#150828',
    tertiary: '#1f0d38',
  },
  
  // Vibrant accents
  accent: {
    blue: '#3b82f6',
    purple: '#a855f7',
    cyan: '#06b6d4',
    pink: '#ec4899',
    orange: '#f97316',
    gold: '#fbbf24',
    yellow: '#facc15',
  },
  
  // Status colors
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
  
  // Neutrals
  white: '#ffffff',
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
};

// ============================================
// ANIMATION TIMING
// ============================================
export const timing = {
  micro: 150,        // 150ms - button press, hover
  ui: 300,           // 300ms - transitions, reveals
  reward: 1000,      // 1000ms - reward animations
  celebration: 2500, // 2500ms - major celebrations
};

export const easing = {
  smooth: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  decelerate: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
  accelerate: 'cubic-bezier(0.4, 0.0, 1, 1)',
};

// ============================================
// SHADOWS & DEPTH
// ============================================
export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  glow: {
    blue: '0 0 20px rgba(59, 130, 246, 0.5)',
    purple: '0 0 20px rgba(168, 85, 247, 0.5)',
    cyan: '0 0 20px rgba(6, 182, 212, 0.5)',
    pink: '0 0 20px rgba(236, 72, 153, 0.5)',
    gold: '0 0 20px rgba(251, 191, 36, 0.5)',
  },
};

// ============================================
// COMPONENT DIMENSIONS (50% scale)
// ============================================
export const dimensions = {
  button: {
    height: {
      sm: '2rem',     // 32px
      md: '2.5rem',   // 40px
      lg: '3rem',     // 48px
    },
    minWidth: '4rem', // 64px
  },
  
  card: {
    maxWidth: '28rem', // 448px
    borderRadius: '0.75rem', // 12px
  },
  
  modal: {
    maxWidth: '36rem', // 576px
    borderRadius: '1rem', // 16px
  },
  
  wheel: {
    small: '5rem',    // 80px (icon)
    large: '20rem',   // 320px (modal)
  },
  
  chest: {
    width: '12rem',   // 192px (50% of original)
    height: '10rem',  // 160px
  },
};

// ============================================
// Z-INDEX LAYERS
// ============================================
export const zIndex = {
  background: 0,
  content: 10,
  card: 20,
  dropdown: 30,
  sticky: 40,
  overlay: 50,
  modal: 60,
  toast: 70,
  tooltip: 80,
};
