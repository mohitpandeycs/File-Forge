export interface BrandColors {
  bgPrimary: string
  bgSurface: string
  accent: string
  accentHover: string
  success: string
  textPrimary: string
  textSecondary: string
  textInverse: string
  border: string
  borderLight: string
}

export interface BrandFonts {
  display: string
  body: string
  mono: string
}

export interface BrandShadows {
  sm: string
  md: string
  lg: string
}

export interface BrandTokens {
  colors: BrandColors
  fonts: BrandFonts
  shadows: BrandShadows
  spacing: {
    base: number
    scale: number[]
  }
}

export const brand: BrandTokens = {
  colors: {
    bgPrimary: '#0A0A0A',
    bgSurface: '#FAFAF7',
    accent: '#F59E0B',
    accentHover: '#D97706',
    success: '#14B8A6',
    textPrimary: '#0A0A0A',
    textSecondary: '#6B7280',
    textInverse: '#FAFAF7',
    border: '#E5E5E0',
    borderLight: '#F0F0EB',
  },
  fonts: {
    display: "'Clash Display', sans-serif",
    body: "'Satoshi', sans-serif",
    mono: "'JetBrains Mono', monospace",
  },
  shadows: {
    sm: '0 2px 8px rgba(245, 158, 11, 0.06)',
    md: '0 8px 32px rgba(245, 158, 11, 0.08)',
    lg: '0 16px 64px rgba(245, 158, 11, 0.12)',
  },
  spacing: {
    base: 8,
    scale: [4, 8, 12, 16, 24, 32, 48, 64, 96, 128],
  },
}

export const fontUrls = {
  clashDisplay: 'https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&display=swap',
  satoshi: 'https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap',
  jetBrainsMono: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap',
}
