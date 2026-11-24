import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors, Radius, Spacing } from '../../theme/colors';
import { SvgIcon } from '../atoms/SvgIcon';
import { Badge } from '../atoms/Badge';
import { RouteStop } from '../../types';

export interface StopTimelineItemProps {
  stop: RouteStop;
  isFirst?: boolean;
  isLast?: boolean;
  onPress?: () => void;
  onActionPress?: () => void;
  actionLabel?: string;
}

export const StopTimelineItem: React.FC<StopTimelineItemProps> = ({
  stop,
  isFirst = false,
  isLast = false,
  onPress,
  onActionPress,
  actionLabel,
}) => {
  const isCompleted = stop.estado === 'Completada';
  const isCurrent = stop.estado === 'En curso' || stop.es_actual;

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View style={styles.trackColumn}>
        {!isFirst && (
          <View
            style={[
              styles.line,
              styles.topLine,
              isCompleted && styles.completedLine,
            ]}
          />
        )}
        <View
          style={[
            styles.nodeCircle,
            isCompleted && styles.completedNode,
            isCurrent && styles.currentNode,
          ]}
        >
          {isCompleted ? (
            <SvgIcon name="check" size={12} color={Colors.textInverse} />
          ) : isCurrent ? (
            <SvgIcon name="truck" size={14} color={Colors.textInverse} />
          ) : (
            <Text style={styles.nodeText}>{stop.orden}</Text>
          )}
        </View>
        {!isLast && (
          <View
            style={[
              styles.line,
              styles.bottomLine,
              (isCompleted || isCurrent) && styles.completedLine,
            ]}
          />
        )}
      </View>

      <View
        style={[
          styles.contentCard,
          isCurrent && styles.currentCard,
        ]}
      >
        <View style={styles.headerRow}>
          <View style={styles.timeTag}>
            <SvgIcon name="clock" size={12} color={Colors.textMuted} />
            <Text style={styles.timeText}>{stop.hora_estimada}</Text>
          </View>
          <Badge
            label={stop.estado}
            variant={
              isCompleted ? 'success' : isCurrent ? 'warning' : 'neutral'
            }
            size="sm"
            dot={isCurrent}
          />
        </View>

        <Text style={[styles.stopName, isCurrent && styles.currentStopName]}>
          {stop.nombre_parada}
        </Text>

        {stop.notas ? (
          <Text style={styles.notesText}>{stop.notas}</Text>
        ) : null}

        {actionLabel && onActionPress ? (
          <Pressable
            onPress={onActionPress}
            style={styles.actionBtn}
          >
            <SvgIcon name="cylinder" size={14} color={Colors.accentBlue} />
            <Text style={styles.actionBtnText}>{actionLabel}</Text>
          </Pressable>
        ) : null}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: Spacing.sm,
  },
  trackColumn: {
    width: 36,
    alignItems: 'center',
  },
  topLine: {
    height: 12,
  },
  bottomLine: {
    flex: 1,
  },
  line: {
    width: 2,
    backgroundColor: Colors.border,
  },
  completedLine: {
    backgroundColor: Colors.success,
  },
  nodeCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 2,
    borderColor: Colors.borderStrong,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  completedNode: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  currentNode: {
    backgroundColor: Colors.mustard,
    borderColor: Colors.mustardDark,
    transform: [{ scale: 1.1 }],
  },
  nodeText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textMuted,
  },
  contentCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginLeft: Spacing.xs,
  },
  currentCard: {
    borderColor: Colors.mustard,
    backgroundColor: '#FFFDF7',
    borderLeftWidth: 4,
    borderLeftColor: Colors.mustard,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  timeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  stopName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  currentStopName: {
    color: Colors.mustardDark,
  },
  notesText: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 4,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: Spacing.sm,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#EFF6FF',
    borderRadius: Radius.sm,
    alignSelf: 'flex-start',
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.accentBlue,
  },
});
