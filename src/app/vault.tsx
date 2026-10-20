import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack } from "expo-router";
import { UNLOCK_CODE, kindEmoji, kindLabel, vaultItems } from "../data/vault";
import { colors } from "../theme";

const STORAGE_KEY = "doubleu:vault-unlocked";

export default function VaultScreen() {
  const [unlocked, setUnlocked] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((v) => {
      setUnlocked(v === "1");
      setLoading(false);
    });
  }, []);

  async function tryUnlock() {
    if (code.trim().toUpperCase() === UNLOCK_CODE) {
      await AsyncStorage.setItem(STORAGE_KEY, "1");
      setUnlocked(true);
      setError(false);
    } else {
      setError(true);
    }
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: "The Vault", headerShown: true, headerStyle: { backgroundColor: colors.surface }, headerTintColor: colors.text }} />
      </View>
    );
  }

  if (!unlocked) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.lockContent}>
        <Stack.Screen
          options={{
            title: "The Vault",
            headerShown: true,
            headerStyle: { backgroundColor: colors.surface },
            headerTintColor: colors.text,
          }}
        />
        <Text style={styles.lockEmoji}>🔒</Text>
        <Text style={styles.lockTitle}>THE VAULT</Text>
        <Text style={styles.lockSub}>
          Unreleased snippets, demos, and notes from DoubleU. App-exclusive.
        </Text>
        <Text style={styles.lockHint}>Enter the code from the socials:</Text>
        <TextInput
          style={[styles.input, error && styles.inputError]}
          value={code}
          onChangeText={(t) => {
            setCode(t);
            setError(false);
          }}
          autoCapitalize="characters"
          placeholder="CODE"
          placeholderTextColor={colors.muted}
          onSubmitEditing={tryUnlock}
        />
        {error ? <Text style={styles.errText}>Wrong code. Try again.</Text> : null}
        <Pressable onPress={tryUnlock} style={styles.unlockBtn}>
          <Text style={styles.unlockText}>Unlock</Text>
        </Pressable>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Stack.Screen
        options={{
          title: "The Vault",
          headerShown: true,
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
        }}
      />
      <Text style={styles.heading}>🔓 Unlocked</Text>
      <Text style={styles.sub}>You are in. This is only in the app.</Text>
      {vaultItems.map((item) => (
        <View key={item.id} style={styles.card}>
          <Text style={styles.kind}>
            {kindEmoji[item.kind]} {kindLabel[item.kind]}
          </Text>
          <Text style={styles.itemTitle}>{item.title}</Text>
          <Text style={styles.itemDesc}>{item.description}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 20 },
  lockContent: { padding: 20, alignItems: "center", paddingTop: 80 },
  lockEmoji: { fontSize: 64 },
  lockTitle: {
    color: colors.yellow,
    fontSize: 28,
    fontWeight: "bold",
    letterSpacing: 4,
    marginTop: 16,
  },
  lockSub: { color: colors.muted, textAlign: "center", marginTop: 12, lineHeight: 20 },
  lockHint: { color: colors.text, marginTop: 24, fontSize: 14 },
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 8,
    color: colors.text,
    fontSize: 20,
    letterSpacing: 4,
    textAlign: "center",
    padding: 14,
    marginTop: 12,
    width: "80%",
  },
  inputError: { borderColor: "#ff4444" },
  errText: { color: "#ff4444", marginTop: 8 },
  unlockBtn: {
    backgroundColor: colors.yellow,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 48,
    marginTop: 16,
  },
  unlockText: { color: "#000", fontWeight: "bold", fontSize: 16 },
  heading: { color: colors.text, fontSize: 24, fontWeight: "bold" },
  sub: { color: colors.muted, fontSize: 13, marginTop: 4, marginBottom: 16 },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  kind: { color: colors.yellow, fontSize: 11, fontWeight: "bold", letterSpacing: 1 },
  itemTitle: { color: colors.text, fontSize: 17, fontWeight: "bold", marginTop: 6 },
  itemDesc: { color: colors.muted, fontSize: 14, marginTop: 6, lineHeight: 20 },
});
