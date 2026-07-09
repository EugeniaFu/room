import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
  SafeAreaView,
  Keyboard,
} from 'react-native';

import {
  useLocalSearchParams,
  router,
} from 'expo-router';

import Ionicons from '@expo/vector-icons/Ionicons';

import api from '@/src/services/api';

import { useAuth } from '@/src/context/AuthContext';

import socket from '@/src/services/socket';

const PRIMARY = '#6C63FF';

export default function ChatScreen() {

  const { id } =
    useLocalSearchParams();

  const { user } =
    useAuth();

  const scrollRef =
    useRef<ScrollView>(null);

  const [messages, setMessages] =
    useState<any[]>([]);

  const [conversation, setConversation] =
    useState<any>(null);

  const [content, setContent] =
    useState('');

  const [loading, setLoading] =
    useState(true);

  const [sending, setSending] =
    useState(false);

  const loadConversation =
    async () => {

      try {

        const response =
          await api.get(
            `/conversations/${id}`
          );

        setConversation(
          response.data
        );

        setMessages(
          response.data.messages || []
        );

        setTimeout(() => {

          scrollRef.current?.scrollToEnd({
            animated: true,
          });

        }, 150);

      } catch (error) {

        console.log(
          'ERROR CONVERSATION:',
          error
        );

      } finally {

        setLoading(false);
      }
    };

  useEffect(() => {

    loadConversation();

    socket.emit(
      'joinConversation',
      id
    );

    const handleNewMessage =
      (message: any) => {

        setMessages((prev) => {

          const exists =
            prev.some(
              (item) =>
                item.id === message.id
            );

          if (exists) {
            return prev;
          }

          return [
            ...prev,
            message,
          ];
        });

        setTimeout(() => {

          scrollRef.current?.scrollToEnd({
            animated: true,
          });

        }, 150);
      };

    socket.on(
      'newMessage',
      handleNewMessage
    );

    // CUANDO ABRE EL TECLADO
    // HACE SCROLL AUTOMÁTICO
    const keyboardShowListener =
      Keyboard.addListener(
        'keyboardDidShow',
        () => {

          setTimeout(() => {

            scrollRef.current?.scrollToEnd({
              animated: true,
            });

          }, 100);
        }
      );

    return () => {

      socket.off(
        'newMessage',
        handleNewMessage
      );

      keyboardShowListener.remove();
    };

  }, []);

  const sendMessage =
    async () => {

      if (
        !content.trim() ||
        sending
      ) return;

      try {

        setSending(true);

        await api.post(
          `/conversations/${id}/messages`,
          {
            content,
          }
        );

        setContent('');

        // BAJA AUTOMÁTICAMENTE
        setTimeout(() => {

          scrollRef.current?.scrollToEnd({
            animated: true,
          });

        }, 100);

      } catch (error) {

        console.log(
          'ERROR SEND:',
          error
        );

      } finally {

        setSending(false);
      }
    };

  const getOtherUser =
    () => {

      if (!conversation)
        return null;

      const participant =
        conversation.participants?.find(
          (p: any) =>
            p.user.id !== user?.id
        );

      return participant?.user;
    };

  const otherUser =
    getOtherUser();

  // INICIAL DEL NOMBRE
  const getInitial =
    (name: string = '') => {

      return name
        ?.trim()
        ?.charAt(0)
        ?.toUpperCase();
    };

  // COMPONENTE AVATAR
  const Avatar =
    ({
      avatarUrl,
      name,
      size = 48,
    }: any) => {

      if (avatarUrl) {

        return (
          <Image
            source={{
              uri: avatarUrl,
            }}
            style={{
              width: size,
              height: size,
              borderRadius: size / 2,
            }}
          />
        );
      }

      return (

        <View
          style={[
            styles.avatarFallback,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
            },
          ]}
        >

          <Text
            style={[
              styles.avatarLetter,
              {
                fontSize:
                  size * 0.4,
              },
            ]}
          >

            {getInitial(name)}

          </Text>

        </View>
      );
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

    <SafeAreaView
      style={styles.safe}
    >

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : 'height'
        }
        keyboardVerticalOffset={
          Platform.OS === 'ios'
            ? 0
            : 0
        }
      >

        <View style={styles.container}>

          {/* HEADER */}
          <View style={styles.header}>

            <TouchableOpacity
              onPress={() =>
                router.back()
              }
            >

              <Ionicons
                name="arrow-back"
                size={24}
                color="#111827"
              />

            </TouchableOpacity>

            <View style={styles.headerCenter}>

              <Avatar
                avatarUrl={
                  otherUser?.profile
                    ?.avatarUrl
                }
                name={
                  otherUser?.profile
                    ?.name ||
                  'Usuario'
                }
                size={48}
              />

              <View
                style={{
                  marginLeft: 12,
                }}
              >

                <Text style={styles.title}>
                  {
                    otherUser?.profile
                      ?.name ||
                    'Usuario'
                  }
                </Text>

                <Text style={styles.subtitle}>
                  Conversación activa
                </Text>

              </View>

            </View>

            <TouchableOpacity>

              <Ionicons
                name="ellipsis-vertical"
                size={22}
                color="#111827"
              />

            </TouchableOpacity>

          </View>

          {/* MENSAJES */}
          <ScrollView
            ref={scrollRef}
            contentContainerStyle={
              styles.messages
            }
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"

            // ESTO HACE QUE EL SCROLL
            // SUBA CON EL TECLADO
            automaticallyAdjustKeyboardInsets={true}

            // AUTO SCROLL
            onContentSizeChange={() =>
              scrollRef.current?.scrollToEnd({
                animated: true,
              })
            }
          >

            {messages.length === 0 && (

              <View style={styles.emptyBox}>

                <Ionicons
                  name="chatbubble-outline"
                  size={55}
                  color="#9CA3AF"
                />

                <Text style={styles.emptyText}>
                  Inicia la conversación 👋
                </Text>

              </View>

            )}

            {messages.map(
              (message: any) => {

                const isMine =
                  String(
                    message.senderId
                  ) ===
                  String(user?.id);

                return (

                  <View
                    key={message.id}
                    style={[
                      styles.messageRow,
                      {
                        justifyContent:
                          isMine
                            ? 'flex-end'
                            : 'flex-start',
                      },
                    ]}
                  >

                    {!isMine && (

                      <Avatar
                        avatarUrl={
                          otherUser?.profile
                            ?.avatarUrl
                        }
                        name={
                          otherUser?.profile
                            ?.name ||
                          'Usuario'
                        }
                        size={34}
                      />

                    )}

                    <View
                      style={[
                        styles.messageBubble,
                        isMine
                          ? styles.messageRight
                          : styles.messageLeft,
                      ]}
                    >

                      <Text
                        style={
                          isMine
                            ? styles.messageTextWhite
                            : styles.messageText
                        }
                      >

                        {message.content}

                      </Text>

                      <Text
                        style={
                          isMine
                            ? styles.timeWhite
                            : styles.timeDark
                        }
                      >

                        {new Date(
                          message.createdAt
                        ).toLocaleTimeString(
                          [],
                          {
                            hour: '2-digit',
                            minute: '2-digit',
                          }
                        )}

                      </Text>

                    </View>

                  </View>
                );
              }
            )}

          </ScrollView>

          {/* INPUT */}
          <View
            style={
              styles.inputContainer
            }
          >

            <TextInput
              placeholder="Escribe un mensaje..."
              placeholderTextColor="#9CA3AF"
              style={styles.input}
              value={content}
              onChangeText={
                setContent
              }
              multiline
              textAlignVertical="top"

              // CUANDO TOCAS EL INPUT
              // BAJA AUTOMÁTICO
              onFocus={() => {

                setTimeout(() => {

                  scrollRef.current?.scrollToEnd({
                    animated: true,
                  });

                }, 200);
              }}
            />

            <TouchableOpacity
              style={[
                styles.sendButton,
                {
                  opacity:
                    sending ? 0.7 : 1,
                },
              ]}
              onPress={sendMessage}
              disabled={sending}
            >

              {sending ? (

                <ActivityIndicator
                  color="#fff"
                  size="small"
                />

              ) : (

                <Ionicons
                  name="send"
                  size={20}
                  color="#fff"
                />

              )}

            </TouchableOpacity>

          </View>

        </View>

      </KeyboardAvoidingView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FB',
  },

  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },

  header: {
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },

  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 15,
  },

  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },

  subtitle: {
    marginTop: 2,
    fontSize: 13,
    color: '#6B7280',
  },

  // IMPORTANTE
  // MÁS ESPACIO ABAJO
  messages: {
    padding: 20,
    paddingBottom: 120,
    flexGrow: 1,
  },

  emptyBox: {
    marginTop: 80,
    alignItems: 'center',
  },

  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6B7280',
  },

  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 16,
  },

  messageBubble: {
    maxWidth: '78%',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 20,
  },

  messageLeft: {
    backgroundColor: '#E5E7EB',
    borderBottomLeftRadius: 5,
    marginLeft: 8,
  },

  messageRight: {
    backgroundColor: PRIMARY,
    borderBottomRightRadius: 5,
  },

  messageText: {
    color: '#111827',
    fontSize: 14,
    lineHeight: 20,
  },

  messageTextWhite: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
  },

  timeDark: {
    marginTop: 6,
    fontSize: 10,
    color: '#6B7280',
    alignSelf: 'flex-end',
  },

  timeWhite: {
    marginTop: 6,
    fontSize: 10,
    color: '#E5E7EB',
    alignSelf: 'flex-end',
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom:
      Platform.OS === 'ios'
        ? 25
        : 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },

  input: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingTop: 12,
    paddingBottom: 12,
    minHeight: 48,
    maxHeight: 120,
    marginRight: 10,
    color: '#111827',
    fontSize: 14,
  },

  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarFallback: {
    backgroundColor: PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarLetter: {
    color: '#fff',
    fontWeight: '700',
  },

});