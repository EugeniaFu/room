import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';

import { router } from 'expo-router';

import { useState } from 'react';

import api from '@/src/services/api';

export default function ForgotPassword() {

  const [email, setEmail] = useState('');

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {

    if (!email) {

      Alert.alert('Error', 'Ingresa tu correo electrónico');

      return;
    }

    try {

      setLoading(true);

      await api.post('/auth/forgot-password', { email });

      router.push({
        pathname: '/(auth)/reset-password',
        params: { email },
      });

    } catch (error: any) {

      Alert.alert(
        'Error',
        error?.response?.data?.error || 'No se pudo procesar la solicitud'
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
          Recuperar contraseña
        </Text>

        <Text style={styles.subtitle}>
          Ingresa tu correo y te enviaremos un código para
          restablecer tu contraseña.
        </Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>
            Correo electrónico
          </Text>

          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="tu@email.com"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Enviando...' : 'Enviar código'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>
            Volver a iniciar sesión
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
  inputContainer: {
    marginBottom: 20,
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
  button: {
    backgroundColor: '#6C63FF',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  back: {
    textAlign: 'center',
    color: '#6C63FF',
    fontSize: 13,
    fontWeight: '600',
  },
});
