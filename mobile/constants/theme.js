import { Platform } from 'react-native';

const tintColorLight = '#FFB300';
const tintColorDark = '#FFB300';

export const Colors = {
  light: {
    text: '#2D3436',
    background: '#F8F9FB',
    tint: tintColorLight,
    icon: '#636E72',
    tabIconDefault: '#636E72',
    tabIconSelected: tintColorLight,
    surface: '#FFFFFF',
    primary: '#FFB300',
    success: '#00B894',
    muted: '#636E72',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    surface: '#1C1C1E',
    primary: '#FFB300',
    success: '#00B894',
    muted: '#9BA1A6',
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
