import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from 'react-native';

import { useState } from 'react';

import { router } from 'expo-router';

import Ionicons from '@expo/vector-icons/Ionicons';

import * as ImagePicker from 'expo-image-picker';

import api from '@/src/services/api';

const PRIMARY = '#6C63FF';

export default function CreateListing() {

  const [title, setTitle] = useState('');

  const [description, setDescription] = useState('');

  const [price, setPrice] = useState('');

  const [type, setType] = useState('room');

  const [country, setCountry] = useState('México');

  const [state, setState] = useState('');

  const [city, setCity] = useState('');

  const [latitude, setLatitude] = useState('');

  const [longitude, setLongitude] = useState('');

  const [loading, setLoading] = useState(false);

  const [images, setImages] = useState<string[]>(([]));

  const pickImage = async () => {

    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {

      Alert.alert(
        'Permiso requerido',
        'Debes permitir acceso a tus fotos'
      );

      return;
    }

    const result =
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes:
          ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.7,
      });

    if (!result.canceled) {

      const uri = result.assets[0].uri;

      setImages((prev) => [...prev, uri]);
    }
  };

  const handleCreate = async () => {

    try {

      if (!title || !description || !price) {

        Alert.alert(
          'Campos requeridos',
          'Completa la información principal'
        );

        return;
      }

      setLoading(true);

      const formData = new FormData();

      formData.append('title', title);

      formData.append(
        'description',
        description
      );

      formData.append('price', price);

      formData.append('type', type);

      formData.append('country', country);

      formData.append('state', state);

      formData.append('city', city);

      formData.append('latitude', latitude);

      formData.append('longitude', longitude);

      images.forEach((image, index) => {

        formData.append('images', {
          uri: image,
          name: `photo-${index}.jpg`,
          type: 'image/jpeg',
        } as any);

      });

      await api.post(
        '/listings',
        formData,
        {
          headers: {
            'Content-Type':
              'multipart/form-data',
          },
        }
      );

      Alert.alert(
        'Éxito',
        'Publicación creada correctamente'
      );

      router.back();

    } catch (err: any) {

      console.log(
        err.response?.data || err
      );

      Alert.alert(
        'Error',
        err.response?.data?.error ||
        'No se pudo crear la publicación'
      );

    } finally {

      setLoading(false);
    }
  };

  return (

    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >

      {/* HEADER */}
      <View style={styles.header}>

        <TouchableOpacity
          onPress={() => router.back()}
        >

          <Ionicons
            name="arrow-back"
            size={28}
            color="#111827"
          />

        </TouchableOpacity>

        <Text style={styles.title}>
          Nueva publicación
        </Text>

        <Text style={styles.subtitle}>
          Publica un espacio para roomies
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
            placeholder="Habitación cerca de universidad..."
            placeholderTextColor="#999"
            style={styles.input}
            value={title}
            onChangeText={setTitle}
          />

        </View>

        {/* DESCRIPTION */}
        <View style={styles.inputContainer}>

          <Text style={styles.label}>
            Descripción
          </Text>

          <TextInput
            placeholder="Describe el lugar..."
            placeholderTextColor="#999"
            style={[
              styles.input,
              styles.textArea,
            ]}
            multiline
            value={description}
            onChangeText={setDescription}
          />

        </View>

        {/* PRICE */}
        <View style={styles.inputContainer}>

          <Text style={styles.label}>
            Precio mensual
          </Text>

          <TextInput
            placeholder="3500"
            placeholderTextColor="#999"
            keyboardType="numeric"
            style={styles.input}
            value={price}
            onChangeText={setPrice}
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
              styles.typeButtonActive,
            ]}
            onPress={() =>
              setType('room')
            }
          >

            <Text
              style={[
                styles.typeText,
                type === 'room' &&
                styles.typeTextActive,
              ]}
            >
              Habitación
            </Text>

          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.typeButton,
              type === 'house' &&
              styles.typeButtonActive,
            ]}
            onPress={() =>
              setType('house')
            }
          >

            <Text
              style={[
                styles.typeText,
                type === 'house' &&
                styles.typeTextActive,
              ]}
            >
              Casa
            </Text>

          </TouchableOpacity>

        </View>

        {/* IMAGES */}
        <View style={styles.inputContainer}>

          <Text style={styles.label}>
            Fotografías
          </Text>

          <TouchableOpacity
            style={styles.imagePicker}
            onPress={pickImage}
          >

            <Ionicons
              name="image-outline"
              size={24}
              color={PRIMARY}
            />

            <Text style={styles.imagePickerText}>
              Seleccionar imágenes
            </Text>

          </TouchableOpacity>

        </View>

        {/* PREVIEW */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.previewContainer}
        >

          {images.map((image, index) => (

            <View
              key={index}
              style={styles.previewWrapper}
            >

              <Image
                source={{ uri: image }}
                style={styles.previewImage}
              />

              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => {

                  setImages(
                    images.filter(
                      (_, i) => i !== index
                    )
                  );

                }}
              >

                <Ionicons
                  name="close"
                  size={16}
                  color="#fff"
                />

              </TouchableOpacity>

            </View>

          ))}

        </ScrollView>

        {/* COUNTRY */}
        <View style={styles.inputContainer}>

          <Text style={styles.label}>
            País
          </Text>

          <TextInput
            style={styles.input}
            value={country}
            onChangeText={setCountry}
          />

        </View>

        {/* STATE */}
        <View style={styles.inputContainer}>

          <Text style={styles.label}>
            Estado
          </Text>

          <TextInput
            placeholder="Yucatán"
            placeholderTextColor="#999"
            style={styles.input}
            value={state}
            onChangeText={setState}
          />

        </View>

        {/* CITY */}
        <View style={styles.inputContainer}>

          <Text style={styles.label}>
            Ciudad
          </Text>

          <TextInput
            placeholder="Mérida"
            placeholderTextColor="#999"
            style={styles.input}
            value={city}
            onChangeText={setCity}
          />

        </View>

        {/* LAT */}
        <View style={styles.inputContainer}>

          <Text style={styles.label}>
            Latitud
          </Text>

          <TextInput
            placeholder="20.967370"
            placeholderTextColor="#999"
            keyboardType="numeric"
            style={styles.input}
            value={latitude}
            onChangeText={setLatitude}
          />

        </View>

        {/* LNG */}
        <View style={styles.inputContainer}>

          <Text style={styles.label}>
            Longitud
          </Text>

          <TextInput
            placeholder="-89.592586"
            placeholderTextColor="#999"
            keyboardType="numeric"
            style={styles.input}
            value={longitude}
            onChangeText={setLongitude}
          />

        </View>

        {/* BUTTON */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleCreate}
          disabled={loading}
        >

          <Text style={styles.buttonText}>
            {loading
              ? 'Creando...'
              : 'Crear publicación'}
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

  typeButtonActive: {
    backgroundColor: PRIMARY,
  },

  typeText: {
    color: '#374151',
    fontWeight: '700',
  },

  typeTextActive: {
    color: '#fff',
  },

  imagePicker: {
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#C7D2FE',
    borderStyle: 'dashed',
    borderRadius: 16,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  imagePickerText: {
    marginTop: 8,
    color: PRIMARY,
    fontWeight: '700',
  },

  previewContainer: {
    marginBottom: 20,
  },

  previewWrapper: {
    marginRight: 12,
    position: 'relative',
  },

  previewImage: {
    width: 120,
    height: 120,
    borderRadius: 18,
  },

  removeButton: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.7)',
    width: 24,
    height: 24,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
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