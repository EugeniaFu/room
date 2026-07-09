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

  const [rentalMode, setRentalMode] = useState<'SHARED' | 'NEW_ONLY'>('SHARED');
  const [bedroomCount, setBedroomCount] = useState('');
  const [roomOwnership, setRoomOwnership] = useState<'PRIVATE' | 'SHARED'>('PRIVATE');
  const [floor, setFloor] = useState('');
  const [amenities, setAmenities] = useState<string[]>([]);

  const [hasPetsNow, setHasPetsNow] = useState(false);
  const [petsAllowed, setPetsAllowed] = useState(false);
  const [allowedPetTypes, setAllowedPetTypes] = useState('');
  const [privateAreas, setPrivateAreas] = useState('');
  const [sharedAreas, setSharedAreas] = useState('');

  const [includedServices, setIncludedServices] = useState<string[]>([]);
  const [extraServices, setExtraServices] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [nearbyLandmark, setNearbyLandmark] = useState('');
  const [minStayMonths, setMinStayMonths] = useState('');

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

      setRentalMode(listing.rentalMode || 'SHARED');
      setBedroomCount(
        listing.bedroomCount != null ? String(listing.bedroomCount) : ''
      );
      setRoomOwnership(listing.roomOwnership || 'PRIVATE');
      setFloor(listing.floor != null ? String(listing.floor) : '');
      setAmenities(listing.amenities || []);

      setHasPetsNow(!!listing.hasPetsNow);
      setPetsAllowed(!!listing.petsAllowed);
      setAllowedPetTypes((listing.allowedPetTypes || []).join(', '));
      setPrivateAreas((listing.privateAreas || []).join(', '));
      setSharedAreas((listing.sharedAreas || []).join(', '));

      setIncludedServices(listing.includedServices || []);
      setExtraServices((listing.extraServices || []).join(', '));
      setNeighborhood(listing.neighborhood || '');
      setNearbyLandmark(listing.nearbyLandmark || '');
      setMinStayMonths(
        listing.minStayMonths != null ? String(listing.minStayMonths) : ''
      );

      setSeekingGender(listing.seekingGender || '');
      setWheelchairAccessible(!!listing.wheelchairAccessible);
      setHostDescription(listing.hostDescription || '');
      setSeekingRoommateBio(listing.seekingRoommateBio || '');
      setHouseRules((listing.houseRules || []).join('\n'));

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

          rentalMode,
          bedroomCount: bedroomCount ? Number(bedroomCount) : undefined,
          roomOwnership,
          floor: floor ? Number(floor) : undefined,
          amenities,

          hasPetsNow,
          petsAllowed,
          allowedPetTypes: allowedPetTypes.split(',').map((item) => item.trim()).filter(Boolean),
          privateAreas: privateAreas.split(',').map((item) => item.trim()).filter(Boolean),
          sharedAreas: sharedAreas.split(',').map((item) => item.trim()).filter(Boolean),

          includedServices,
          extraServices: extraServices.split(',').map((item) => item.trim()).filter(Boolean),
          neighborhood,
          nearbyLandmark,
          minStayMonths: minStayMonths ? Number(minStayMonths) : undefined,

          seekingGender: seekingGender || null,
          wheelchairAccessible,
          hostDescription,
          seekingRoommateBio,
          houseRules: houseRules.split('\n').map((item) => item.trim()).filter(Boolean),
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

        {/* RENTAL MODE */}
        <Text style={styles.label}>Tipo de renta</Text>

        <View style={styles.typeContainer}>

          <TouchableOpacity
            style={[styles.typeButton, rentalMode === 'SHARED' && styles.activeType]}
            onPress={() => setRentalMode('SHARED')}
          >
            <Text style={rentalMode === 'SHARED' ? styles.activeText : styles.typeText}>
              Vivienda compartida
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.typeButton, rentalMode === 'NEW_ONLY' && styles.activeType]}
            onPress={() => setRentalMode('NEW_ONLY')}
          >
            <Text style={rentalMode === 'NEW_ONLY' ? styles.activeText : styles.typeText}>
              Renta nueva
            </Text>
          </TouchableOpacity>

        </View>

        <Text style={styles.sectionTitle}>Características de la propiedad</Text>

        <View style={styles.row}>

          <View style={[styles.inputContainer, styles.half]}>
            <Text style={styles.label}>Dormitorios</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={bedroomCount}
              onChangeText={setBedroomCount}
              placeholder="2"
            />
          </View>

          <View style={[styles.inputContainer, styles.half]}>
            <Text style={styles.label}>Piso</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={floor}
              onChangeText={setFloor}
              placeholder="2"
            />
          </View>

        </View>

        <Text style={styles.label}>Habitación en renta</Text>

        <View style={styles.typeContainer}>

          <TouchableOpacity
            style={[styles.typeButton, roomOwnership === 'PRIVATE' && styles.activeType]}
            onPress={() => setRoomOwnership('PRIVATE')}
          >
            <Text style={roomOwnership === 'PRIVATE' ? styles.activeText : styles.typeText}>
              Propia
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.typeButton, roomOwnership === 'SHARED' && styles.activeType]}
            onPress={() => setRoomOwnership('SHARED')}
          >
            <Text style={roomOwnership === 'SHARED' ? styles.activeText : styles.typeText}>
              Compartida
            </Text>
          </TouchableOpacity>

        </View>

        <Text style={styles.label}>Áreas de la propiedad</Text>

        <View style={styles.chipsContainer}>

          {AMENITY_OPTIONS.map((option) => (

            <TouchableOpacity
              key={option.value}
              style={[styles.chip, amenities.includes(option.value) && styles.chipActive]}
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
              value={allowedPetTypes}
              onChangeText={setAllowedPetTypes}
              placeholder="Perros, gatos..."
            />
          </View>
        )}

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Áreas privadas</Text>
          <TextInput
            style={styles.input}
            value={privateAreas}
            onChangeText={setPrivateAreas}
            placeholder="Recámara, baño..."
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Áreas compartidas</Text>
          <TextInput
            style={styles.input}
            value={sharedAreas}
            onChangeText={setSharedAreas}
            placeholder="Cocina, sala..."
          />
        </View>

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
            value={extraServices}
            onChangeText={setExtraServices}
            placeholder="Gas, TV de paga..."
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Colonia o zona</Text>
          <TextInput
            style={styles.input}
            value={neighborhood}
            onChangeText={setNeighborhood}
            placeholder="Centro"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Cercanía a universidad o punto de referencia</Text>
          <TextInput
            style={styles.input}
            value={nearbyLandmark}
            onChangeText={setNearbyLandmark}
            placeholder="A 10 min de la UAC"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Duración mínima de renta (meses)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={minStayMonths}
            onChangeText={setMinStayMonths}
            placeholder="6"
          />
        </View>

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
              style={[styles.chip, seekingGender === option.value && styles.chipActive]}
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
            value={hostDescription}
            onChangeText={setHostDescription}
            placeholder="Cuéntanos sobre ti..."
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>¿Qué tipo de roomie buscas?</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            multiline
            value={seekingRoommateBio}
            onChangeText={setSeekingRoommateBio}
            placeholder="Personalidad, hábitos, responsabilidades a compartir..."
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Reglas de convivencia (una por línea)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            multiline
            value={houseRules}
            onChangeText={setHouseRules}
            placeholder={'No fiestas después de las 11pm\nMantener áreas comunes limpias'}
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