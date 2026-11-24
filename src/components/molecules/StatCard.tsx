import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle, Pressable } from 'react-native';
import { Colors, Radius, Spacing } from '../../theme/colors';
import { SvgIcon, SvgIconName } from '../atoms/SvgIcon';
import { Badge, BadgeVariant } from '../atoms/Badge';

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: SvgIconName;
  iconColor?: string;
  badgeLabel?: string;
  badgeVariant?: BadgeVariant;
  highlightColor?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  iconColor = Colors.accentBlue,
  badgeLabel,
  badgeVariant = 'neutral',
  highlightColor,
  onPress,
  style,
}) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [
        styles.card,
        highlightColor ? { borderLeftColor: highlightColor, borderLeftWidth: 4 } : null,
        pressed && styles.pressed,
        style,
      ]}
    >
      <View style={styles.topRow}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {icon && (
          <View style={[styles.iconCircle, { backgroundColor: iconColor + '15' }]}>
            <SvgIcon name={icon} size={18} color={iconColor} />
          </View>
        )}
      </View>
      <View style={styles.valueRow}>
        <Text style={[styles.value, highlightColor ? { color: highlightColor } : null]}>
          {value}
        </Text>
        {badgeLabel && <Badge label={badgeLabel} variant={badgeVariant} size="sm" />}
      </View>
      {subtitle && (
        <Text style={styles.subtitle} numberOfLines={1}>
          {subtitle}
        </Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.sm,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  title: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    flex: 1,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  value: {
    fontSize: 24,
    fontWeight: '900',
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  pressed: {
    opacity: 0.85,
  },
});
