import { useEffect, useState } from "react";
import { FlatList, Linking, Pressable, StyleSheet, Text, View } from "react-native";
import * as Location from "expo-location";
import { shows, Show } from "../../data/shows";
import { colors } from "../../theme";

function miles(aLat: number, aLng: number, bLat: number, bLng: number) {
  const R = 3959;
  const dLat = ((bLat - aLat) * Math.PI) / 180;
  const dLng = ((bLng - aLng) * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((aLat * Math.PI) / 180) *
      Math.cos((bLat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h)));
}

type ShowWithDist = Show & { dist?: number };

export default function ShowsScreen() {
  const [sorted, setSorted] = useState<ShowWithDist[]>(shows);
  const [locStatus, setLocStatus] = useState("locating…");

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setLocStatus("location off");
          return;
        }
        const pos = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = pos.coords;
        setSorted(
          shows
            .map((s) => ({ ...s, dist: miles(latitude, longitude, s.lat, s.lng) }))
            .sort((a, b) => (a.dist ?? 0) - (b.dist ?? 0))
        );
        setLocStatus("near you");
      } catch {
        setLocStatus("location unavailable");
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>🎤 Shows</Text>
      <Text style={styles.sub}>{locStatus}</Text>

      {sorted.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>🎤</Text>
          <Text style={styles.emptyTitle}>No shows booked yet</Text>
          <Text style={styles.emptyBody}>
            When DoubleU announces dates, they will appear here — closest to you first.
          </Text>
        </View>
      ) : (
        <FlatList
          data={sorted}
          keyExtractor={(s) => s.id}
          contentContainerStyle={styles.list}
          renderItem={({ item: s }) => (
            <View style={styles.card}>
              <Text style={styles.date}>{s.date}</Text>
              <Text style={styles.venue}>{s.venue}</Text>
              <Text style={styles.city}>
                {s.city}
                {s.dist != null ? ` · ${s.dist} mi away` : ""}
              </Text>
      {s.note ? <Text style={styles.note}>{s.note}</Text> : null}
              {s.ticketUrl ? (
                <Pressable
                  onPress={() => Linking.openURL(s.ticketUrl!)}
                  style={styles.ticketBtn}
                >
                  <Text style={styles.ticketText}>Get tickets</Text>
                </Pressable>
              ) : null}
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, paddingTop: 60 },
  heading: { color: colors.text, fontSize: 24, fontWeight: "bold", paddingHorizontal: 20 },
  sub: { color: colors.muted, fontSize: 12, paddingHorizontal: 20, marginTop: 4 },
  list: { padding: 20 },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  date: { color: colors.orange, fontSize: 12, fontWeight: "bold", letterSpacing: 1 },
  venue: { color: colors.text, fontSize: 18, fontWeight: "bold", marginTop: 6 },
  city: { color: colors.muted, fontSize: 14, marginTop: 2 },
  note: { color: colors.muted, fontSize: 13, marginTop: 6, fontStyle: "italic" },
  ticketBtn: {
    backgroundColor: colors.orange,
    borderRadius: 8,
    paddingVertical: 10,
    marginTop: 12,
    alignItems: "center",
  },
  ticketText: { color: "#000", fontWeight: "bold", fontSize: 14 },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", padding: 40 },
  emptyEmoji: { fontSize: 48 },
  emptyTitle: { color: colors.text, fontSize: 18, fontWeight: "bold", marginTop: 16 },
  emptyBody: { color: colors.muted, fontSize: 14, textAlign: "center", marginTop: 8, lineHeight: 20 },
});
