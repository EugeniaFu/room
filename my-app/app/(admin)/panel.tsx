import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';

export default function Panel() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Panel de Administración</Text>
          <Text style={styles.subtitle}>
            Bienvenido administrador
          </Text>
        </View>

        {/* Cards */}
        <View style={styles.cardsContainer}>

          <TouchableOpacity style={styles.card}>
            <Text style={styles.cardNumber}>120</Text>
            <Text style={styles.cardText}>Usuarios</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card}>
            <Text style={styles.cardNumber}>45</Text>
            <Text style={styles.cardText}>Pedidos</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card}>
            <Text style={styles.cardNumber}>18</Text>
            <Text style={styles.cardText}>Productos</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card}>
            <Text style={styles.cardNumber}>8</Text>
            <Text style={styles.cardText}>Reportes</Text>
          </TouchableOpacity>

        </View>

        {/* Acciones rápidas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acciones rápidas</Text>

          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionText}>Agregar producto</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionText}>Ver usuarios</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionText}>Generar reporte</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6FB',
    marginTop: 40,
  },

  content: {
    padding: 20,
  },

  header: {
    marginBottom: 25,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },

  subtitle: {
    fontSize: 15,
    color: '#777',
    marginTop: 5,
  },

  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  card: {
    width: '48%',
    backgroundColor: '#6C63FF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,

    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 4,
  },

  cardNumber: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
  },

  cardText: {
    fontSize: 15,
    color: '#EAEAEA',
    marginTop: 8,
  },

  section: {
    marginTop: 25,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },

  actionButton: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 15,
    marginBottom: 12,

    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },

    elevation: 2,
  },

  actionText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#444',
  },
});