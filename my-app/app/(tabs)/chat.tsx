import React, {
  useEffect,
  useState,
  useCallback,
} from 'react';

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';

import Ionicons
from '@expo/vector-icons/Ionicons';

import { router }
from 'expo-router';

import api
from '@/src/services/api';

const PRIMARY = '#6C63FF';

export default function Chat() {

  const [conversations, setConversations] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [search, setSearch] =
    useState('');

  useEffect(() => {

    loadConversations();

  }, []);

  const loadConversations =
    async (
      isRefresh = false
    ) => {

      try {

        if (!isRefresh) {
          setLoading(true);
        }

        const response =
          await api.get(
            '/conversations'
          );

        setConversations(
          response.data
        );

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);
        setRefreshing(false);
      }
    };

  // RELOAD / PULL TO REFRESH
  const onRefresh =
    useCallback(() => {

      setRefreshing(true);

      loadConversations(true);

    }, []);

  const filteredConversations =
    conversations.filter(
      (conversation) => {

        const name =
          conversation.otherUser
            ?.profile?.name
            ?.toLowerCase() || '';

        return name.includes(
          search.toLowerCase()
        );
      }
    );

  // OBTENER INICIAL
  const getInitial =
    (name: string = '') => {

      return name
        ?.trim()
        ?.charAt(0)
        ?.toUpperCase();
    };

  // COMPONENTE AVATAR
  const Avatar =
    ({
      avatarUrl,
      name,
    }: any) => {

      if (avatarUrl) {

        return (

          <Image
            source={{
              uri: avatarUrl
            }}
            style={styles.avatar}
          />

        );
      }

      return (

        <View
          style={
            styles.avatarFallback
          }
        >

          <Text
            style={
              styles.avatarLetter
            }
          >

            {getInitial(name)}

          </Text>

        </View>

      );
    };

  const renderItem = ({ item }: any) => {

    const user =
      item.otherUser;

    const avatar =
      user?.profile?.avatarUrl;

    const name =
      user?.profile?.name ||
      'Usuario';

    return (

      <TouchableOpacity
        style={styles.chatCard}
        onPress={() => {

          router.push({
            pathname:
              '/(chat)/messages/[id]',
            params: {
              id: item.id,
            },
          });

        }}
      >

        {/* AVATAR */}
        <View style={styles.avatarContainer}>

          <Avatar
            avatarUrl={avatar}
            name={name}
          />

        </View>

        {/* CONTENT */}
        <View style={styles.chatContent}>

          <View style={styles.rowBetween}>

            <Text style={styles.name}>

              {name}

            </Text>

          </View>

          <Text
            style={styles.message}
            numberOfLines={1}
          >

            {
              item.lastMessage ||
              'Sin mensajes'
            }

          </Text>

          {item.listing && (

            <View style={styles.listingTag}>
              <Ionicons
                name="home-outline"
                size={11}
                color="#6C63FF"
              />
              <Text
                style={styles.listingTagText}
                numberOfLines={1}
              >
                {item.listing.title}
              </Text>
            </View>

          )}

        </View>

      </TouchableOpacity>
    );
  };

  return (

    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>

        <View>

          <Text style={styles.title}>
            Mensajes
          </Text>

          <Text style={styles.subtitle}>
            Conversaciones recientes
          </Text>

        </View>

        {/* BOTON RELOAD */}
        <TouchableOpacity
          style={
            styles.notificationButton
          }
          onPress={() =>
            loadConversations(true)
          }
        >

          <Ionicons
            name="refresh"
            size={24}
            color="#111827"
          />

        </TouchableOpacity>

      </View>

      {/* SEARCH */}
      <View
        style={
          styles.searchContainer
        }
      >

        <Ionicons
          name="search"
          size={20}
          color="#9CA3AF"
        />

        <TextInput
          placeholder="Buscar conversación..."
          placeholderTextColor="#9CA3AF"
          style={styles.input}
          value={search}
          onChangeText={setSearch}
        />

      </View>

      {/* LOADING */}
      {loading && (

        <ActivityIndicator
          size="large"
          color={PRIMARY}
          style={{
            marginTop: 40
          }}
        />

      )}

      {/* EMPTY */}
      {!loading &&
        filteredConversations.length === 0 && (

        <View style={styles.emptyBox}>

          <Ionicons
            name="chatbubble-outline"
            size={60}
            color="#9CA3AF"
          />

          <Text style={styles.emptyText}>
            No tienes conversaciones
          </Text>

        </View>

      )}

      {/* CHAT LIST */}
      {!loading && (

        <FlatList
          data={filteredConversations}
          keyExtractor={(item) =>
            String(item.id)
          }
          renderItem={renderItem}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: 120,
          }}
          showsVerticalScrollIndicator={false}

          // RELOAD PULL DOWN
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[PRIMARY]}
              tintColor={PRIMARY}
            />
          }
        />

      )}

      {/* FLOAT BUTTON */}
      <TouchableOpacity
        style={styles.floatingButton}
      >

        <Ionicons
          name="chatbubble-ellipses"
          size={26}
          color="#fff"
        />

      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },

  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },

  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#111827',
  },

  subtitle: {
    marginTop: 4,
    color: '#6B7280',
    fontSize: 14,
  },

  notificationButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },

  searchContainer: {
    marginHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    height: 58,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },

  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: '#111827',
  },

  chatCard: {
    backgroundColor: '#fff',
    borderRadius: 22,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },

  avatarContainer: {
    position: 'relative',
  },

  avatar: {
    width: 62,
    height: 62,
    borderRadius: 31,
  },

  // NUEVO AVATAR CON INICIAL
  avatarFallback: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarLetter: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '800',
  },

  chatContent: {
    flex: 1,
    marginLeft: 15,
  },

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },

  message: {
    marginTop: 8,
    color: '#6B7280',
    fontSize: 14,
    marginRight: 10,
  },

  listingTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 6,
  },

  listingTagText: {
    color: '#6C63FF',
    fontSize: 11,
    fontWeight: '700',
    flexShrink: 1,
  },

  floatingButton: {
    position: 'absolute',
    bottom: 35,
    right: 25,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: PRIMARY,
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },

  emptyBox: {
    alignItems: 'center',
    marginTop: 120,
  },

  emptyText: {
    marginTop: 12,
    color: '#6B7280',
    fontSize: 15,
  },

});