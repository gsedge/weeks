// themes.ts
export interface Theme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
  };
}

export const THEMES: Record<string, Theme> = {
  sunset: {
    id: 'sunset',
    name: 'Sunset',
    colors: { 
      primary: '#FF6B6B',    // Coral red
      secondary: '#FFA726',  // Orange
      background: '#FFE5B4'  // Peach
    }
  },
  ocean: {
    id: 'ocean',
    name: 'Ocean',
    colors: { 
      primary: '#0077BE',    // Deep blue
      secondary: '#00C9FF',  // Cyan
      background: '#E0F7FF'  // Light blue
    }
  },
  forest: {
    id: 'forest',
    name: 'Forest',
    colors: { 
      primary: '#2D5016',    // Dark green
      secondary: '#7CB342',  // Light green
      background: '#E8F5E9'  // Pale green
    }
  },
  purple: {
    id: 'purple',
    name: 'Purple Dream',
    colors: { 
      primary: '#5d3fd3',    // Royal purple
      secondary: '#9b7fd6',  // Lavender
      background: '#e8e4f3'  // Light lavender
    }
  },
  midnight: {
    id: 'midnight',
    name: 'Midnight',
    colors: { 
      primary: '#1a1625',    // Dark purple/black
      secondary: '#5d3fd3',  // Purple
      background: '#2d2245'  // Medium dark purple
    }
  },
  rose: {
    id: 'rose',
    name: 'Rose Garden',
    colors: { 
      primary: '#C2185B',    // Deep pink
      secondary: '#F48FB1',  // Light pink
      background: '#FCE4EC'  // Pale pink
    }
  },
  autumn: {
    id: 'autumn',
    name: 'Autumn',
    colors: { 
      primary: '#8B4513',    // Saddle brown
      secondary: '#FF8C00',  // Dark orange
      background: '#FFDAB9'  // Peach puff
    }
  },
  mint: {
    id: 'mint',
    name: 'Mint Fresh',
    colors: { 
      primary: '#00B894',    // Mint green
      secondary: '#55EFC4',  // Light mint
      background: '#DFF9F0'  // Very light mint
    }
  },
  berry: {
    id: 'berry',
    name: 'Berry Blast',
    colors: { 
      primary: '#6C2E8F',    // Deep purple
      secondary: '#D946EF',  // Bright pink-purple
      background: '#F3E5F5'  // Light purple
    }
  },
  monochrome: {
    id: 'monochrome',
    name: 'Monochrome',
    colors: { 
      primary: '#2C3E50',    // Dark slate
      secondary: '#7F8C8D',  // Gray
      background: '#ECF0F1'  // Light gray
    }
  }
};

// Helper function to get theme by ID
export const getThemeById = (themeId: string): Theme => {
  return THEMES[themeId] || THEMES.purple; // Default to purple if not found
};

// Get all theme IDs
export const getAllThemeIds = (): string[] => {
  return Object.keys(THEMES);
};

// Get all themes as array
export const getAllThemes = (): Theme[] => {
  return Object.values(THEMES);
};