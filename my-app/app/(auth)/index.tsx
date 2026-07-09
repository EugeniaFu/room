import { ImageBackground, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { Image } from 'react-native';

export default function HomeScreen() {
  return (
    <ImageBackground
      source={require('@/assets/images/roomie-bg.jpg')}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        
        <Image
          source={require('@/assets/images/logo.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />

        <Link href="/login" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Iniciar sesión</Text>
          </TouchableOpacity>
        </Link>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={styles.link}>¿No tienes cuenta? </Text>

          <Link href="/register" asChild>
            <TouchableOpacity>
              <Text style={styles.linkBold}>Regístrate</Text>
            </TouchableOpacity>
          </Link>
        </View>

      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 30,
    backgroundColor: 'rgba(0,0,0,0.3)', // oscurece fondo
  },
  logo: {
    position: 'absolute',
    top: 80,
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
  },
  button: {
    width: '100%',
    backgroundColor: '#4F6DF5',
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  link: {
    color: '#fff',
    fontSize: 14,
  },
  linkBold: {
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  logoImage: {
  position: 'absolute',
  top: 80,
  width: 200,
  height: 150,
},
});