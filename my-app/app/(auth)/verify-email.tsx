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

import { useAuth } from '@/src/context/AuthContext';

import api from '@/src/services/api';

export default function VerifyEmail() {

  const { email } = useLocalSearchParams<{ email: string }>();

  const { verifyEmail } = useAuth();

  const [code, setCode] = useState('');

  const [loading, setLoading] = useState(false);

  const [resending, setResending] = useState(false);

  const handleVerify = async () => {

    if (!code) {

      Alert.alert('Error', 'Ingresa el código que te enviamos');

      return;
    }

    try {

      setLoading(true);

      await verifyEmail(email, code);

      router.replace('/(role)/view');

    } catch (error: any) {

      Alert.alert(
        'Error',
        error?.response?.data?.error || 'Código inválido'
      );

    } finally {

      setLoading(false);
    }
  };

  const handleResend = async () => {

    try {

      setResending(true);

      await api.post('/auth/resend-code', { email });

      Alert.alert('Listo', 'Te enviamos un nuevo código');

    } catch (error: any) {

      Alert.alert(
        'Error',
        error?.response?.data?.error || 'No se pudo reenviar'
      );

    } finally {

      setResending(false);
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
          Confirma tu correo
        </Text>

        <Text style={styles.subtitle}>
          Enviamos un código de 6 dígitos a{'\n'}
          <Text style={styles.email}>{email}</Text>
        </Text>

        <TextInput
          value={code}
          onChangeText={setCode}
          placeholder="000000"
          placeholderTextColor="#999"
          keyboardType="number-pad"
          maxLength={6}
          style={styles.codeInput}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleVerify}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Verificando...' : 'Confirmar cuenta'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleResend}
          disabled={resending}
        >
          <Text style={styles.resend}>
            {resending ? 'Enviando...' : '¿No te llegó? Reenviar código'}
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
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 13,
    color: '#777',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 19,
  },
  email: {
    fontWeight: '700',
    color: '#333',
  },
  codeInput: {
    backgroundColor: '#F1F3F9',
    borderRadius: 12,
    padding: 14,
    fontSize: 24,
    letterSpacing: 10,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#E0E3EB',
    width: '100%',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#6C63FF',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    width: '100%',
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  resend: {
    color: '#6C63FF',
    fontSize: 13,
    fontWeight: '600',
  },
});
