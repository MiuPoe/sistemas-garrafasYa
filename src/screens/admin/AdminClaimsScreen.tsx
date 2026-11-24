import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors, Radius, Spacing } from '../../theme/colors';
import { useApp } from '../../context/AppContext';
import { ClaimCard } from '../../components/molecules/ClaimCard';
import { ClaimDetailModal } from '../../components/organisms/ClaimDetailModal';
import { Complaint } from '../../types';

export const AdminClaimsScreen: React.FC = () => {
  const { complaints, updateComplaintStatus } = useApp();
  const [selectedClaim, setSelectedClaim] = useState<Complaint | null>(null);
  const [filter, setFilter] = useState<'Todos' | 'Pendiente' | 'En revisión' | 'Resuelto'>('Todos');

  const filteredComplaints =
    filter === 'Todos' ? complaints : complaints.filter((c) => c.estado === filter);

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>GESTIÓN Y AUDITORÍA DE RECLAMOS</Text>

      <View style={styles.filterRow}>
        {(['Todos', 'Pendiente', 'En revisión', 'Resuelto'] as const).map((f) => (
          <Pressable
            key={f}
            style={[styles.filterChip, filter === f && styles.filterChipActive]}
            onPress={() => setFilter(f)}
          >
            <Text
              style={[
                styles.filterChipText,
                filter === f && styles.filterChipTextActive,
              ]}
            >
              {f}
            </Text>
          </Pressable>
        ))}
      </View>

      {filteredComplaints.map((c) => (
        <ClaimCard
          key={c.id}
          claim={c}
          onPress={() => setSelectedClaim(c)}
        />
      ))}

      <ClaimDetailModal
        visible={!!selectedClaim}
        onClose={() => setSelectedClaim(null)}
        claim={selectedClaim}
        isAdmin
        onUpdateStatus={updateComplaintStatus}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 0.8,
    marginBottom: Spacing.sm,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: Spacing.md,
  },
  filterChip: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: Radius.pill,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  filterChipTextActive: {
    color: Colors.textInverse,
    fontWeight: '800',
  },
});
