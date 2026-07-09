import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert
} from 'react-native';

import { Link, router } from 'expo-router';

import { useState } from 'react';

import { useAuth } from '@/src/context/AuthContext';

export default function Login() {

  const { login } = useAuth();

  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {

    try {

      setLoading(true);

      const user = await login(email, password);

      const roles = user.roles.map(
        (r: any) => r.role.name
      );

    // ADMIN
    if (roles.includes('admin')) {

      router.replace('/(admin)/panel');

      return;
    }

    router.replace('/(role)/view');

    } catch (err: any) {

      Alert.alert(
        'Error',
        err.response?.data?.error || 'Error login'
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <View style={styles.container}>

      {/* Logo */}
      <Image
        source={require('@/assets/images/logo.png')}
        style={styles.logoImage}
        resizeMode="contain"
      />

      {/* Card */}
      <View style={styles.card}>

        <Text style={styles.title}>
          Iniciar sesión
        </Text>

        <Text style={styles.subtitle}>
          Ingresa a tu cuenta Roomie
        </Text>

        {/* Email */}
        <View style={styles.inputContainer}>

          <Text style={styles.label}>
            Correo electrónico
          </Text>

          <TextInput
            placeholder="Ingresa tu email"
            placeholderTextColor="#999"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />

        </View>

        {/* Password */}
        <View style={styles.inputContainer}>

          <Text style={styles.label}>
            Contraseña
          </Text>

          <TextInput
            placeholder="********"
            placeholderTextColor="#999"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />

        </View>

        <Text style={styles.forgot}>
          ¿Olvidaste tu contraseña?
        </Text>

        {/* Botón */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
        >

          <Text style={styles.buttonText}>
            {loading
              ? 'Cargando...'
              : 'Iniciar sesión'
            }
          </Text>

        </TouchableOpacity>

        {/* Registro */}
        <View style={styles.registerRow}>

          <Text style={styles.register}>
            ¿No tienes cuenta?
          </Text>

          <Link href="/register" asChild>
            <TouchableOpacity>
              <Text style={styles.registerBold}>
                Regístrate
              </Text>
            </TouchableOpacity>
          </Link>

        </View>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6FB',
    justifyContent: 'flex-start',
    paddingTop: 50,
    alignItems: 'center',
    padding: 20,
  },
  logoImage: {
    width: 200,
    height: 150,
    marginBottom: 20,
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 13,
    color: '#777',
    marginBottom: 20,
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
  forgot: {
    fontSize: 12,
    color: '#6C63FF',
    textAlign: 'right',
    marginBottom: 20,
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
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'baseline',
    width: '100%',
  },
  register: {
    fontSize: 14,
    color: '#555',
  },
  registerBold: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
});