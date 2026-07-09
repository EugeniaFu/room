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

  // Pantalla 1: tipo de renta
  const [rentalMode, setRentalMode] = useState<'SHARED' | 'NEW_ONLY'>('SHARED');

  // Pantalla 3: características
  const [bedroomCount, setBedroomCount] = useState('');
  const [roomOwnership, setRoomOwnership] = useState<'PRIVATE' | 'SHARED'>('PRIVATE');
  const [floor, setFloor] = useState('');
  const [amenities, setAmenities] = useState<string[]>([]);

  // Pantalla 4: convivencia
  const [hasPetsNow, setHasPetsNow] = useState(false);
  const [petsAllowed, setPetsAllowed] = useState(false);
  const [allowedPetTypes, setAllowedPetTypes] = useState('');
  const [privateAreas, setPrivateAreas] = useState('');
  const [sharedAreas, setSharedAreas] = useState('');

  // Pantalla 5: servicios, ubicación y costos
  const [includedServices, setIncludedServices] = useState<string[]>([]);
  const [extraServices, setExtraServices] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [nearbyLandmark, setNearbyLandmark] = useState('');
  const [minStayMonths, setMinStayMonths] = useState('');

  // Pantalla 6: perfil del anfitrión y reglas
  const [seekingGender, setSeekingGender] = useState<'MALE' | 'FEMALE' | 'OTHER' | ''>('');
  const [wheelchairAccessible, setWheelchairAccessible] = useState(false);
  const [hostDescription, setHostDescription] = useState('');
  const [seekingRoommateBio, setSeekingRoommateBio] = useState('');
  const [houseRules, setHouseRules] = useState('');

  const AMENITY_OPTIONS = [
    { value: 'LIVING_ROOM', label: 'Sala' },
    { value: 'KITCHEN', label: 'Cocina' },
    { value: 'BATHROOM', label: 'Baño' },
    { value: 'YARD', label: 'Patio' },
    { value: 'TERRACE', label: 'Terraza' },
    { value: 'LAUNDRY_AREA', label: 'Área de lavado' },
    { value: 'PARKING', label: 'Estacionamiento' },
  ];

  const SERVICE_OPTIONS = [
    { value: 'luz', label: 'Luz' },
    { value: 'agua', label: 'Agua' },
    { value: 'internet', label: 'Internet' },
  ];

  const toggleFromList = (
    list: string[],
    value: string,
    setList: (value: string[]) => void
  ) => {

    if (list.includes(value)) {
      setList(list.filter((item) => item !== value));
    } else {
      setList([...list, value]);
    }
  };

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

      formData.append('rentalMode', rentalMode);
      formData.append('bedroomCount', bedroomCount);
      formData.append('roomOwnership', roomOwnership);
      formData.append('floor', floor);
      formData.append('amenities', JSON.stringify(amenities));

      formData.append('hasPetsNow', String(hasPetsNow));
      formData.append('petsAllowed', String(petsAllowed));
      formData.append(
        'allowedPetTypes',
        JSON.stringify(
          allowedPetTypes.split(',').map((item) => item.trim()).filter(Boolean)
        )
      );
      formData.append(
        'privateAreas',
        JSON.stringify(
          privateAreas.split(',').map((item) => item.trim()).filter(Boolean)
        )
      );
      formData.append(
        'sharedAreas',
        JSON.stringify(
          sharedAreas.split(',').map((item) => item.trim()).filter(Boolean)
        )
      );

      formData.append('includedServices', JSON.stringify(includedServices));
      formData.append(
        'extraServices',
        JSON.stringify(
          extraServices.split(',').map((item) => item.trim()).filter(Boolean)
        )
      );
      formData.append('neighborhood', neighborhood);
      formData.append('nearbyLandmark', nearbyLandmark);
      formData.append('minStayMonths', minStayMonths);

      formData.append('seekingGender', seekingGender);
      formData.append('wheelchairAccessible', String(wheelchairAccessible));
      formData.append('hostDescription', hostDescription);
      formData.append('seekingRoommateBio', seekingRoommateBio);
      formData.append(
        'houseRules',
        JSON.stringify(
          houseRules.split('\n').map((item) => item.trim()).filter(Boolean)
        )
      );

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

        {/* RENTAL MODE */}
        <Text style={styles.label}>
          Tipo de renta
        </Text>

        <View style={styles.typeContainer}>

          <TouchableOpacity
            style={[
              styles.typeButton,
              rentalMode === 'SHARED' && styles.typeButtonActive,
            ]}
            onPress={() => setRentalMode('SHARED')}
          >
            <Text style={[styles.typeText, rentalMode === 'SHARED' && styles.typeTextActive]}>
              Vivienda compartida
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.typeButton,
              rentalMode === 'NEW_ONLY' && styles.typeButtonActive,
            ]}
            onPress={() => setRentalMode('NEW_ONLY')}
          >
            <Text style={[styles.typeText, rentalMode === 'NEW_ONLY' && styles.typeTextActive]}>
              Renta nueva
            </Text>
          </TouchableOpacity>

        </View>

        {/* SECTION: características */}
        <Text style={styles.sectionTitle}>Características de la propiedad</Text>

        <View style={styles.row}>

          <View style={[styles.inputContainer, styles.half]}>
            <Text style={styles.label}>Dormitorios</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="2"
              placeholderTextColor="#999"
              value={bedroomCount}
              onChangeText={setBedroomCount}
            />
          </View>

          <View style={[styles.inputContainer, styles.half]}>
            <Text style={styles.label}>Piso</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="2"
              placeholderTextColor="#999"
              value={floor}
              onChangeText={setFloor}
            />
          </View>

        </View>

        <Text style={styles.label}>Habitación en renta</Text>

        <View style={styles.typeContainer}>

          <TouchableOpacity
            style={[styles.typeButton, roomOwnership === 'PRIVATE' && styles.typeButtonActive]}
            onPress={() => setRoomOwnership('PRIVATE')}
          >
            <Text style={[styles.typeText, roomOwnership === 'PRIVATE' && styles.typeTextActive]}>
              Propia
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.typeButton, roomOwnership === 'SHARED' && styles.typeButtonActive]}
            onPress={() => setRoomOwnership('SHARED')}
          >
            <Text style={[styles.typeText, roomOwnership === 'SHARED' && styles.typeTextActive]}>
              Compartida
            </Text>
          </TouchableOpacity>

        </View>

        <Text style={styles.label}>Áreas de la propiedad</Text>

        <View style={styles.chipsContainer}>

          {AMENITY_OPTIONS.map((option) => (

            <TouchableOpacity
              key={option.value}
              style={[
                styles.chip,
                amenities.includes(option.value) && styles.chipActive,
              ]}
              onPress={() => toggleFromList(amenities, option.value, setAmenities)}
            >
              <Text
                style={[
                  styles.chipText,
                  amenities.includes(option.value) && styles.chipTextActive,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>

          ))}

        </View>

        {/* SECTION: convivencia */}
        <Text style={styles.sectionTitle}>Convivencia</Text>

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>¿Actualmente hay mascotas?</Text>
          <TouchableOpacity
            style={[styles.switchButton, hasPetsNow && styles.switchButtonActive]}
            onPress={() => setHasPetsNow(!hasPetsNow)}
          >
            <Text style={[styles.switchButtonText, hasPetsNow && styles.switchButtonTextActive]}>
              {hasPetsNow ? 'Sí' : 'No'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>¿Se permiten mascotas?</Text>
          <TouchableOpacity
            style={[styles.switchButton, petsAllowed && styles.switchButtonActive]}
            onPress={() => setPetsAllowed(!petsAllowed)}
          >
            <Text style={[styles.switchButtonText, petsAllowed && styles.switchButtonTextActive]}>
              {petsAllowed ? 'Sí' : 'No'}
            </Text>
          </TouchableOpacity>
        </View>

        {petsAllowed && (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Tipo de mascotas permitidas</Text>
            <TextInput
              style={styles.input}
              placeholder="Perros, gatos..."
              placeholderTextColor="#999"
              value={allowedPetTypes}
              onChangeText={setAllowedPetTypes}
            />
          </View>
        )}

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Áreas privadas</Text>
          <TextInput
            style={styles.input}
            placeholder="Recámara, baño..."
            placeholderTextColor="#999"
            value={privateAreas}
            onChangeText={setPrivateAreas}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Áreas compartidas</Text>
          <TextInput
            style={styles.input}
            placeholder="Cocina, sala..."
            placeholderTextColor="#999"
            value={sharedAreas}
            onChangeText={setSharedAreas}
          />
        </View>

        {/* SECTION: servicios, ubicación y costos */}
        <Text style={styles.sectionTitle}>Servicios y ubicación</Text>

        <Text style={styles.label}>Servicios incluidos en la renta</Text>

        <View style={styles.chipsContainer}>

          {SERVICE_OPTIONS.map((option) => (

            <TouchableOpacity
              key={option.value}
              style={[
                styles.chip,
                includedServices.includes(option.value) && styles.chipActive,
              ]}
              onPress={() =>
                toggleFromList(includedServices, option.value, setIncludedServices)
              }
            >
              <Text
                style={[
                  styles.chipText,
                  includedServices.includes(option.value) && styles.chipTextActive,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>

          ))}

        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Servicios adicionales (se pagan aparte)</Text>
          <TextInput
            style={styles.input}
            placeholder="Gas, TV de paga..."
            placeholderTextColor="#999"
            value={extraServices}
            onChangeText={setExtraServices}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Colonia o zona</Text>
          <TextInput
            style={styles.input}
            placeholder="Centro"
            placeholderTextColor="#999"
            value={neighborhood}
            onChangeText={setNeighborhood}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Cercanía a universidad o punto de referencia</Text>
          <TextInput
            style={styles.input}
            placeholder="A 10 min de la UAC"
            placeholderTextColor="#999"
            value={nearbyLandmark}
            onChangeText={setNearbyLandmark}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Duración mínima de renta (meses)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="6"
            placeholderTextColor="#999"
            value={minStayMonths}
            onChangeText={setMinStayMonths}
          />
        </View>

        {/* SECTION: perfil y reglas */}
        <Text style={styles.sectionTitle}>A quién buscas y reglas del lugar</Text>

        <Text style={styles.label}>Busco compañeros</Text>

        <View style={styles.chipsContainer}>

          {[
            { value: 'MALE', label: 'Hombres' },
            { value: 'FEMALE', label: 'Mujeres' },
            { value: 'OTHER', label: 'Otro' },
            { value: '', label: 'Indistinto' },
          ].map((option) => (

            <TouchableOpacity
              key={option.label}
              style={[
                styles.chip,
                seekingGender === option.value && styles.chipActive,
              ]}
              onPress={() => setSeekingGender(option.value as any)}
            >
              <Text
                style={[
                  styles.chipText,
                  seekingGender === option.value && styles.chipTextActive,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>

          ))}

        </View>

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>¿Apto para discapacidad?</Text>
          <TouchableOpacity
            style={[styles.switchButton, wheelchairAccessible && styles.switchButtonActive]}
            onPress={() => setWheelchairAccessible(!wheelchairAccessible)}
          >
            <Text
              style={[
                styles.switchButtonText,
                wheelchairAccessible && styles.switchButtonTextActive,
              ]}
            >
              {wheelchairAccessible ? 'Sí' : 'No'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Descripción personal (anfitrión)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            multiline
            placeholder="Cuéntanos sobre ti..."
            placeholderTextColor="#999"
            value={hostDescription}
            onChangeText={setHostDescription}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>¿Qué tipo de roomie buscas?</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            multiline
            placeholder="Personalidad, hábitos, responsabilidades a compartir..."
            placeholderTextColor="#999"
            value={seekingRoommateBio}
            onChangeText={setSeekingRoommateBio}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Reglas de convivencia (una por línea)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            multiline
            placeholder={'No fiestas después de las 11pm\nMantener áreas comunes limpias'}
            placeholderTextColor="#999"
            value={houseRules}
            onChangeText={setHouseRules}
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

  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    marginTop: 10,
    marginBottom: 12,
  },

  row: {
    flexDirection: 'row',
    gap: 12,
  },

  half: {
    flex: 1,
  },

  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },

  chip: {
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingVertical: 9,
    paddingHorizontal: 14,
  },

  chipActive: {
    backgroundColor: PRIMARY,
  },

  chipText: {
    color: '#374151',
    fontWeight: '600',
    fontSize: 13,
  },

  chipTextActive: {
    color: '#fff',
  },

  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },

  switchLabel: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '600',
    flex: 1,
    marginRight: 12,
  },

  switchButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 18,
  },

  switchButtonActive: {
    backgroundColor: PRIMARY,
  },

  switchButtonText: {
    color: '#374151',
    fontWeight: '700',
    fontSize: 13,
  },

  switchButtonTextActive: {
    color: '#fff',
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