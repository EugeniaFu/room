import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert
} from 'react-native';

import { Link, router } from 'expo-router';

import { useState } from 'react';

import api from '@/src/services/api';

export default function Register() {

  const [name, setName] = useState('');

  const [email, setEmail] = useState('');

  const [phone, setPhone] = useState('');

  const [password, setPassword] = useState('');

  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async () => {

    try {

      if (
        !name ||
        !email ||
        !phone ||
        !password ||
        !confirmPassword
      ) {

        Alert.alert(
          'Error',
          'Completa todos los campos'
        );

        return;
      }

      if (password !== confirmPassword) {

        Alert.alert(
          'Error',
          'Las contraseñas no coinciden'
        );

        return;
      }

      if (password.length < 8 || !/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {

        Alert.alert(
          'Contraseña débil',
          'Debe tener al menos 8 caracteres, con al menos una letra y un número'
        );

        return;
      }

      await api.post('/auth/register', {
        name,
        email,
        phone,
        password
      });

      router.push({
        pathname: '/(auth)/verify-email',
        params: { email },
      });

    } catch (error: any) {

      Alert.alert(
        'Error',
        error?.response?.data?.error ||
        'No se pudo registrar'
      );
    }
  };

  return (

    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : 'height'
      }
    >

      <TouchableWithoutFeedback
        onPress={Keyboard.dismiss}
      >

        <ScrollView
          contentContainerStyle={styles.container}
        >

          <Image
            source={require('@/assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          <View style={styles.card}>

            <Text style={styles.title}>
              Registrarse
            </Text>

            {/* Nombre */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                Nombre completo
              </Text>

              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Juan Pérez"
                placeholderTextColor="#999"
                style={styles.input}
              />
            </View>

            {/* Email */}
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

            {/* Teléfono */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                Teléfono
              </Text>

              <TextInput
                value={phone}
                onChangeText={setPhone}
                placeholder="+52 999 000 0000"
                placeholderTextColor="#999"
                keyboardType="phone-pad"
                style={styles.input}
              />
            </View>

            {/* Nota de roles */}
            <View style={styles.noteBox}>
              <Text style={styles.noteText}>
                Tu cuenta podrá usarse tanto para rentar un espacio
                (Roomie) como para publicar el tuyo (Anfitrión) — podrás
                elegir con cuál entrar cada vez que inicies sesión.
              </Text>
            </View>

            {/* Password */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                Contraseña
              </Text>

              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="********"
                placeholderTextColor="#999"
                secureTextEntry
                style={styles.input}
              />

              <Text style={styles.hint}>
                Mínimo 8 caracteres, con al menos una letra y un número
              </Text>
            </View>

            {/* Confirm Password */}
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
              onPress={handleRegister}
            >

              <Text style={styles.buttonText}>
                Crear cuenta
              </Text>

            </TouchableOpacity>

            <View style={styles.loginRow}>

              <Text style={styles.login}>
                ¿Ya tienes cuenta?
              </Text>

              <Link href="/login" asChild>

                <TouchableOpacity>

                  <Text style={styles.loginBold}>
                    Inicia sesión
                  </Text>

                </TouchableOpacity>

              </Link>

            </View>

          </View>

        </ScrollView>

      </TouchableWithoutFeedback>

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F4F6FB',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },

  logo: {
    width: 180,
    height: 120,
    marginBottom: 15,
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
    marginBottom: 15,
  },

  inputContainer: {
    marginBottom: 14,
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

  noteBox: {
    backgroundColor: '#EEF2FF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
  },

  noteText: {
    fontSize: 12,
    color: '#4F46E5',
    lineHeight: 17,
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
    marginTop: 10,
    marginBottom: 15,
  },

  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },

  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },

  login: {
    color: '#555',
  },

  loginBold: {
    color: '#FF4D4D',
    fontWeight: 'bold',
    marginLeft: 5,
  },
});