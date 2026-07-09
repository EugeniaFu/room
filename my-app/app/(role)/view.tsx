import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';

import { router } from 'expo-router';

import { useAuth } from '@/src/context/AuthContext';

export default function ViewScreen() {

  const { user, logout } = useAuth();

  const roles = user?.roles?.map(
    (r: any) => r.role.name
  ) || [];

  const isRoomie = roles.includes('roomie');

  const isHost = roles.includes('host');

  const handleLogout = async () => {

    await logout();

    router.replace('/(auth)/login');
  };

  return (

    <SafeAreaView style={styles.container}>

      <View style={styles.logoContainer}>
        <Image
          source={require('@/assets/images/logo.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.title}>
        ¿Qué tipo de usuario eres?
      </Text>

      {/* ROOMIE */}
      {isRoomie && (

        <View style={styles.card}>

          <View
            style={[
              styles.iconCircle,
              { backgroundColor: '#DFF7E2' }
            ]}
          >
            <Text style={styles.icon}>👤</Text>
          </View>

          <Text style={styles.cardTitle}>
            Roomie
          </Text>

          <Text style={styles.cardText}>
            Busca espacios disponibles y encuentra tu lugar ideal
          </Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              router.push({
                pathname: '/(tabs)/home',
                params: {
                  role: 'roomie',
                },
              })
            }
          >

            <Text style={styles.buttonText}>
              Continuar como Roomie
            </Text>

          </TouchableOpacity>

        </View>

      )}

      {/* HOST */}
      {isHost && (

        <View style={styles.card}>

          <View
            style={[
              styles.iconCircle,
              { backgroundColor: '#E3ECFF' }
            ]}
          >

            <Text style={styles.icon}>🏢</Text>

          </View>

          <Text style={styles.cardTitle}>
            Anfitrión
          </Text>

          <Text style={styles.cardText}>
            Publica espacios y administra propiedades
          </Text>

          <TouchableOpacity
            style={styles.buttonAlt}
            onPress={() =>
              router.push({
                pathname: '/(tabs)/home',
                params: {
                  role: 'host',
                },
              })
            }
          >

            <Text style={styles.buttonText}>
              Continuar como Anfitrión
            </Text>

          </TouchableOpacity>

        </View>

      )}

      {/* CERRAR SESIÓN */}
      <TouchableOpacity
        onPress={handleLogout}
      >

        <Text style={styles.logout}>
          Cerrar sesión
        </Text>

      </TouchableOpacity>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6FB',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  icon: {
    fontSize: 28,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
  },
  cardText: {
    fontSize: 13,
    textAlign: 'center',
    color: '#777',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#6C63FF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  buttonAlt: {
    backgroundColor: '#4F8CFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  noteBox: {
    backgroundColor: '#D6E9FF',
    padding: 15,
    borderRadius: 15,
    marginTop: 10,
  },
  noteText: {
    fontSize: 12,
    color: '#3A6EA5',
    textAlign: 'center',
  },
  logout: {
    textAlign: 'center',
    marginTop: 20,
    color: '#777',
    fontSize: 13,
  },
    logoContainer: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 10,
  },
    logoImage: {
    width: 160,
    height: 110,
  },
});