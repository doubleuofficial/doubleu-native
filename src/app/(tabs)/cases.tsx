import { Link } from "expo-router";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { tracks } from "../../data/tracks";
import { colors } from "../../theme";

export default function CasesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>📁 Case Files</Text>
      <Text style={styles.sub}>Every song is a case. No stories left behind.</Text>
      <FlatList
        data={tracks}
        keyExtractor={(t) => t.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Link href={`/case/${item.id}`} asChild>
            <Pressable style={styles.card}>
              <Text style={styles.caseNo}>{item.caseNo ?? "CASE FILE"}</Text>
              <Text style={styles.title}>{item.title}</Text>
              {item.releaseDate ? (
                <Text style={styles.date}>{item.releaseDate}</Text>
              ) : null}
              <Text style={styles.open}>Open file →</Text>
            </Pressable>
          </Link>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, paddingTop: 60 },
  heading: { color: colors.text, fontSize: 24, fontWeight: "bold", paddingHorizontal: 20 },
  sub: { color: colors.muted, fontSize: 13, paddingHorizontal: 20, marginTop: 4 },
  list: { padding: 20 },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderLeftColor: colors.yellow,
    borderLeftWidth: 4,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  caseNo: { color: colors.yellow, fontSize: 11, fontWeight: "bold", letterSpacing: 2 },
  title: { color: colors.text, fontSize: 19, fontWeight: "bold", marginTop: 6 },
  date: { color: colors.muted, fontSize: 12, marginTop: 2 },
  open: { color: colors.orange, fontSize: 13, marginTop: 8, fontWeight: "600" },
});
