import React, {
  useCallback,
  useState,
} from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';

import { router, useFocusEffect } from 'expo-router';

import Ionicons from '@expo/vector-icons/Ionicons';

import * as ImagePicker from 'expo-image-picker';

import { useAuth } from '@/src/context/AuthContext';

import api from '@/src/services/api';

const PRIMARY = '#6C63FF';

type Document = {
  id: string;
  type: string;
  url: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
};

const REQUIRED_DOCUMENTS = [
  {
    type: 'INE',
    label: 'INE (identificación oficial)',
    icon: 'card-outline' as const,
  },
  {
    type: 'FOTO',
    label: 'Selfie sosteniendo tu INE',
    icon: 'camera-outline' as const,
  },
  {
    type: 'COMPROBANTE_DOMICILIO',
    label: 'Comprobante de domicilio',
    icon: 'home-outline' as const,
  },
  {
    type: 'CREDENCIAL_ESTUDIANTE',
    label: 'Credencial de estudiante (si aplica)',
    icon: 'school-outline' as const,
  },
];

const STATUS_LABELS: Record<
  string,
  { label: string; color: string }
> = {
  PENDING: { label: 'En revisión', color: '#F59E0B' },
  APPROVED: { label: 'Aprobado', color: '#16A34A' },
  REJECTED: { label: 'Rechazado', color: '#DC2626' },
};

export default function VerificationDocuments() {

  const { user } = useAuth();

  const [documents, setDocuments] = useState<Document[]>([]);

  const [loading, setLoading] = useState(true);

  const [uploadingType, setUploadingType] = useState<string | null>(null);

  const accountStatus = user?.verificationStatus || 'PENDING';

  const loadDocuments = useCallback(async () => {

    try {

      const response = await api.get('/profile/documents/me');

      setDocuments(response.data);

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadDocuments();
    }, [loadDocuments])
  );

  const getDocument = (type: string) =>
    documents.find((doc) => doc.type === type);

  const handleUpload = async (type: string) => {

    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {

      Alert.alert(
        'Permiso requerido',
        'Debes permitir acceso a tus fotos'
      );

      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (result.canceled) return;

    try {

      setUploadingType(type);

      const formData = new FormData();

      formData.append('type', type);

      formData.append('document', {
        uri: result.assets[0].uri,
        name: `${type.toLowerCase()}.jpg`,
        type: 'image/jpeg',
      } as any);

      await api.post('/profile/documents', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      await loadDocuments();

      Alert.alert('Listo', 'Documento subido, quedó pendiente de revisión');

    } catch (err: any) {

      console.log(err.response?.data || err);

      Alert.alert(
        'Error',
        err.response?.data?.error || 'No se pudo subir el documento'
      );

    } finally {

      setUploadingType(null);
    }
  };

  if (loading) {

    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={PRIMARY} />
      </View>
    );
  }

  return (

    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* HEADER */}
      <View style={styles.header}>

        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#111827" />
        </TouchableOpacity>

        <Text style={styles.title}>Verificación de cuenta</Text>

        <View style={styles.rowBetween}>

          <Text style={styles.subtitle}>
            Sube tus documentos para que un administrador valide tu cuenta.
          </Text>

          <View
            style={[
              styles.accountBadge,
              { backgroundColor: STATUS_LABELS[accountStatus]?.color },
            ]}
          >
            <Text style={styles.accountBadgeText}>
              {STATUS_LABELS[accountStatus]?.label || accountStatus}
            </Text>
          </View>

        </View>

      </View>

      {/* DOCUMENTOS */}
      <View style={styles.card}>

        {REQUIRED_DOCUMENTS.map((item) => {

          const document = getDocument(item.type);

          return (

            <View key={item.type} style={styles.docRow}>

              {document?.url ? (
                <Image
                  source={{ uri: document.url }}
                  style={styles.docThumbnail}
                />
              ) : (
                <View style={styles.docPlaceholder}>
                  <Ionicons name={item.icon} size={24} color={PRIMARY} />
                </View>
              )}

              <View style={styles.docInfo}>

                <Text style={styles.docLabel}>{item.label}</Text>

                {document && (
                  <View
                    style={[
                      styles.docStatus,
                      {
                        backgroundColor:
                          STATUS_LABELS[document.status]?.color,
                      },
                    ]}
                  >
                    <Text style={styles.docStatusText}>
                      {STATUS_LABELS[document.status]?.label}
                    </Text>
                  </View>
                )}

              </View>

              <TouchableOpacity
                style={styles.uploadButton}
                disabled={uploadingType === item.type}
                onPress={() => handleUpload(item.type)}
              >
                <Text style={styles.uploadButtonText}>
                  {uploadingType === item.type
                    ? '...'
                    : document
                    ? 'Reemplazar'
                    : 'Subir'}
                </Text>
              </TouchableOpacity>

            </View>

          );
        })}

      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F4F6FB',
  },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    marginBottom: 20,
  },

  title: {
    marginTop: 15,
    fontSize: 26,
    fontWeight: '800',
    color: '#111827',
  },

  subtitle: {
    marginTop: 8,
    fontSize: 13,
    color: '#6B7280',
    flex: 1,
    marginRight: 10,
  },

  rowBetween: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 6,
  },

  accountBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  accountBadgeText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },

  card: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 24,
    padding: 16,
    marginBottom: 40,
  },

  docRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },

  docThumbnail: {
    width: 52,
    height: 52,
    borderRadius: 12,
    marginRight: 12,
  },

  docPlaceholder: {
    width: 52,
    height: 52,
    borderRadius: 12,
    marginRight: 12,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  docInfo: {
    flex: 1,
  },

  docLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },

  docStatus: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginTop: 6,
  },

  docStatusText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },

  uploadButton: {
    backgroundColor: PRIMARY,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
  },

  uploadButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },
});
