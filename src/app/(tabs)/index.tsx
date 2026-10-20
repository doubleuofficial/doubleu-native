import { useState } from "react";
import { Link } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors } from "../../theme";
import { notifyLocal, notificationsAvailable } from "../../hooks/usePushNotifications";

const cards = [
  { href: "/radio", emoji: "📻", title: "Radio", sub: "Every track, back to back" },
  { href: "/cases", emoji: "📁", title: "Case Files", sub: "Lyrics & stories" },
  { href: "/news", emoji: "📰", title: "News", sub: "Drops & updates" },
  { href: "/shows", emoji: "🎤", title: "Shows", sub: "Near you" },
] as const;

const ALERTS_KEY = "doubleu:alerts-enabled";

export default function HomeScreen() {
  const [alerts, setAlerts] = useState(false);

  async function toggleAlerts(value: boolean) {
    setAlerts(value);
    await AsyncStorage.setItem(ALERTS_KEY, value ? "1" : "0");
    if (value) {
      await notifyLocal(
        "🔔 You're on the list",
        "DoubleU will hit you when new drops and shows land."
      );
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.brand}>DOUBLEU</Text>
      <Text style={styles.tagline}>No stories left behind.</Text>

      <View style={styles.grid}>
        {cards.map((c) => (
          <Link key={c.href} href={c.href} asChild>
            <Pressable style={styles.card}>
              <Text style={styles.emoji}>{c.emoji}</Text>
              <Text style={styles.cardTitle}>{c.title}</Text>
              <Text style={styles.cardSub}>{c.sub}</Text>
            </Pressable>
          </Link>
        ))}
      </View>

      <Link href="/vault" asChild>
        <Pressable style={styles.vaultCard}>
          <Text style={styles.emoji}>🔒</Text>
          <Text style={styles.cardTitle}>The Vault</Text>
          <Text style={styles.cardSub}>App-exclusive. Enter the code.</Text>
        </Pressable>
      </Link>

      {notificationsAvailable ? (
        <View style={styles.alertsCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.alertsTitle}>🔔 Drop alerts</Text>
            <Text style={styles.alertsSub}>
              Get notified when new music and shows drop.
            </Text>
          </View>
          <Switch
            value={alerts}
            onValueChange={toggleAlerts}
            trackColor={{ false: colors.border, true: colors.orange }}
          />
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 20, paddingTop: 60 },
  brand: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.orange,
    letterSpacing: 4,
  },
  tagline: { color: colors.muted, marginTop: 4, fontSize: 14 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginTop: 24 },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: 20,
    width: "48%",
    alignItems: "center",
  },
  emoji: { fontSize: 32 },
  cardTitle: { color: colors.text, fontWeight: "bold", marginTop: 8, fontSize: 16 },
  cardSub: { color: colors.muted, fontSize: 12, marginTop: 2, textAlign: "center" },
  vaultCard: {
    backgroundColor: colors.surface,
    borderColor: colors.yellow,
    borderWidth: 1,
    borderRadius: 12,
    padding: 20,
    marginTop: 12,
    alignItems: "center",
  },
  alertsCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  alertsTitle: { color: colors.text, fontWeight: "bold", fontSize: 16 },
  alertsSub: { color: colors.muted, fontSize: 12, marginTop: 4 },
});
