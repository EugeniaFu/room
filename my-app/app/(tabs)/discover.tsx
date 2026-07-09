import React, {
  useEffect,
  useState,
} from 'react';

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';

import Ionicons
from '@expo/vector-icons/Ionicons';

import api
from '@/src/services/api';

const { width } =
  Dimensions.get('window');

const PRIMARY =
  '#6C63FF';



export default function Discover() {

  const [matches, setMatches] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    loadMatches();

  }, []);

  const loadMatches =
    async () => {

      try {

        const response =
          await api.get('/matches');

        setMatches(response.data);

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);
      }
    };

  const renderItem =
    ({ item }: any) => {

      const profile =
        item.profile;


  const handleLike =
  async (userId: string) => {

    try {

      await api.post(
        `/matches/${userId}/like`
      );

      setMatches((prev) =>
        prev.filter(
          (item) => item.id !== userId
        )
      );

    } catch (error) {

      console.log(error);
    }
  };

const handleSkip =
  async (userId: string) => {

    try {

      await api.post(
        `/matches/${userId}/skip`
      );

      setMatches((prev) =>
        prev.filter(
          (item) => item.id !== userId
        )
      );

    } catch (error) {

      console.log(error);
    }
  };

      return (

        <View style={styles.card}>

          {/* IMAGE */}
          <View style={styles.imageContainer}>

            {profile?.avatarUrl ? (

              <Image
                source={{
                  uri:
                    profile.avatarUrl,
                }}
                style={styles.image}
              />

            ) : (

              <View
                style={
                  styles.placeholder
                }
              >

                <Ionicons
                  name="person"
                  size={90}
                  color="#9CA3AF"
                />

              </View>

            )}

            {/* COMPATIBILITY */}
            <View
              style={
                styles.compatibilityBadge
              }
            >

              <Ionicons
                name="flash"
                size={16}
                color="#fff"
              />

              <Text
                style={
                  styles.compatibilityText
                }
              >
                {item.compatibility}%
              </Text>

            </View>

          </View>

          {/* CONTENT */}
          <View style={styles.content}>

            <View style={styles.row}>

              <Text style={styles.name}>

                {profile?.name || 'Usuario'}

              </Text>

              {profile?.age && (

                <Text style={styles.age}>

                  {profile.age}

                </Text>

              )}

            </View>

            {profile?.university && (

              <View style={styles.infoRow}>

                <Ionicons
                  name="school-outline"
                  size={16}
                  color="#6B7280"
                />

                <Text style={styles.infoText}>

                  {profile.university}

                </Text>

              </View>

            )}

            {profile?.city && (

              <View style={styles.infoRow}>

                <Ionicons
                  name="location-outline"
                  size={16}
                  color="#6B7280"
                />

                <Text style={styles.infoText}>

                  {profile.city}

                </Text>

              </View>

            )}

            {profile?.bio && (

              <Text style={styles.bio}>

                {profile.bio}

              </Text>

            )}

            {/* INTERESTS */}
            <View style={styles.interestsContainer}>

              {profile?.interests?.map(
                (
                  interest: string,
                  index: number
                ) => (

                  <View
                    key={index}
                    style={
                      styles.interestBadge
                    }
                  >

                    <Text
                      style={
                        styles.interestText
                      }
                    >

                      {interest}

                    </Text>

                  </View>

                )
              )}

            </View>

            {/* BUTTONS */}
            <View style={styles.actions}>

              <TouchableOpacity
                style={styles.rejectButton}
                onPress={() =>
                    handleSkip(item.id)
                }
                >

                <Ionicons
                  name="close"
                  size={28}
                  color="#EF4444"
                />

              </TouchableOpacity>

              <TouchableOpacity
            style={styles.likeButton}
            onPress={() =>
                handleLike(item.id)
            }
            >

                <Ionicons
                  name="heart"
                  size={28}
                  color="#fff"
                />

              </TouchableOpacity>

            </View>

          </View>

        </View>

      );
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

      {/* HEADER */}
      <View style={styles.header}>

        <Text style={styles.title}>
          Descubrir
        </Text>

        <TouchableOpacity
          style={styles.filterButton}
        >

          <Ionicons
            name="options-outline"
            size={24}
            color="#111827"
          />

        </TouchableOpacity>

      </View>

      <FlatList
        data={matches}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{
          paddingBottom: 100,
        }}
        showsVerticalScrollIndicator={false}
      />

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#111827',
  },

  filterButton: {
    width: 50,
    height: 50,
    borderRadius: 18,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },

  card: {
    width: width - 30,
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 30,
    overflow: 'hidden',
    marginBottom: 25,
  },

  imageContainer: {
    position: 'relative',
  },

  image: {
    width: '100%',
    height: 340,
  },

  placeholder: {
    width: '100%',
    height: 340,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },

  compatibilityBadge: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: PRIMARY,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },

  compatibilityText: {
    color: '#fff',
    fontWeight: '700',
    marginLeft: 6,
  },

  content: {
    padding: 22,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  name: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111827',
  },

  age: {
    marginLeft: 10,
    fontSize: 20,
    color: '#6B7280',
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },

  infoText: {
    marginLeft: 8,
    color: '#6B7280',
  },

  bio: {
    marginTop: 16,
    color: '#374151',
    lineHeight: 22,
    fontSize: 15,
  },

  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 18,
  },

  interestBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },

  interestText: {
    color: PRIMARY,
    fontWeight: '600',
  },

  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
  },

  rejectButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 25,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },

  likeButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
  },

});