import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors, Radius, Spacing } from '../../theme/colors';
import { SvgIcon } from '../atoms/SvgIcon';
import { Badge } from '../atoms/Badge';
import { UserRole } from '../../types';

export interface HeaderBarProps {
  title?: string;
  subtitle?: string;
  role: UserRole;
  userName: string;
  unreadNotificationsCount?: number;
  onNotificationsPress?: () => void;
  onProfilePress?: () => void;
  onBackPress?: () => void;
  showBack?: boolean;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  title = 'GarrafasYa',
  subtitle,
  role,
  userName,
  unreadNotificationsCount = 0,
  onNotificationsPress,
  onProfilePress,
  onBackPress,
  showBack = false,
}) => {
  const getRoleBadge = () => {
    switch (role) {
      case 'driver':
        return { label: 'Conductor', variant: 'mustard' as const };
      case 'admin':
        return { label: 'Admin', variant: 'info' as const };
      default:
        return { label: 'Vecino', variant: 'success' as const };
    }
  };

  const badgeInfo = getRoleBadge();

  return (
    <View style={styles.header}>
      <View style={styles.leftRow}>
        {showBack && onBackPress ? (
          <Pressable onPress={onBackPress} style={styles.iconButton}>
            <SvgIcon name="chevronLeft" size={22} color={Colors.textInverse} />
          </Pressable>
        ) : (
          <View style={styles.logoBadge}>
            <SvgIcon name="cylinder" size={20} color={Colors.textInverse} />
          </View>
        )}
        <View style={styles.titleColumn}>
          <View style={styles.brandRow}>
            <Text style={styles.title}>{title}</Text>
            <Badge label={badgeInfo.label} variant={badgeInfo.variant} size="sm" />
          </View>
          {subtitle ? (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>

      <View style={styles.rightRow}>
        {onNotificationsPress && (
          <Pressable onPress={onNotificationsPress} style={styles.notificationBtn}>
            <SvgIcon name="bell" size={20} color={Colors.textInverse} />
            {unreadNotificationsCount > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>
                  {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                </Text>
              </View>
            )}
          </Pressable>
        )}
        {onProfilePress && (
          <Pressable onPress={onProfilePress} style={styles.profileBtn}>
            <View style={styles.avatarMini}>
              <Text style={styles.avatarMiniText}>
                {userName ? userName.slice(0, 2).toUpperCase() : 'TF'}
              </Text>
            </View>
          </Pressable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: Colors.primaryDark,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logoBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  iconButton: {
    padding: Spacing.xs,
    marginRight: Spacing.xs,
  },
  titleColumn: {
    flex: 1,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textInverse,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.border,
    marginTop: 1,
  },
  rightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  notificationBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: Colors.danger,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  notificationBadgeText: {
    color: Colors.textInverse,
    fontSize: 10,
    fontWeight: '800',
  },
  profileBtn: {
    padding: 2,
  },
  avatarMini: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#93C5FD',
  },
  avatarMiniText: {
    color: Colors.primary,
    fontWeight: '800',
    fontSize: 13,
  },
});
