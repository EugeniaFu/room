import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';

import { router, useFocusEffect } from 'expo-router';

import api from '@/src/services/api';

import { useAuth } from '@/src/context/AuthContext';

type PendingListing = {
  id: string;
  title: string;
  price: number;
  coverImage?: string | null;
  images?: { url: string }[];
  createdAt: string;
  owner?: {
    email: string;
    profile?: { name?: string } | null;
  };
};

type PendingUser = {
  id: string;
  email: string;
  createdAt: string;
  profile?: { name?: string; avatarUrl?: string } | null;
  documents: { id: string; type: string; url: string; status: string }[];
};

const DOCUMENT_LABELS: Record<string, string> = {
  INE: 'INE',
  FOTO: 'Selfie',
  COMPROBANTE_DOMICILIO: 'Comprobante domicilio',
  CREDENCIAL_ESTUDIANTE: 'Credencial estudiante',
  CURP: 'CURP',
  TELEFONO: 'Teléfono',
  ACTA_NACIMIENTO: 'Acta de nacimiento',
};

export default function Panel() {

  const { logout } = useAuth();

  const [activeTab, setActiveTab] = useState<'listings' | 'users'>('listings');

  const [pendingListings, setPendingListings] = useState<PendingListing[]>([]);
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [decidingId, setDecidingId] = useState<string | null>(null);

  const loadAll = useCallback(async () => {

    try {

      const [listingsRes, usersRes] = await Promise.all([
        api.get('/listings/pending'),
        api.get('/profile/verifications/pending'),
      ]);

      setPendingListings(listingsRes.data);
      setPendingUsers(usersRes.data);

    } catch (err: any) {

      console.log(err.response?.data || err);

      Alert.alert(
        'Error',
        'No se pudo cargar la información pendiente'
      );

    } finally {

      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadAll();
    }, [loadAll])
  );

  const handleReviewListing = async (
    listingId: string,
    decision: 'APPROVED' | 'REJECTED'
  ) => {

    try {

      setDecidingId(listingId);

      await api.put(`/listings/${listingId}/review`, {
        decision,
      });

      setPendingListings((prev) =>
        prev.filter((item) => item.id !== listingId)
      );

    } catch (err: any) {

      console.log(err.response?.data || err);

      Alert.alert(
        'Error',
        err.response?.data?.error ||
          'No se pudo actualizar la publicación'
      );

    } finally {

      setDecidingId(null);
    }
  };

  const handleReviewUser = async (
    userId: string,
    decision: 'APPROVED' | 'REJECTED'
  ) => {

    try {

      setDecidingId(userId);

      await api.put(`/profile/verifications/${userId}`, {
        decision,
      });

      setPendingUsers((prev) =>
        prev.filter((item) => item.id !== userId)
      );

    } catch (err: any) {

      console.log(err.response?.data || err);

      Alert.alert(
        'Error',
        err.response?.data?.error ||
          'No se pudo actualizar la cuenta'
      );

    } finally {

      setDecidingId(null);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              loadAll();
            }}
          />
        }
      >

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Panel de Administración</Text>
          <Text style={styles.subtitle}>
            Revisa cuentas y publicaciones antes de que sean públicas
          </Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabsRow}>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'listings' && styles.tabActive]}
            onPress={() => setActiveTab('listings')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'listings' && styles.tabTextActive,
              ]}
            >
              Publicaciones ({pendingListings.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'users' && styles.tabActive]}
            onPress={() => setActiveTab('users')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'users' && styles.tabTextActive,
              ]}
            >
              Usuarios ({pendingUsers.length})
            </Text>
          </TouchableOpacity>

        </View>

        {loading && (
          <ActivityIndicator
            size="large"
            color="#6C63FF"
            style={{ marginTop: 20 }}
          />
        )}

        {/* PUBLICACIONES */}
        {!loading && activeTab === 'listings' && (

          <View style={styles.section}>

            {pendingListings.length === 0 && (
              <Text style={styles.emptyText}>
                No hay publicaciones esperando revisión.
              </Text>
            )}

            {pendingListings.map((listing) => (

              <View key={listing.id} style={styles.card}>

                {(listing.coverImage || listing.images?.[0]?.url) && (
                  <Image
                    source={{
                      uri:
                        listing.coverImage ||
                        listing.images?.[0]?.url,
                    }}
                    style={styles.cardImage}
                  />
                )}

                <View style={styles.cardInfo}>

                  <Text style={styles.cardTitle}>
                    {listing.title}
                  </Text>

                  <Text style={styles.cardMeta}>
                    ${listing.price} · {listing.owner?.profile?.name || listing.owner?.email}
                  </Text>

                  <View style={styles.actionsRow}>

                    <TouchableOpacity
                      style={[styles.reviewButton, styles.approveButton]}
                      disabled={decidingId === listing.id}
                      onPress={() => handleReviewListing(listing.id, 'APPROVED')}
                    >
                      <Text style={styles.reviewButtonText}>
                        {decidingId === listing.id ? '...' : 'Aprobar'}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.reviewButton, styles.rejectButton]}
                      disabled={decidingId === listing.id}
                      onPress={() => handleReviewListing(listing.id, 'REJECTED')}
                    >
                      <Text style={styles.reviewButtonText}>
                        {decidingId === listing.id ? '...' : 'Rechazar'}
                      </Text>
                    </TouchableOpacity>

                  </View>

                </View>

              </View>

            ))}

          </View>

        )}

        {/* USUARIOS */}
        {!loading && activeTab === 'users' && (

          <View style={styles.section}>

            {pendingUsers.length === 0 && (
              <Text style={styles.emptyText}>
                No hay cuentas esperando verificación.
              </Text>
            )}

            {pendingUsers.map((pendingUser) => (

              <View key={pendingUser.id} style={styles.userCard}>

                <View style={styles.userHeader}>

                  <Image
                    source={{
                      uri:
                        pendingUser.profile?.avatarUrl ||
                        'https://i.pravatar.cc/300',
                    }}
                    style={styles.avatar}
                  />

                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardTitle}>
                      {pendingUser.profile?.name || 'Sin nombre'}
                    </Text>
                    <Text style={styles.cardMeta}>
                      {pendingUser.email}
                    </Text>
                  </View>

                </View>

                {pendingUser.documents.length === 0 && (
                  <Text style={styles.noDocsText}>
                    Aún no ha subido documentos.
                  </Text>
                )}

                {pendingUser.documents.length > 0 && (

                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={{ marginTop: 10 }}
                  >

                    {pendingUser.documents.map((doc) => (

                      <View key={doc.id} style={styles.docPreview}>
                        <Image
                          source={{ uri: doc.url }}
                          style={styles.docImage}
                        />
                        <Text style={styles.docLabel}>
                          {DOCUMENT_LABELS[doc.type] || doc.type}
                        </Text>
                      </View>

                    ))}

                  </ScrollView>

                )}

                <View style={styles.actionsRow}>

                  <TouchableOpacity
                    style={[styles.reviewButton, styles.approveButton]}
                    disabled={decidingId === pendingUser.id}
                    onPress={() => handleReviewUser(pendingUser.id, 'APPROVED')}
                  >
                    <Text style={styles.reviewButtonText}>
                      {decidingId === pendingUser.id ? '...' : 'Aprobar cuenta'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.reviewButton, styles.rejectButton]}
                    disabled={decidingId === pendingUser.id}
                    onPress={() => handleReviewUser(pendingUser.id, 'REJECTED')}
                  >
                    <Text style={styles.reviewButtonText}>
                      {decidingId === pendingUser.id ? '...' : 'Rechazar'}
                    </Text>
                  </TouchableOpacity>

                </View>

              </View>

            ))}

          </View>

        )}

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6FB',
    marginTop: 40,
  },

  content: {
    padding: 20,
  },

  header: {
    marginBottom: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },

  subtitle: {
    fontSize: 14,
    color: '#777',
    marginTop: 5,
  },

  tabsRow: {
    flexDirection: 'row',
    backgroundColor: '#E5E7EB',
    borderRadius: 14,
    padding: 4,
    marginBottom: 20,
  },

  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },

  tabActive: {
    backgroundColor: '#fff',
  },

  tabText: {
    color: '#6B7280',
    fontWeight: '700',
    fontSize: 13,
  },

  tabTextActive: {
    color: '#111827',
  },

  section: {
    marginTop: 5,
  },

  emptyText: {
    color: '#888',
    fontSize: 14,
  },

  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 12,
    marginBottom: 14,

    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },

  cardImage: {
    width: 76,
    height: 76,
    borderRadius: 14,
    marginRight: 12,
    backgroundColor: '#eee',
  },

  cardInfo: {
    flex: 1,
    justifyContent: 'center',
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },

  cardMeta: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
  },

  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },

  reviewButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
  },

  approveButton: {
    backgroundColor: '#22C55E',
  },

  rejectButton: {
    backgroundColor: '#EF4444',
  },

  reviewButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },

  userCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 14,
    marginBottom: 14,

    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },

  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 100,
    backgroundColor: '#eee',
  },

  noDocsText: {
    marginTop: 10,
    fontSize: 13,
    color: '#DC2626',
  },

  docPreview: {
    marginRight: 12,
    alignItems: 'center',
  },

  docImage: {
    width: 84,
    height: 84,
    borderRadius: 12,
    backgroundColor: '#eee',
  },

  docLabel: {
    marginTop: 4,
    fontSize: 11,
    color: '#6B7280',
    maxWidth: 84,
    textAlign: 'center',
  },

  logoutButton: {
    marginTop: 10,
    marginBottom: 30,
    alignItems: 'center',
    paddingVertical: 14,
  },

  logoutText: {
    color: '#EF4444',
    fontWeight: '700',
    fontSize: 14,
  },
});
