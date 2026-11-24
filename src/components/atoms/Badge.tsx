import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Colors, Radius, Spacing } from '../../theme/colors';
import { SvgIcon, SvgIconName } from './SvgIcon';

export type BadgeVariant =
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'neutral'
  | 'mustard'
  | 'default';

export interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  dot?: boolean;
  icon?: SvgIconName;
  style?: StyleProp<ViewStyle>;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'neutral',
  size = 'md',
  dot = false,
  icon,
  style,
}) => {
  const getBadgeColors = () => {
    switch (variant) {
      case 'success':
        return { bg: Colors.successLight, text: Colors.success, dot: Colors.success };
      case 'warning':
        return { bg: Colors.warningLight, text: Colors.warning, dot: Colors.warning };
      case 'danger':
        return { bg: Colors.dangerLight, text: Colors.danger, dot: Colors.danger };
      case 'info':
        return { bg: '#DBEAFE', text: '#2563EB', dot: '#2563EB' };
      case 'mustard':
        return { bg: Colors.mustardLight, text: Colors.mustard, dot: Colors.mustard };
      default:
        return { bg: Colors.surfaceSubtle, text: Colors.textSecondary, dot: Colors.textMuted };
    }
  };

  const colors = getBadgeColors();

  return (
    <View
      style={[
        styles.badge,
        size === 'sm' ? styles.badgeSm : styles.badgeMd,
        { backgroundColor: colors.bg },
        style,
      ]}
    >
      {dot && <View style={[styles.dot, { backgroundColor: colors.dot }]} />}
      {icon && (
        <SvgIcon
          name={icon}
          size={size === 'sm' ? 12 : 14}
          color={colors.text}
          style={styles.icon}
        />
      )}
      <Text
        style={[
          styles.text,
          size === 'sm' ? styles.textSm : styles.textMd,
          { color: colors.text },
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: Radius.pill,
  },
  badgeSm: {
    paddingVertical: 3,
    paddingHorizontal: Spacing.sm,
  },
  badgeMd: {
    paddingVertical: 5,
    paddingHorizontal: Spacing.md,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  icon: {
    marginRight: 4,
  },
  text: {
    fontWeight: '700',
  },
  textSm: {
    fontSize: 11,
  },
  textMd: {
    fontSize: 12,
  },
});
