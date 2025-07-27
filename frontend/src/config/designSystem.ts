// Design System Configuration
// This file centralizes all design tokens and component configurations

export const DESIGN_TOKENS = {
  // Color Palette
  colors: {
    // Primary brand colors
    primary: {
      50: 'hsl(260, 85%, 95%)',
      100: 'hsl(260, 85%, 90%)',
      200: 'hsl(260, 85%, 80%)',
      300: 'hsl(260, 85%, 70%)',
      400: 'hsl(260, 85%, 65%)',
      500: 'hsl(260, 85%, 60%)',
      600: 'hsl(260, 85%, 55%)',
      700: 'hsl(260, 85%, 50%)',
      800: 'hsl(260, 85%, 45%)',
      900: 'hsl(260, 85%, 40%)',
      950: 'hsl(260, 85%, 35%)',
    },
    
    // Chain-specific colors
    chains: {
      intake: 'hsl(214, 95%, 60%)',
      enrichment: 'hsl(260, 85%, 65%)',
      generator: 'hsl(142, 75%, 55%)',
      publisher: 'hsl(24, 90%, 60%)',
      router: 'hsl(189, 85%, 60%)',
      tracker: 'hsl(329, 85%, 60%)',
      feedback: 'hsl(234, 85%, 60%)',
    },
    
    // Status colors
    status: {
      active: 'hsl(142, 75%, 55%)',
      processing: 'hsl(45, 90%, 60%)',
      idle: 'hsl(220, 15%, 45%)',
      error: 'hsl(0, 75%, 60%)',
      warning: 'hsl(38, 95%, 60%)',
      success: 'hsl(142, 75%, 55%)',
    },
    
    // Neutral colors
    neutral: {
      50: 'hsl(220, 15%, 98%)',
      100: 'hsl(220, 15%, 95%)',
      200: 'hsl(220, 15%, 90%)',
      300: 'hsl(220, 15%, 80%)',
      400: 'hsl(220, 15%, 70%)',
      500: 'hsl(220, 15%, 60%)',
      600: 'hsl(220, 15%, 50%)',
      700: 'hsl(220, 15%, 40%)',
      800: 'hsl(220, 15%, 30%)',
      900: 'hsl(220, 15%, 20%)',
      950: 'hsl(220, 15%, 10%)',
    },
    
    // Background colors
    background: {
      primary: 'hsl(225, 15%, 8%)',
      secondary: 'hsl(225, 15%, 12%)',
      tertiary: 'hsl(225, 15%, 16%)',
      canvas: 'hsl(225, 10%, 6%)',
    },
    
    // Text colors
    text: {
      primary: 'hsl(220, 15%, 92%)',
      secondary: 'hsl(220, 15%, 75%)',
      muted: 'hsl(220, 10%, 65%)',
      inverse: 'hsl(220, 15%, 8%)',
    },
  },
  
  // Spacing scale
  spacing: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
    '2xl': '3rem',    // 48px
    '3xl': '4rem',    // 64px
    '4xl': '6rem',    // 96px
  },
  
  // Border radius
  borderRadius: {
    none: '0',
    sm: '0.25rem',    // 4px
    md: '0.5rem',     // 8px
    lg: '0.75rem',    // 12px
    xl: '1rem',       // 16px
    '2xl': '1.5rem',  // 24px
    full: '9999px',
  },
  
  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  },
  
  // Typography
  typography: {
    fontSizes: {
      xs: '0.75rem',   // 12px
      sm: '0.875rem',  // 14px
      base: '1rem',    // 16px
      lg: '1.125rem',  // 18px
      xl: '1.25rem',   // 20px
      '2xl': '1.5rem', // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
    },
    fontWeights: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    lineHeights: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75',
    },
  },
  
  // Transitions
  transitions: {
    fast: '150ms ease-in-out',
    normal: '250ms ease-in-out',
    slow: '350ms ease-in-out',
  },
  
  // Z-index scale
  zIndex: {
    hide: -1,
    auto: 'auto',
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800,
  },
};

