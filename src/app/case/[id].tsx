import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Linking, Pressable, ScrollView, StyleSheet, Text, View, Image } from "react-native";
import { getTrack } from "../../data/tracks";
import { colors } from "../../theme";

export default function CaseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const track = getTrack(id);

  if (!track) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: "Not found" }} />
        <Text style={styles.title}>Case not found.</Text>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>
      </View>
    );
  }

  const links = [
    { label: "Spotify", url: track.spotifyUrl },
    { label: "Apple Music", url: track.appleUrl },
    { label: "YouTube", url: track.youtubeUrl },
  ].filter((l) => l.url);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Stack.Screen
        options={{
          title: track.title,
          headerShown: true,
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
        }}
      />
      <Text style={styles.caseNo}>{track.caseNo ?? "CASE FILE"}</Text>
      {track.artwork ? (
        <Image source={track.artwork} style={styles.artwork} />
      ) : null}
      <Text style={styles.title}>{track.title}</Text>
      {track.releaseDate ? (
        <Text style={styles.date}>Released: {track.releaseDate}</Text>
      ) : null}

      {track.story ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>THE STORY</Text>
          <Text style={styles.body}>{track.story}</Text>
        </View>
      ) : null}

      {track.lyrics ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>LYRICS</Text>
          <Text style={styles.lyrics}>{track.lyrics}</Text>
        </View>
      ) : null}

      {track.credits ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CREDITS</Text>
          <Text style={styles.body}>{track.credits}</Text>
        </View>
      ) : null}

      {links.length > 0 ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>LISTEN</Text>
          <View style={styles.linkRow}>
            {links.map((l) => (
              <Pressable
                key={l.label}
                onPress={() => Linking.openURL(l.url!)}
                style={styles.linkBtn}
              >
                <Text style={styles.linkText}>{l.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 20 },
  caseNo: { color: colors.yellow, fontSize: 12, fontWeight: "bold", letterSpacing: 2 },
  artwork: { width: "100%", aspectRatio: 1, borderRadius: 12, marginTop: 12 },
  title: { color: colors.text, fontSize: 28, fontWeight: "bold", marginTop: 6 },
  date: { color: colors.muted, fontSize: 13, marginTop: 4 },
  section: { marginTop: 24 },
  sectionTitle: {
    color: colors.orange,
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 2,
    marginBottom: 8,
  },
  body: { color: colors.text, fontSize: 15, lineHeight: 22 },
  lyrics: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 24,
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 16,
  },
  linkRow: { flexDirection: "row", gap: 10 },
  linkBtn: {
    backgroundColor: colors.surface,
    borderColor: colors.orange,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  linkText: { color: colors.orange, fontWeight: "bold" },
  backBtn: { marginTop: 16 },
  backText: { color: colors.orange, fontSize: 16 },
});
