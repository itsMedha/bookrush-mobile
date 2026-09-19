import { memo } from 'react';
import { Text as RNText, type TextProps as RNTextProps, type TextStyle } from 'react-native';
import {
  colors,
  maxFontSizeMultiplier,
  typography,
  type ColorToken,
  type TypographyVariant,
} from '@/theme';

export interface TextProps extends RNTextProps {
  variant?: TypographyVariant;
  color?: ColorToken;
  align?: TextStyle['textAlign'];
  weight?: TextStyle['fontWeight'];
}

/** The only text primitive: every string in the app resolves to a typography token. */
function TextBase({
  variant = 'body',
  color = 'textPrimary',
  align,
  weight,
  style,
  maxFontSizeMultiplier: maxScale = maxFontSizeMultiplier,
  ...rest
}: TextProps) {
  return (
    <RNText
      {...rest}
      maxFontSizeMultiplier={maxScale}
      style={[
        typography[variant],
        { color: colors[color] },
        align ? { textAlign: align } : null,
        weight ? { fontWeight: weight } : null,
        style,
      ]}
    />
  );
}

export const Text = memo(TextBase);
