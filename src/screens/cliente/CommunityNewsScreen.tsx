import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { Colors, Radius, Spacing } from '../../theme/colors';
import { useApp } from '../../context/AppContext';
import { SvgIcon } from '../../components/atoms/SvgIcon';
import { Badge } from '../../components/atoms/Badge';

export const CommunityNewsScreen: React.FC = () => {
  const { newsList, addNews, currentUser } = useApp();
  const [filter, setFilter] = useState<string>('Todas');
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const [title, setTitle] = useState<string>('');
  const [summary, setSummary] = useState<string>('');
  const [category, setCategory] = useState<'Aviso Oficial' | 'Cronograma' | 'Seguridad' | 'Vecinal'>('Vecinal');

  const filteredNews =
    filter === 'Todas'
      ? newsList
      : newsList.filter((n) => n.categoria === filter);

  const handlePublish = () => {
    if (!title.trim() || !summary.trim()) {
      Alert.alert('Datos requeridos', 'Por favor complete el título y detalle del comunicado.');
      return;
    }

    addNews({
      titulo: title.trim(),
      resumen: summary.trim(),
      categoria: category,
      fecha: 'Hace un momento',
      autor: currentUser.full_name,
    });

    setTitle('');
    setSummary('');
    setModalVisible(false);
    Alert.alert('Publicación Exitosa', 'Tu comunicado ha sido publicado para los vecinos de la zona.');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Encabezado con Botón + Publicar */}
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.mainTitle}>Noticias y Novedades</Text>
          <Text style={styles.subtitle}>
            Comunicados oficiales de YPFB/ANH y avisos vecinales
          </Text>
        </View>
        <Pressable
          style={styles.publishBtn}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.publishBtnText}>+ Publicar</Text>
        </Pressable>
      </View>

      {/* Filtros de Categoría */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersScroll}
        contentContainerStyle={styles.filtersContainer}
      >
        {['Todas', 'Aviso Oficial', 'Vecinal', 'Seguridad'].map((cat) => (
          <Pressable
            key={cat}
            style={[
              styles.filterChip,
              filter === cat && styles.filterChipActive,
            ]}
            onPress={() => setFilter(cat)}
          >
            <Text
              style={[
                styles.filterText,
                filter === cat && styles.filterTextActive,
              ]}
            >
              {cat}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Lista de Noticias */}
      <View style={styles.newsList}>
        {filteredNews.map((item) => {
          const isOfficial = item.categoria === 'Aviso Oficial';
          return (
            <View key={item.id} style={styles.newsCard}>
              <View style={styles.cardHeader}>
                <Badge
                  label={item.categoria}
                  variant={
                    isOfficial
                      ? 'info'
                      : item.categoria === 'Seguridad'
                      ? 'warning'
                      : 'success'
                  }
                  size="sm"
                />
                <Text style={styles.dateText}>{item.fecha}</Text>
              </View>

              <Text style={styles.newsTitle}>{item.titulo}</Text>
              <Text style={styles.newsSummary}>{item.resumen}</Text>

              <View style={styles.cardFooter}>
                <View style={styles.authorRow}>
                  <SvgIcon
                    name={isOfficial ? 'shieldCheck' : 'user'}
                    size={14}
                    color={isOfficial ? Colors.accentBlue : Colors.textMuted}
                  />
                  <Text style={styles.authorText}>
                    {item.autor || 'Agencia Nacional de Hidrocarburos'}
                  </Text>
                </View>
                <View style={styles.likesRow}>
                  <SvgIcon name="check" size={14} color={Colors.success} />
                  <Text style={styles.likesCount}>{item.likes || 12} confirmaron</Text>
                </View>
              </View>
            </View>
          );
        })}
      </View>

      {/* Modal para Publicar Nuevo Comunicado */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Publicar Aviso Comunitario</Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <SvgIcon name="close" size={20} color={Colors.textSecondary} />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.inputLabel}>Título del Comunicado</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Ej. Camión pasando por Calle 18 Los Pinos"
                placeholderTextColor={Colors.textMuted}
                value={title}
                onChangeText={setTitle}
              />

              <Text style={styles.inputLabel}>Categoría</Text>
              <View style={styles.categoryRow}>
                {(['Vecinal', 'Aviso Oficial', 'Seguridad'] as const).map((c) => (
                  <Pressable
                    key={c}
                    style={[
                      styles.categoryBtn,
                      category === c && styles.categoryBtnActive,
                    ]}
                    onPress={() => setCategory(c)}
                  >
                    <Text
                      style={[
                        styles.categoryBtnText,
                        category === c && styles.categoryBtnTextActive,
                      ]}
                    >
                      {c}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <Text style={styles.inputLabel}>Detalle / Mensaje</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                placeholder="Escribe la información detallada para que los vecinos estén al tanto..."
                placeholderTextColor={Colors.textMuted}
                multiline
                numberOfLines={4}
                value={summary}
                onChangeText={setSummary}
              />

              <Pressable style={styles.submitBtn} onPress={handlePublish}>
                <Text style={styles.submitBtnText}>Publicar Comunicado</Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: Spacing.xxl,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  publishBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md + 2,
    paddingVertical: 9,
    borderRadius: Radius.full,
  },
  publishBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  filtersScroll: {
    marginBottom: Spacing.md,
  },
  filtersContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: Radius.full,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  filterTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  newsList: {
    gap: Spacing.sm + 2,
  },
  newsCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.md + 2,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dateText: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  newsTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textPrimary,
    lineHeight: 20,
    marginBottom: 6,
  },
  newsSummary: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: Spacing.md,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 10,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  authorText: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  likesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  likesCount: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.success,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius.xxl,
    borderTopRightRadius: Radius.xxl,
    padding: Spacing.lg,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: 4,
    marginTop: 8,
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  textArea: {
    height: 90,
    textAlignVertical: 'top',
  },
  categoryRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 4,
  },
  categoryBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: Radius.md,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categoryBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  categoryBtnTextActive: {
    color: '#FFFFFF',
  },
  submitBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
