import React, {
  useEffect,
  useState,
} from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';

import Ionicons
from '@expo/vector-icons/Ionicons';

import api
from '@/src/services/api';

const PRIMARY = '#6C63FF';

export default function Requests() {

  const [requests, setRequests] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    loadRequests();

  }, []);

  const loadRequests =
    async () => {

      try {

        const response =
          await api.get(
            '/connection-requests/received'
          );

        setRequests(
          response.data
        );

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);
      }
    };

  const handleAction =
    async (
      id: string,
      action: 'accept' | 'reject'
    ) => {

      try {

        await api.put(
          `/connection-requests/${id}/${action}`
        );

        Alert.alert(
          action === 'accept'
            ? 'Solicitud aceptada'
            : 'Solicitud rechazada'
        );

        setRequests((prev) =>
          prev.filter(
            (r) => r.id !== id
          )
        );

      } catch (error: any) {

        Alert.alert(
          'Error',
          error?.response?.data?.error ||
          'Ocurrió un error'
        );
      }
    };

  if (loading) {

    return (

      <View style={styles.loader}>

        <ActivityIndicator
          size="large"
          color={PRIMARY}
        />

      </View>
    );
  }

  return (

    <View style={styles.container}>

      <Text style={styles.title}>
        Solicitudes
      </Text>

      {requests.length === 0 ? (

        <View style={styles.emptyBox}>

          <Ionicons
            name="mail-open-outline"
            size={60}
            color="#9CA3AF"
          />

          <Text style={styles.emptyText}>
            No tienes solicitudes
          </Text>

        </View>

      ) : (

        <FlatList
          data={requests}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            paddingBottom: 30,
          }}
          renderItem={({ item }) => {

            const avatar =
              item.sender?.profile?.avatarUrl;

            return (

              <View style={styles.card}>

                {/* Avatar */}
                {avatar ? (

                  <Image
                    source={{
                      uri: avatar,
                    }}
                    style={styles.avatar}
                  />

                ) : (

                  <View style={styles.avatarPlaceholder}>

                    <Ionicons
                      name="person"
                      size={28}
                      color="#6B7280"
                    />

                  </View>

                )}

                {/* Info */}
                <View style={{
                  flex: 1
                }}>

                  <Text style={styles.name}>

                    {
                      item.sender?.profile?.name ||
                      'Usuario'
                    }

                  </Text>

                  <Text style={styles.bio}>
                    {
                      item.sender?.profile?.bio ||
                      'Sin biografía'
                    }
                  </Text>

                </View>

                {/* Actions */}
                <View style={styles.actions}>

                  <TouchableOpacity
                    style={styles.acceptButton}
                    onPress={() =>
                      handleAction(
                        item.id,
                        'accept'
                      )
                    }
                  >

                    <Ionicons
                      name="checkmark"
                      size={20}
                      color="#fff"
                    />

                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.rejectButton}
                    onPress={() =>
                      handleAction(
                        item.id,
                        'reject'
                      )
                    }
                  >

                    <Ionicons
                      name="close"
                      size={20}
                      color="#fff"
                    />

                  </TouchableOpacity>

                </View>

              </View>
            );
          }}
        />

      )}

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
    paddingTop: 60,
    paddingHorizontal: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 25,
  },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyBox: {
    marginTop: 120,
    alignItems: 'center',
  },

  emptyText: {
    marginTop: 12,
    color: '#6B7280',
    fontSize: 15,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 65,
    height: 65,
    borderRadius: 100,
    marginRight: 15,
  },

  avatarPlaceholder: {
    width: 65,
    height: 65,
    borderRadius: 100,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },

  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },

  bio: {
    marginTop: 4,
    color: '#6B7280',
    fontSize: 13,
  },

  actions: {
    flexDirection: 'row',
    gap: 10,
  },

  acceptButton: {
    backgroundColor: '#10B981',
    width: 42,
    height: 42,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },

  rejectButton: {
    backgroundColor: '#EF4444',
    width: 42,
    height: 42,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },

});