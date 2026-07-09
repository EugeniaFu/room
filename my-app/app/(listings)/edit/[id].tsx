import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';

import {
  useEffect,
  useState,
} from 'react';

import {
  router,
  useLocalSearchParams,
} from 'expo-router';

import Ionicons from '@expo/vector-icons/Ionicons';

import api from '@/src/services/api';

const PRIMARY = '#6C63FF';

export default function EditListing() {

  const { id } =
    useLocalSearchParams();

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [title, setTitle] =
    useState('');

  const [description, setDescription] =
    useState('');

  const [price, setPrice] =
    useState('');

  const [type, setType] =
    useState('room');

  const [country, setCountry] =
    useState('');

  const [state, setState] =
    useState('');

  const [city, setCity] =
    useState('');

  const [latitude, setLatitude] =
    useState('');

  const [longitude, setLongitude] =
    useState('');

  useEffect(() => {

    loadListing();

  }, []);

  const loadListing = async () => {

    try {

      const response =
        await api.get(
          `/listings/${id}`
        );

      const listing =
        response.data;

      setTitle(listing.title);

      setDescription(
        listing.description
      );

      setPrice(
        String(listing.price)
      );

      setType(
        listing.type
      );

      setCountry(
        listing.location?.country || ''
      );

      setState(
        listing.location?.state || ''
      );

      setCity(
        listing.location?.city || ''
      );

      setLatitude(
        String(
          listing.location?.latitude || ''
        )
      );

      setLongitude(
        String(
          listing.location?.longitude || ''
        )
      );

    } catch (error) {

      console.log(error);

      Alert.alert(
        'Error',
        'No se pudo cargar la publicación'
      );

    } finally {

      setLoading(false);

    }
  };

  const handleUpdate = async () => {

    try {

      setSaving(true);

      await api.put(
        `/listings/${id}`,
        {
          title,
          description,
          price: Number(price),
          type,

          country,
          state,
          city,

          latitude:
            Number(latitude),

          longitude:
            Number(longitude),
        }
      );

      Alert.alert(
        'Éxito',
        'Publicación actualizada'
      );

      router.back();

    } catch (error: any) {

      console.log(
        error.response?.data
      );

      Alert.alert(
        'Error',
        error.response?.data?.error ||
        'No se pudo actualizar'
      );

    } finally {

      setSaving(false);

    }
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

    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >

      {/* HEADER */}
      <View style={styles.header}>

        <TouchableOpacity
          onPress={() =>
            router.back()
          }
        >

          <Ionicons
            name="arrow-back"
            size={28}
            color="#111827"
          />

        </TouchableOpacity>

        <Text style={styles.title}>
          Editar publicación
        </Text>

        <Text style={styles.subtitle}>
          Actualiza la información
        </Text>

      </View>

      {/* CARD */}
      <View style={styles.card}>

        {/* TITLE */}
        <View style={styles.inputContainer}>

          <Text style={styles.label}>
            Título
          </Text>

          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Título"
          />

        </View>

        {/* DESCRIPTION */}
        <View style={styles.inputContainer}>

          <Text style={styles.label}>
            Descripción
          </Text>

          <TextInput
            style={[
              styles.input,
              styles.textArea,
            ]}
            multiline
            value={description}
            onChangeText={
              setDescription
            }
            placeholder="Descripción"
          />

        </View>

        {/* PRICE */}
        <View style={styles.inputContainer}>

          <Text style={styles.label}>
            Precio
          </Text>

          <TextInput
            style={styles.input}
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
            placeholder="3500"
          />

        </View>

        {/* TYPE */}
        <Text style={styles.label}>
          Tipo de propiedad
        </Text>

        <View style={styles.typeContainer}>

          <TouchableOpacity
            style={[
              styles.typeButton,
              type === 'room' &&
              styles.activeType,
            ]}
            onPress={() =>
              setType('room')
            }
          >

            <Text
              style={
                type === 'room'
                  ? styles.activeText
                  : styles.typeText
              }
            >
              Habitación
            </Text>

          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.typeButton,
              type === 'house' &&
              styles.activeType,
            ]}
            onPress={() =>
              setType('house')
            }
          >

            <Text
              style={
                type === 'house'
                  ? styles.activeText
                  : styles.typeText
              }
            >
              Casa
            </Text>

          </TouchableOpacity>

        </View>

        {/* COUNTRY */}
        <View style={styles.inputContainer}>

          <Text style={styles.label}>
            País
          </Text>

          <TextInput
            style={styles.input}
            value={country}
            onChangeText={
              setCountry
            }
            placeholder="México"
          />

        </View>

        {/* STATE */}
        <View style={styles.inputContainer}>

          <Text style={styles.label}>
            Estado
          </Text>

          <TextInput
            style={styles.input}
            value={state}
            onChangeText={
              setState
            }
            placeholder="Yucatán"
          />

        </View>

        {/* CITY */}
        <View style={styles.inputContainer}>

          <Text style={styles.label}>
            Ciudad
          </Text>

          <TextInput
            style={styles.input}
            value={city}
            onChangeText={
              setCity
            }
            placeholder="Mérida"
          />

        </View>

        {/* LATITUDE */}
        <View style={styles.inputContainer}>

          <Text style={styles.label}>
            Latitud
          </Text>

          <TextInput
            style={styles.input}
            value={latitude}
            onChangeText={
              setLatitude
            }
            keyboardType="numeric"
            placeholder="20.967370"
          />

        </View>

        {/* LONGITUDE */}
        <View style={styles.inputContainer}>

          <Text style={styles.label}>
            Longitud
          </Text>

          <TextInput
            style={styles.input}
            value={longitude}
            onChangeText={
              setLongitude
            }
            keyboardType="numeric"
            placeholder="-89.592586"
          />

        </View>

        {/* BUTTON */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleUpdate}
          disabled={saving}
        >

          <Text style={styles.buttonText}>
            {saving
              ? 'Guardando...'
              : 'Actualizar publicación'}
          </Text>

        </TouchableOpacity>

      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F4F6FB',
  },

  loader: {
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
    marginTop: 15,
    fontSize: 28,
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
    borderRadius: 24,
    padding: 20,
    marginBottom: 40,
  },

  inputContainer: {
    marginBottom: 15,
  },

  label: {
    fontSize: 13,
    color: '#555',
    marginBottom: 6,
    fontWeight: '600',
  },

  input: {
    backgroundColor: '#F1F3F9',
    borderRadius: 14,
    padding: 14,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    color: '#111827',
  },

  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },

  typeContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },

  typeButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },

  activeType: {
    backgroundColor: PRIMARY,
  },

  typeText: {
    color: '#374151',
    fontWeight: '700',
  },

  activeText: {
    color: '#fff',
    fontWeight: '700',
  },

  button: {
    backgroundColor: PRIMARY,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 10,
  },

  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },

});