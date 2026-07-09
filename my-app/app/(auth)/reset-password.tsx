import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';

import { router, useLocalSearchParams } from 'expo-router';

import { useState } from 'react';

import api from '@/src/services/api';

export default function ResetPassword() {

  const { email } = useLocalSearchParams<{ email: string }>();

  const [code, setCode] = useState('');

  const [newPassword, setNewPassword] = useState('');

  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {

    if (!code || !newPassword || !confirmPassword) {

      Alert.alert('Error', 'Completa todos los campos');

      return;
    }

    if (newPassword !== confirmPassword) {

      Alert.alert('Error', 'Las contraseñas no coinciden');

      return;
    }

    if (
      newPassword.length < 8 ||
      !/[a-zA-Z]/.test(newPassword) ||
      !/[0-9]/.test(newPassword)
    ) {

      Alert.alert(
        'Contraseña débil',
        'Debe tener al menos 8 caracteres, con al menos una letra y un número'
      );

      return;
    }

    try {

      setLoading(true);

      await api.post('/auth/reset-password', {
        email,
        code,
        newPassword,
      });

      Alert.alert(
        'Listo',
        'Tu contraseña fue actualizada, ya puedes iniciar sesión'
      );

      router.replace('/(auth)/login');

    } catch (error: any) {

      Alert.alert(
        'Error',
        error?.response?.data?.error || 'No se pudo restablecer'
      );

    } finally {

      setLoading(false);
    }
  };

  return (

    <View style={styles.container}>

      <Image
        source={require('@/assets/images/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <View style={styles.card}>

        <Text style={styles.title}>
          Nueva contraseña
        </Text>

        <Text style={styles.subtitle}>
          Ingresa el código que enviamos a{'\n'}
          <Text style={styles.email}>{email}</Text> y tu nueva contraseña.
        </Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>
            Código de verificación
          </Text>

          <TextInput
            value={code}
            onChangeText={setCode}
            placeholder="000000"
            placeholderTextColor="#999"
            keyboardType="number-pad"
            maxLength={6}
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>
            Nueva contraseña
          </Text>

          <TextInput
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="********"
            placeholderTextColor="#999"
            secureTextEntry
            style={styles.input}
          />

          <Text style={styles.hint}>
            Mínimo 8 caracteres, con al menos una letra y un número
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>
            Confirmar contraseña
          </Text>

          <TextInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="********"
            placeholderTextColor="#999"
            secureTextEntry
            style={styles.input}
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Guardando...' : 'Cambiar contraseña'}
          </Text>
        </TouchableOpacity>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6FB',
    justifyContent: 'flex-start',
    paddingTop: 60,
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 180,
    height: 120,
    marginBottom: 20,
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    color: '#777',
    marginBottom: 20,
    lineHeight: 19,
  },
  email: {
    fontWeight: '700',
    color: '#333',
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 12,
    color: '#555',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#F1F3F9',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#E0E3EB',
  },
  hint: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 6,
  },
  button: {
    backgroundColor: '#6C63FF',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
});
