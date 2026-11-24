import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Colors, Radius, Spacing } from '../../theme/colors';
import { SvgIcon, SvgIconName } from './SvgIcon';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'danger'
  | 'success'
  | 'mustard'
  | 'quickDeduct';

export interface ButtonProps {
  label: string;
  subLabel?: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg';
  icon?: SvgIconName;
  iconRight?: SvgIconName;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  subLabel,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  labelStyle,
}) => {
  const isInactive = disabled || loading;

  const getContainerStyles = (pressed: boolean): StyleProp<ViewStyle> => {
    const list: ViewStyle[] = [styles.base];

    if (size === 'sm') list.push(styles.sizeSm);
    else if (size === 'lg') list.push(styles.sizeLg);
    else list.push(styles.sizeMd);

    switch (variant) {
      case 'primary':
        list.push(styles.primary);
        break;
      case 'secondary':
        list.push(styles.secondary);
        break;
      case 'outline':
        list.push(styles.outline);
        break;
      case 'danger':
        list.push(styles.danger);
        break;
      case 'success':
        list.push(styles.success);
        break;
      case 'mustard':
        list.push(styles.mustard);
        break;
      case 'quickDeduct':
        list.push(styles.quickDeduct);
        break;
    }

    if (fullWidth) list.push(styles.fullWidth);
    if (pressed) list.push(styles.pressed);
    if (isInactive) list.push(styles.disabled);

    return list;
  };

  const getTextColor = (): string => {
    switch (variant) {
      case 'outline':
        return Colors.textPrimary;
      case 'secondary':
        return Colors.primary;
      case 'quickDeduct':
        return Colors.textPrimary;
      default:
        return Colors.textInverse;
    }
  };

  const textColor = getTextColor();
  const iconSize = size === 'sm' ? 16 : size === 'lg' ? 22 : 18;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isInactive, busy: loading }}
      onPress={onPress}
      disabled={isInactive}
      style={({ pressed }) => [getContainerStyles(pressed), style]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <View style={styles.contentRow}>
          {icon && (
            <SvgIcon name={icon} size={iconSize} color={textColor} style={styles.iconLeft} />
          )}
          <View style={styles.textColumn}>
            <Text style={[styles.label, { color: textColor }, labelStyle]}>{label}</Text>
            {subLabel ? (
              <Text style={[styles.subLabel, { color: textColor }]}>{subLabel}</Text>
            ) : null}
          </View>
          {iconRight && (
            <SvgIcon name={iconRight} size={iconSize} color={textColor} style={styles.iconRight} />
          )}
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textColumn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  sizeSm: {
    paddingVertical: Spacing.xs + 2,
    paddingHorizontal: Spacing.md,
    minHeight: 36,
  },
  sizeMd: {
    paddingVertical: Spacing.sm + 3,
    paddingHorizontal: Spacing.lg,
    minHeight: 48,
  },
  sizeLg: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    minHeight: 56,
  },
  fullWidth: {
    width: '100%',
  },
  primary: {
    backgroundColor: Colors.accentBlue,
  },
  secondary: {
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.borderStrong,
  },
  danger: {
    backgroundColor: Colors.danger,
  },
  success: {
    backgroundColor: Colors.success,
  },
  mustard: {
    backgroundColor: Colors.mustard,
  },
  quickDeduct: {
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1.5,
    borderColor: Colors.borderStrong,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  subLabel: {
    fontSize: 11,
    fontWeight: '500',
    opacity: 0.85,
    marginTop: 2,
    textAlign: 'center',
  },
  iconLeft: {
    marginRight: Spacing.sm,
  },
  iconRight: {
    marginLeft: Spacing.sm,
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.985 }],
  },
  disabled: {
    opacity: 0.45,
  },
});