// Component-specific configurations
export const COMPONENT_CONFIGS = {
  // Button variants
  button: {
    variants: {
      default: {
        backgroundColor: DESIGN_TOKENS.colors.primary[600],
        color: DESIGN_TOKENS.colors.text.primary,
        border: 'none',
        '&:hover': {
          backgroundColor: DESIGN_TOKENS.colors.primary[700],
        },
        '&:active': {
          backgroundColor: DESIGN_TOKENS.colors.primary[800],
        },
      },
      outline: {
        backgroundColor: 'transparent',
        color: DESIGN_TOKENS.colors.primary[600],
        border: `1px solid ${DESIGN_TOKENS.colors.primary[600]}`,
        '&:hover': {
          backgroundColor: DESIGN_TOKENS.colors.primary[50],
        },
      },
      secondary: {
        backgroundColor: DESIGN_TOKENS.colors.neutral[200],
        color: DESIGN_TOKENS.colors.text.inverse,
        border: 'none',
        '&:hover': {
          backgroundColor: DESIGN_TOKENS.colors.neutral[300],
        },
      },
      destructive: {
        backgroundColor: DESIGN_TOKENS.colors.status.error,
        color: DESIGN_TOKENS.colors.text.primary,
        border: 'none',
        '&:hover': {
          backgroundColor: 'hsl(0, 75%, 50%)',
        },
      },
      ghost: {
        backgroundColor: 'transparent',
        color: DESIGN_TOKENS.colors.text.primary,
        border: 'none',
        '&:hover': {
          backgroundColor: DESIGN_TOKENS.colors.neutral[100],
        },
      },
    },
    sizes: {
      sm: {
        padding: `${DESIGN_TOKENS.spacing.sm} ${DESIGN_TOKENS.spacing.md}`,
        fontSize: DESIGN_TOKENS.typography.fontSizes.sm,
      },
      md: {
        padding: `${DESIGN_TOKENS.spacing.md} ${DESIGN_TOKENS.spacing.lg}`,
        fontSize: DESIGN_TOKENS.typography.fontSizes.base,
      },
      lg: {
        padding: `${DESIGN_TOKENS.spacing.lg} ${DESIGN_TOKENS.spacing.xl}`,
        fontSize: DESIGN_TOKENS.typography.fontSizes.lg,
      },
    },
  },
  
  // Card variants
  card: {
    variants: {
      default: {
        backgroundColor: DESIGN_TOKENS.colors.background.secondary,
        border: `1px solid ${DESIGN_TOKENS.colors.neutral[200]}`,
        borderRadius: DESIGN_TOKENS.borderRadius.lg,
        boxShadow: DESIGN_TOKENS.shadows.sm,
      },
      elevated: {
        backgroundColor: DESIGN_TOKENS.colors.background.secondary,
        border: 'none',
        borderRadius: DESIGN_TOKENS.borderRadius.lg,
        boxShadow: DESIGN_TOKENS.shadows.lg,
      },
      outline: {
        backgroundColor: 'transparent',
        border: `1px solid ${DESIGN_TOKENS.colors.neutral[300]}`,
        borderRadius: DESIGN_TOKENS.borderRadius.lg,
        boxShadow: 'none',
      },
    },
  },
  
  // Badge variants
  badge: {
    variants: {
      default: {
        backgroundColor: DESIGN_TOKENS.colors.neutral[100],
        color: DESIGN_TOKENS.colors.text.inverse,
        border: `1px solid ${DESIGN_TOKENS.colors.neutral[200]}`,
      },
      primary: {
        backgroundColor: DESIGN_TOKENS.colors.primary[100],
        color: DESIGN_TOKENS.colors.primary[800],
        border: `1px solid ${DESIGN_TOKENS.colors.primary[200]}`,
      },
      success: {
        backgroundColor: DESIGN_TOKENS.colors.status.success + '20',
        color: DESIGN_TOKENS.colors.status.success,
        border: `1px solid ${DESIGN_TOKENS.colors.status.success + '40'}`,
      },
      warning: {
        backgroundColor: DESIGN_TOKENS.colors.status.warning + '20',
        color: DESIGN_TOKENS.colors.status.warning,
        border: `1px solid ${DESIGN_TOKENS.colors.status.warning + '40'}`,
      },
      error: {
        backgroundColor: DESIGN_TOKENS.colors.status.error + '20',
        color: DESIGN_TOKENS.colors.status.error,
        border: `1px solid ${DESIGN_TOKENS.colors.status.error + '40'}`,
      },
    },
  },
  
  // Input variants
  input: {
    variants: {
      default: {
        backgroundColor: DESIGN_TOKENS.colors.background.secondary,
        border: `1px solid ${DESIGN_TOKENS.colors.neutral[300]}`,
        color: DESIGN_TOKENS.colors.text.primary,
        '&:focus': {
          borderColor: DESIGN_TOKENS.colors.primary[500],
          boxShadow: `0 0 0 2px ${DESIGN_TOKENS.colors.primary[500]}20`,
        },
      },
      error: {
        backgroundColor: DESIGN_TOKENS.colors.background.secondary,
        border: `1px solid ${DESIGN_TOKENS.colors.status.error}`,
        color: DESIGN_TOKENS.colors.text.primary,
        '&:focus': {
          borderColor: DESIGN_TOKENS.colors.status.error,
          boxShadow: `0 0 0 2px ${DESIGN_TOKENS.colors.status.error}20`,
        },
      },
    },
  },
};

// Utility functions
export const getChainColor = (chainType: string): string => {
  return DESIGN_TOKENS.colors.chains[chainType as keyof typeof DESIGN_TOKENS.colors.chains] || 
         DESIGN_TOKENS.colors.primary[600];
};

export const getStatusColor = (status: string): string => {
  return DESIGN_TOKENS.colors.status[status as keyof typeof DESIGN_TOKENS.colors.status] || 
         DESIGN_TOKENS.colors.neutral[500];
};

export const getComponentVariant = (component: string, variant: string) => {
  return COMPONENT_CONFIGS[component as keyof typeof COMPONENT_CONFIGS]?.variants?.[variant] || {};
};

export const getComponentSize = (component: string, size: string) => {
  return COMPONENT_CONFIGS[component as keyof typeof COMPONENT_CONFIGS]?.sizes?.[size] || {};
}; 