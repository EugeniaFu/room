import React, {
  useEffect,
  useState,
  useCallback,
} from 'react';

import {
  useFocusEffect,
} from '@react-navigation/native';

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  ActivityIndicator,
  Alert
} from 'react-native';

import Ionicons from '@expo/vector-icons/Ionicons';

import { useAuth } from '@/src/context/AuthContext';

import {
  router,
  useLocalSearchParams,
} from 'expo-router';

import api from '@/src/services/api';

const PRIMARY = '#6C63FF';

export default function Home() {

  const { user } = useAuth();

  const params = useLocalSearchParams();

  const currentRole = params.role;

  const isRoomie =
    currentRole === 'roomie';

  const isHost =
    currentRole === 'host';

  const isVerified =
    user?.verificationStatus === 'APPROVED';

  const [listings, setListings] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [selectedListing, setSelectedListing] =
    useState<any>(null);

  const [modalVisible, setModalVisible] =
    useState(false);

  const [search, setSearch] =
    useState('');

    useFocusEffect(

      useCallback(() => {

        loadListings();

      }, [])

    );

  const loadListings = async () => {

    try {

      setLoading(true);

      const endpoint = isHost
        ? '/listings/my-listings'
        : '/listings';

      const response =
        await api.get(endpoint);

      setListings(response.data);

    } catch (error) {

      console.log(
        'ERROR LISTINGS:',
        error
      );

    } finally {

      setLoading(false);

    }
  };

  const filteredListings =
    listings.filter((listing) => {

      // como roomie, nunca te muestres a ti mismo en el feed
      if (isRoomie && listing.ownerId === user?.id) {
        return false;
      }

      const city =
        listing.location?.city
          ?.toLowerCase() || '';

      const title =
        listing.title
          ?.toLowerCase() || '';

      return (
        city.includes(
          search.toLowerCase()
        ) ||
        title.includes(
          search.toLowerCase()
        )
      );
    });

  const openDetails = (
    listing: any
  ) => {

    setSelectedListing(listing);

    setModalVisible(true);
  };

    const handleDelete = async () => {

    try {

      Alert.alert(
        'Eliminar',
        '¿Seguro que deseas eliminar esta publicación?',
        [
          {
            text: 'Cancelar',
            style: 'cancel',
          },

          {
            text: 'Eliminar',

            style: 'destructive',

            onPress: async () => {

              try {

                await api.delete(
                  `/listings/${selectedListing.id}`
                );

                setModalVisible(false);

                loadListings();

                Alert.alert(
                  'Éxito',
                  'Publicación eliminada'
                );

              } catch (error) {

                Alert.alert(
                  'Error',
                  'No se pudo eliminar'
                );

              }
            },
          },
        ]
      );

    } catch (error) {

      console.log(error);

    }
  };

  const AMENITY_LABELS: Record<string, string> = {
    LIVING_ROOM: 'Sala',
    KITCHEN: 'Cocina',
    BATHROOM: 'Baño',
    YARD: 'Patio',
    TERRACE: 'Terraza',
    LAUNDRY_AREA: 'Área de lavado',
    PARKING: 'Estacionamiento',
  };

  const SERVICE_LABELS: Record<string, string> = {
    luz: 'Luz',
    agua: 'Agua',
    internet: 'Internet',
  };

  const GENDER_LABELS: Record<string, string> = {
    MALE: 'Hombres',
    FEMALE: 'Mujeres',
    OTHER: 'Otro',
  };

  const REVIEW_STATUS_LABELS: Record<
    string,
    { label: string; color: string }
  > = {
    PENDING: { label: 'En revisión', color: '#F59E0B' },
    APPROVED: { label: 'Aprobada', color: '#16A34A' },
    REJECTED: { label: 'Rechazada', color: '#DC2626' },
  };

  const getImage = (listing: any) => {

    if (
      listing.images &&
      listing.images.length > 0
    ) {

      return listing.images[0].url;
    }

    return 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85';
  };

  return (

    <View style={styles.container}>

      <ScrollView
        showsVerticalScrollIndicator={false}
      >

        {/* HEADER */}
        <View style={styles.header}>

          <Text style={styles.title}>
            {isHost
              ? 'Tus propiedades'
              : 'Encuentra tu espacio ideal'}
          </Text>

          <Text style={styles.subtitle}>
            {isHost
              ? 'Administra todas tus publicaciones'
              : 'Descubre habitaciones y roomies'}
          </Text>

        </View>

        {/* SEARCH */}
        {isRoomie && (

          <View style={styles.searchContainer}>

            <Ionicons
              name="search"
              size={20}
              color="#9CA3AF"
            />

            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Buscar ciudad o publicación..."
              placeholderTextColor="#9CA3AF"
              style={styles.input}
            />

          </View>

        )}

        {/* HOST BUTTON */}
        {isHost && isVerified && (

          <TouchableOpacity
            style={styles.addButton}
            onPress={() =>
              router.push(
                '/(listings)/create'
              )
            }
          >

            <Ionicons
              name="add"
              size={20}
              color="#fff"
            />

            <Text style={styles.addButtonText}>
              Nueva publicación
            </Text>

          </TouchableOpacity>

        )}

        {/* HOST NOT VERIFIED */}
        {isHost && !isVerified && (

          <TouchableOpacity
            style={styles.verifyBanner}
            onPress={() =>
              router.push('/(verification)/documents' as any)
            }
          >

            <Ionicons
              name="shield-outline"
              size={22}
              color="#B45309"
            />

            <View style={{ flex: 1 }}>

              <Text style={styles.verifyBannerTitle}>
                {user?.verificationStatus === 'REJECTED'
                  ? 'Tu verificación fue rechazada'
                  : 'Verifica tu cuenta para publicar'}
              </Text>

              <Text style={styles.verifyBannerText}>
                Sube tu INE, comprobante de domicilio y una foto.
                Un administrador debe aprobarlos antes de que puedas publicar.
              </Text>

            </View>

            <Ionicons
              name="chevron-forward"
              size={20}
              color="#B45309"
            />

          </TouchableOpacity>

        )}

        {/* LOADING */}
        {loading && (

          <ActivityIndicator
            size="large"
            color={PRIMARY}
            style={{
              marginTop: 50,
            }}
          />

        )}

        {/* EMPTY */}
        {!loading &&
          filteredListings.length === 0 && (

          <View style={styles.emptyBox}>

            <Ionicons
              name="home-outline"
              size={55}
              color="#9CA3AF"
            />

            <Text style={styles.emptyText}>
              {isHost
                ? 'Aún no tienes publicaciones'
                : 'No hay publicaciones disponibles'}
            </Text>

          </View>

        )}

        {/* LISTINGS */}
        {!loading &&
          filteredListings.map((listing) => (

          <View
            key={listing.id}
            style={styles.card}
          >

            {/* IMAGE */}
            <Image
              source={{
                uri: getImage(listing),
              }}
              style={styles.cardImage}
            />

            {/* STATUS */}
            {isHost && (

              <View style={styles.statusBadge}>

                <Text style={styles.statusText}>
                  {listing.status}
                </Text>

              </View>

            )}

            {/* REVIEW STATUS */}
            {isHost && listing.reviewStatus && (

              <View
                style={[
                  styles.reviewBadge,
                  {
                    backgroundColor:
                      REVIEW_STATUS_LABELS[listing.reviewStatus]
                        ?.color || '#6B7280',
                  },
                ]}
              >

                <Text style={styles.statusText}>
                  {
                    REVIEW_STATUS_LABELS[listing.reviewStatus]
                      ?.label || listing.reviewStatus
                  }
                </Text>

              </View>

            )}

            <View style={styles.cardContent}>

              {/* PRICE */}
              <View style={styles.rowBetween}>

                <Text style={styles.price}>
                  ${listing.price} MXN
                </Text>

                <View style={styles.badge}>

                  <Text style={styles.badgeText}>
                    {listing.type}
                  </Text>

                </View>

              </View>

              {/* TITLE */}
              <Text style={styles.cardTitle}>
                {listing.title}
              </Text>

              {/* DESCRIPTION */}
              <Text
                style={styles.description}
                numberOfLines={2}
              >
                {listing.description}
              </Text>

              {/* LOCATION */}
              <View style={styles.locationContainer}>

                <Ionicons
                  name="location"
                  size={16}
                  color="#6B7280"
                />

                <Text style={styles.locationText}>
                  {listing.location?.city},{' '}
                  {listing.location?.state}
                </Text>

              </View>

              {/* OWNER */}
              {isRoomie && (

                <View style={styles.ownerBox}>

                  <Ionicons
                    name="person-circle"
                    size={22}
                    color={PRIMARY}
                  />

                  <Text style={styles.ownerText}>
                    {
                      listing.owner?.profile
                        ?.name
                    }
                  </Text>

                </View>

              )}

              {/* HOST HISTORY */}
              {isHost && (

                <View style={styles.hostInfo}>

                  <View style={styles.hostStat}>

                    <Ionicons
                      name="calendar-outline"
                      size={16}
                      color={PRIMARY}
                    />

                    <Text style={styles.hostStatText}>
                      {
                        new Date(
                          listing.createdAt
                        ).toLocaleDateString()
                      }
                    </Text>

                  </View>

                  <View style={styles.hostStat}>

                    <Ionicons
                      name="images-outline"
                      size={16}
                      color={PRIMARY}
                    />

                    <Text style={styles.hostStatText}>
                      {
                        listing.images?.length || 0
                      } fotos
                    </Text>

                  </View>

                </View>

              )}

              {/* BUTTON */}
              {/* VER DETALLES */}
              <TouchableOpacity
                style={styles.detailsButton}
                onPress={() =>
                  openDetails(listing)
                }
              >

                <Text style={styles.detailsButtonText}>
                  Ver detalles
                </Text>

              </TouchableOpacity>

              {/* EDITAR */}
              {isHost && (

                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() =>
                    router.push({
                      pathname: '/(listings)/edit/[id]',
                      params: {
                        id: listing.id,
                      },
                    })
                  }
                >

                  <Ionicons
                    name="create-outline"
                    size={18}
                    color="#fff"
                  />

                  <Text style={styles.editButtonText}>
                    Editar publicación
                  </Text>

                </TouchableOpacity>

              )}

            </View>

          </View>

        ))}

      </ScrollView>

      {/* MODAL */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
      >

        <View style={styles.modalOverlay}>

          <View style={styles.modalContent}>

            {selectedListing && (

              <ScrollView
                showsVerticalScrollIndicator={false}
              >

                {/* IMAGES */}
                <ScrollView
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  style={styles.imagesSlider}
                >

                  {selectedListing.images &&
                  selectedListing.images.length > 0 ? (

                    selectedListing.images.map(
                      (img: any) => (

                      <Image
                        key={img.id}
                        source={{
                          uri: img.url,
                        }}
                        style={styles.modalImage}
                      />

                    ))

                  ) : (

                    <Image
                      source={{
                        uri:
                          'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85',
                      }}
                      style={styles.modalImage}
                    />

                  )}

                </ScrollView>

                <Text style={styles.modalTitle}>
                  {selectedListing.title}
                </Text>

                <Text style={styles.modalPrice}>
                  ${selectedListing.price} MXN
                </Text>

                <Text style={styles.modalDescription}>
                  {
                    selectedListing.description
                  }
                </Text>

                <Text style={styles.modalInfo}>
                  📍 {
                    selectedListing.location?.city
                  }, {
                    selectedListing.location?.state
                  }
                </Text>

                <Text style={styles.modalInfo}>
                  🏠 Tipo: {
                    selectedListing.type
                  }
                </Text>

                <Text style={styles.modalInfo}>
                  📸 Fotos: {
                    selectedListing.images
                      ?.length || 0
                  }
                </Text>

                {isRoomie && (

                  <Text style={styles.modalInfo}>
                    👤 Host: {
                      selectedListing.owner
                        ?.profile?.name
                    }
                  </Text>

                )}

                {isHost && selectedListing.reviewStatus && (

                  <Text style={styles.modalInfo}>
                    🛡️ Estado de revisión:{' '}
                    {
                      REVIEW_STATUS_LABELS[
                        selectedListing.reviewStatus
                      ]?.label || selectedListing.reviewStatus
                    }
                  </Text>

                )}

                {/* DETALLE EXTENDIDO */}
                <View style={styles.detailSection}>

                  <Text style={styles.detailSectionTitle}>
                    Detalles de la propiedad
                  </Text>

                  <Text style={styles.modalInfo}>
                    🔑 Renta:{' '}
                    {selectedListing.rentalMode === 'NEW_ONLY'
                      ? 'Renta nueva'
                      : 'Vivienda compartida'}
                  </Text>

                  {selectedListing.roomOwnership && (
                    <Text style={styles.modalInfo}>
                      🚪 Habitación:{' '}
                      {selectedListing.roomOwnership === 'SHARED'
                        ? 'Compartida'
                        : 'Propia'}
                    </Text>
                  )}

                  {selectedListing.bedroomCount != null && (
                    <Text style={styles.modalInfo}>
                      🛏️ Dormitorios: {selectedListing.bedroomCount}
                    </Text>
                  )}

                  {selectedListing.floor != null && (
                    <Text style={styles.modalInfo}>
                      🏢 Piso: {selectedListing.floor}
                    </Text>
                  )}

                  {selectedListing.amenities?.length > 0 && (

                    <View style={styles.pillsRow}>
                      {selectedListing.amenities.map((item: string) => (
                        <View key={item} style={styles.pill}>
                          <Text style={styles.pillText}>
                            {AMENITY_LABELS[item] || item}
                          </Text>
                        </View>
                      ))}
                    </View>

                  )}

                </View>

                <View style={styles.detailSection}>

                  <Text style={styles.detailSectionTitle}>
                    Convivencia
                  </Text>

                  <Text style={styles.modalInfo}>
                    🐾 Mascotas actualmente:{' '}
                    {selectedListing.hasPetsNow ? 'Sí' : 'No'}
                  </Text>

                  <Text style={styles.modalInfo}>
                    🐶 ¿Se permiten mascotas?:{' '}
                    {selectedListing.petsAllowed ? 'Sí' : 'No'}
                    {selectedListing.petsAllowed &&
                      selectedListing.allowedPetTypes?.length > 0 &&
                      ` (${selectedListing.allowedPetTypes.join(', ')})`}
                  </Text>

                  {selectedListing.privateAreas?.length > 0 && (
                    <Text style={styles.modalInfo}>
                      🔒 Áreas privadas:{' '}
                      {selectedListing.privateAreas.join(', ')}
                    </Text>
                  )}

                  {selectedListing.sharedAreas?.length > 0 && (
                    <Text style={styles.modalInfo}>
                      🤝 Áreas compartidas:{' '}
                      {selectedListing.sharedAreas.join(', ')}
                    </Text>
                  )}

                  {selectedListing.houseRules?.length > 0 && (
                    <>
                      <Text style={[styles.modalInfo, { marginTop: 8 }]}>
                        📋 Reglas de convivencia:
                      </Text>
                      {selectedListing.houseRules.map(
                        (rule: string, index: number) => (
                          <Text key={index} style={styles.ruleText}>
                            • {rule}
                          </Text>
                        )
                      )}
                    </>
                  )}

                </View>

                <View style={styles.detailSection}>

                  <Text style={styles.detailSectionTitle}>
                    Servicios y ubicación
                  </Text>

                  {selectedListing.includedServices?.length > 0 && (
                    <View style={styles.pillsRow}>
                      {selectedListing.includedServices.map(
                        (item: string) => (
                          <View key={item} style={styles.pill}>
                            <Text style={styles.pillText}>
                              {SERVICE_LABELS[item] || item}
                            </Text>
                          </View>
                        )
                      )}
                    </View>
                  )}

                  {selectedListing.extraServices?.length > 0 && (
                    <Text style={styles.modalInfo}>
                      💵 Servicios adicionales:{' '}
                      {selectedListing.extraServices.join(', ')}
                    </Text>
                  )}

                  {selectedListing.neighborhood && (
                    <Text style={styles.modalInfo}>
                      📍 Colonia/zona: {selectedListing.neighborhood}
                    </Text>
                  )}

                  {selectedListing.nearbyLandmark && (
                    <Text style={styles.modalInfo}>
                      🎓 Cercanía: {selectedListing.nearbyLandmark}
                    </Text>
                  )}

                  {selectedListing.minStayMonths != null && (
                    <Text style={styles.modalInfo}>
                      📅 Duración mínima: {selectedListing.minStayMonths} meses
                    </Text>
                  )}

                </View>

                <View style={styles.detailSection}>

                  <Text style={styles.detailSectionTitle}>
                    A quién busca el anfitrión
                  </Text>

                  <Text style={styles.modalInfo}>
                    👥 Busca:{' '}
                    {selectedListing.seekingGender
                      ? GENDER_LABELS[selectedListing.seekingGender]
                      : 'Indistinto'}
                  </Text>

                  <Text style={styles.modalInfo}>
                    ♿ Apto para discapacidad:{' '}
                    {selectedListing.wheelchairAccessible ? 'Sí' : 'No'}
                  </Text>

                  {selectedListing.hostDescription && (
                    <Text style={styles.modalInfo}>
                      🗣️ Sobre el anfitrión: {selectedListing.hostDescription}
                    </Text>
                  )}

                  {selectedListing.seekingRoommateBio && (
                    <Text style={styles.modalInfo}>
                      🧭 Busca un roomie: {selectedListing.seekingRoommateBio}
                    </Text>
                  )}

                </View>

                {isRoomie && selectedListing.ownerId !== user?.id && (

                  <TouchableOpacity
                    style={styles.connectButton}
                    onPress={async () => {

                      try {

                        const response = await api.post(
                          '/conversations/start-for-listing',
                          {
                            listingId: selectedListing.id,
                          }
                        );

                        setModalVisible(false);

                        router.push({
                          pathname: '/(chat)/messages/[id]',
                          params: { id: response.data.id },
                        });

                      } catch (error: any) {

                        alert(
                          error?.response?.data?.error ||
                          'Error al iniciar la conversación'
                        );
                      }
                    }}
                  >

                    <Text style={styles.connectButtonText}>
                      Enviar mensaje al anfitrión
                    </Text>

                  </TouchableOpacity>

                )}

                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() =>
                    setModalVisible(false)
                  }
                >

                  <Text style={styles.closeButtonText}>
                    Cerrar
                  </Text>

                </TouchableOpacity>

                {isHost && (

                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={handleDelete}
                  >

                    <Text style={styles.deleteButtonText}>
                      Eliminar publicación
                    </Text>

                  </TouchableOpacity>

                )}

              </ScrollView>

            )}

          </View>

        </View>

      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },

  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    marginBottom: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#111827',
  },

  subtitle: {
    marginTop: 5,
    fontSize: 14,
    color: '#6B7280',
  },

  searchContainer: {
    marginHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    marginBottom: 20,
  },

  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
  },

  addButton: {
    backgroundColor: PRIMARY,
    marginHorizontal: 20,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },

  addButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },

  verifyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },

  verifyBannerTitle: {
    color: '#92400E',
    fontWeight: '700',
    fontSize: 14,
  },

  verifyBannerText: {
    color: '#B45309',
    fontSize: 12,
    marginTop: 4,
    lineHeight: 17,
  },

  card: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 22,
    overflow: 'hidden',
    marginBottom: 25,
    elevation: 3,
  },

  cardImage: {
    width: '100%',
    height: 230,
  },

  statusBadge: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 10,
    backgroundColor: '#16A34A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
  },

  statusText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
    textTransform: 'uppercase',
  },

  reviewBadge: {
    position: 'absolute',
    top: 15,
    left: 15,
    zIndex: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
  },

  detailSection: {
    marginTop: 22,
  },

  detailSectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
    paddingHorizontal: 25,
  },

  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
    marginBottom: 4,
    paddingHorizontal: 25,
  },

  pill: {
    backgroundColor: '#ECEBFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
  },

  pillText: {
    color: PRIMARY,
    fontWeight: '700',
    fontSize: 12,
  },

  ruleText: {
    fontSize: 14,
    color: '#4B5563',
    marginTop: 4,
    lineHeight: 20,
    paddingHorizontal: 25,
  },

  cardContent: {
    padding: 18,
  },

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  price: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
  },

  badge: {
    backgroundColor: '#ECEBFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
  },

  badgeText: {
    color: PRIMARY,
    fontWeight: '700',
    textTransform: 'capitalize',
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 12,
    color: '#111827',
  },

  description: {
    marginTop: 8,
    color: '#6B7280',
    lineHeight: 22,
  },

  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },

  locationText: {
    marginLeft: 6,
    color: '#6B7280',
  },

  ownerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    gap: 6,
  },

  ownerText: {
    color: '#111827',
    fontWeight: '600',
  },

  hostInfo: {
    flexDirection: 'row',
    marginTop: 15,
    gap: 20,
  },

  hostStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  hostStatText: {
    color: '#4B5563',
    fontSize: 13,
    fontWeight: '600',
  },

  detailsButton: {
    backgroundColor: PRIMARY,
    marginTop: 20,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },

  detailsButtonText: {
    color: '#fff',
    fontWeight: '700',
  },

  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },

  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    maxHeight: '90%',
    paddingBottom: 25,
  },

  imagesSlider: {
    width: '100%',
    height: 260,
  },

  modalImage: {
    width: 380,
    height: 260,
  },

  modalTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    paddingHorizontal: 25,
    marginTop: 20,
  },

  modalPrice: {
    fontSize: 22,
    fontWeight: '700',
    color: PRIMARY,
    marginTop: 10,
    paddingHorizontal: 25,
  },

  modalDescription: {
    marginTop: 18,
    fontSize: 15,
    lineHeight: 24,
    color: '#4B5563',
    paddingHorizontal: 25,
  },

  modalInfo: {
    marginTop: 12,
    fontSize: 15,
    color: '#111827',
    paddingHorizontal: 25,
  },

  closeButton: {
    backgroundColor: PRIMARY,
    marginTop: 30,
    marginHorizontal: 25,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },

  closeButtonText: {
    color: '#fff',
    fontWeight: '700',
  },

  emptyBox: {
    alignItems: 'center',
    marginTop: 80,
  },

  emptyText: {
    marginTop: 10,
    color: '#6B7280',
    fontSize: 15,
  },
deleteButton: {
  backgroundColor: '#DC2626',
  marginTop: 15,
  marginHorizontal: 25,
  borderRadius: 14,
  paddingVertical: 16,
  alignItems: 'center',
},
deleteButtonText: {
  color: '#fff',
  fontWeight: '700',
},
editButton: {
  backgroundColor: '#111827',
  marginTop: 10,
  borderRadius: 14,
  paddingVertical: 14,
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'row',
  gap: 8,
},

editButtonText: {
  color: '#fff',
  fontWeight: '700',
},
connectButton: {
  backgroundColor: '#10B981',
  marginHorizontal: 25,
  borderRadius: 14,
  paddingVertical: 16,
  marginTop: 10,
  alignItems: 'center',
},

connectButtonText: {
  color: '#fff',
  fontWeight: '700',
},
});