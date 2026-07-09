import React, {
  useEffect,
  useState,
} from 'react';

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

import Ionicons from '@expo/vector-icons/Ionicons';

import { router } from 'expo-router';

import { useAuth } from '@/src/context/AuthContext';

import api from '@/src/services/api';

import * as ImagePicker
from 'expo-image-picker';

import { Image } from 'react-native';

export default function Profile() {

  const { user, logout } = useAuth();

  const [loading, setLoading] = useState(true);

  const [profileExists, setProfileExists] =
    useState(false);

  const [name, setName] = useState('');

  const [bio, setBio] = useState('');

  const [age, setAge] = useState('');

  const [gender, setGender] = useState('');

  const [university, setUniversity] =
    useState('');

  const [avatar, setAvatar] =
  useState('');

  const email = user?.email || '';

  const verificationStatus =
    user?.verificationStatus || 'PENDING';

  const roles =
    user?.roles?.map(
      (r: any) => r.role.name
    ) || [];

  const isRoomie = roles.includes('roomie');

  const isHost = roles.includes('host');

  useEffect(() => {

    loadProfile();

  }, []);

  const loadProfile = async () => {

    try {

      const response =
        await api.get('/profile/me');

      if (response.data) {

        setProfileExists(true);

        setName(
          response.data.name || ''
        );

        setBio(
          response.data.bio || ''
        );

        setAge(
          response.data.age?.toString() || ''
        );

        setGender(
          response.data.gender || ''
        );

        setUniversity(
          response.data.university || ''
        );
        setAvatar(
          response.data.avatarUrl || ''
        );
      }

    } catch (error: any) {

      // si no existe perfil
      setProfileExists(false);

    } finally {

      setLoading(false);
    }
  };

  const pickAvatar =
  async () => {

    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {

      alert(
        'Permiso requerido'
      );

      return;
    }

    const result =
      await ImagePicker.launchImageLibraryAsync({

        mediaTypes: ['images'],

        allowsEditing: true,

        aspect: [1, 1],

        quality: 0.7,
      });

    if (result.canceled)
      return;

    try {

      const image =
        result.assets[0];

      const formData =
        new FormData();

        formData.append(
          'avatar',
          {
            uri: image.uri,
            name: 'avatar.jpg',
            type: 'image/jpeg',
          } as any
        );

      const response =
        await api.post(
          '/profile/avatar',
          formData,
          {
            headers: {
              'Content-Type':
                'multipart/form-data',
            },
          }
        );

      setAvatar(
        response.data.avatarUrl
      );

      alert(
        'Avatar actualizado'
      );

    } catch (error) {

      console.log(error);

      alert(
        'Error subiendo avatar'
      );
    }
  };

  const handleSave = async () => {

    try {

      const payload = {
        name,
        bio,
        age: age ? Number(age) : null,
        gender,
        university,
      };

      if (profileExists) {

        await api.put(
          '/profile',
          payload
        );

      } else {

        await api.post(
          '/profile',
          payload
        );

        setProfileExists(true);
      }

      alert('Perfil guardado');

    } catch (error: any) {

      alert(
        error?.response?.data?.error ||
        'Error al guardar'
      );
    }
  };

  const handleLogout = async () => {

    await logout();

    router.dismissAll();

    router.replace('/(auth)/login');
  };

  if (loading) {

    return (

      <View style={styles.loaderContainer}>

        <ActivityIndicator
          size="large"
          color={PRIMARY}
        />

      </View>
    );
  }

  return (

    <ScrollView style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>

        <Text style={styles.title}>
          Perfil
        </Text>

        <Text style={styles.subtitle}>
          Administra tu información
        </Text>

      </View>

      <View style={styles.avatarContainer}>

        <TouchableOpacity
          onPress={pickAvatar}
        >

          <Image
            source={{
              uri:
                avatar ||
                'https://i.pravatar.cc/300',
            }}
            style={styles.avatar}
          />

          <View style={styles.editBadge}>

            <Ionicons
              name="camera"
              size={16}
              color="#fff"
            />

          </View>

        </TouchableOpacity>

      </View>

      {/* FORM */}
      <View style={styles.card}>

        <Text style={styles.sectionTitle}>
          Información personal
        </Text>

        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Nombre completo"
        />

        <TextInput
          style={styles.input}
          value={email}
          editable={false}
          placeholder="Correo"
        />

        <TextInput
          style={styles.input}
          value={age}
          onChangeText={setAge}
          placeholder="Edad"
          keyboardType="numeric"
        />

        <TextInput
          style={styles.input}
          value={gender}
          onChangeText={setGender}
          placeholder="Género"
        />

        <TextInput
          style={styles.input}
          value={university}
          onChangeText={setUniversity}
          placeholder="Universidad"
        />

        <TextInput
          style={[
            styles.input,
            styles.textArea
          ]}
          value={bio}
          onChangeText={setBio}
          placeholder="Biografía"
          multiline
        />

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
        >

          <Ionicons
            name="save"
            size={18}
            color="#fff"
          />

          <Text style={styles.saveButtonText}>
            Guardar perfil
          </Text>

        </TouchableOpacity>

      </View>

      {/* ROLES */}
      <View style={styles.card}>

        <Text style={styles.sectionTitle}>
          Roles activos
        </Text>

        {isRoomie && (
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>
              ROOMIE
            </Text>
          </View>
        )}

        {isHost && (
          <View
            style={[
              styles.roleBadge,
              {
                backgroundColor: '#DBEAFE'
              }
            ]}
          >
            <Text
              style={[
                styles.roleText,
                {
                  color: '#2563EB'
                }
              ]}
            >
              ANFITRIÓN
            </Text>
          </View>
        )}

      </View>

      {/* VERIFICACIÓN */}
      <View style={styles.card}>

        <View style={styles.rowBetween}>

          <Text style={styles.sectionTitle}>
            Verificación
          </Text>

          <View style={styles.badge}>

            <Text style={styles.badgeText}>
              {verificationStatus}
            </Text>

          </View>

        </View>

        <Text style={styles.infoText}>
          Verifica tu identidad para
          aumentar la confianza dentro
          de la plataforma.
        </Text>

      </View>

      {/* LOGOUT */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
      >

        <Ionicons
          name="log-out-outline"
          size={18}
          color="#fff"
        />

        <Text style={styles.logoutText}>
          Cerrar sesión
        </Text>

      </TouchableOpacity>

    </ScrollView>
  );
}

const PRIMARY = '#6C63FF';

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },

  loaderContainer: {
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
    fontSize: 32,
    fontWeight: '800',
    color: '#111827',
  },

  subtitle: {
    marginTop: 5,
    fontSize: 14,
    color: '#6B7280',
  },

  card: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },

  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 12,
    fontSize: 14,
    color: '#111827',
  },

  textArea: {
    height: 90,
    textAlignVertical: 'top',
  },

  saveButton: {
    backgroundColor: PRIMARY,
    borderRadius: 14,
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginTop: 5,
  },

  saveButtonText: {
    color: '#fff',
    fontWeight: '700',
  },

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  badge: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },

  infoText: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 10,
  },

  roleBadge: {
    backgroundColor: '#DCFCE7',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },

  roleText: {
    color: '#16A34A',
    fontWeight: '700',
  },

  logoutButton: {
    backgroundColor: '#EF4444',
    marginHorizontal: 35,
    marginBottom: 40,
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },

  logoutText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  avatarContainer: {
  alignItems: 'center',
  marginBottom: 20,
},

avatar: {
  width: 120,
  height: 120,
  borderRadius: 100,
},
editBadge: {
  position: 'absolute',
  right: 0,
  bottom: 0,
  backgroundColor: PRIMARY,
  width: 34,
  height: 34,
  borderRadius: 100,
  justifyContent: 'center',
  alignItems: 'center',
  borderWidth: 3,
  borderColor: '#fff',
},
});