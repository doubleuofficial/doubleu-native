import { useEffect, useState } from "react";
import { FlatList, Image, Pressable, StyleSheet, Text, View } from "react-native";
import Constants from "expo-constants";
import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { tracks, Track } from "../../data/tracks";
import { colors } from "../../theme";

// Expo Go can't bind the background audio service (needs a dev/production
// build). Detect it so we only enable background features in real builds.
const isExpoGo = Constants.appOwnership === "expo";

function fmt(ms: number) {
  const s = Math.floor((ms ?? 0) / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

export default function RadioScreen() {
  const [queue, setQueue] = useState<Track[]>(tracks);
  const [index, setIndex] = useState(0);
  const [shuffled, setShuffled] = useState(false);

  const player = useAudioPlayer(queue[index]?.audio ?? null);
  const status = useAudioPlayerStatus(player);

  // Background playback + lock-screen controls (real builds only)
  useEffect(() => {
    setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: !isExpoGo,
      interruptionMode: "doNotMix",
    });
  }, []);

  // Update lock-screen metadata when the track changes (real builds only).
  useEffect(() => {
    if (isExpoGo) return;
    const t = queue[index];
    if (!t) return;
    try {
      player.setActiveForLockScreen(true, {
        title: t.title,
        artist: t.artist,
        albumTitle: "DoubleU Radio",
      });
    } catch {
      /* lock-screen controls unavailable */
    }
  }, [index, queue, player]);

  function playTrack(i: number) {
    setIndex(i);
    // replace source then play
    player.replace(queue[i].audio);
    player.play();
  }

  function next() {
    playTrack((index + 1) % queue.length);
  }

  function prev() {
    playTrack((index - 1 + queue.length) % queue.length);
  }

  function toggleShuffle() {
    if (shuffled) {
      setQueue(tracks);
    } else {
      const rest = tracks.filter((t) => t.id !== queue[index].id);
      for (let i = rest.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [rest[i], rest[j]] = [rest[j], rest[i]];
      }
      setQueue([queue[index], ...rest]);
    }
    setShuffled(!shuffled);
    setIndex(0);
  }

  const current = queue[index];
  const playing = status?.playing ?? false;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>📻 DoubleU Radio</Text>

      <View style={styles.nowPlaying}>
        <Text style={styles.npLabel}>NOW PLAYING</Text>
        {current?.artwork ? (
          <Image source={current.artwork} style={styles.artwork} />
        ) : null}
        <Text style={styles.npTitle}>{current?.title ?? "—"}</Text>
        <Text style={styles.npArtist}>{current?.artist ?? ""}</Text>
        <Text style={styles.npTime}>
          {fmt(status?.currentTime)} / {fmt(status?.duration)}
        </Text>

        <View style={styles.controls}>
          <Pressable onPress={toggleShuffle} style={styles.ctlBtn}>
            <Text style={[styles.ctlText, shuffled && styles.active]}>🔀</Text>
          </Pressable>
          <Pressable onPress={prev} style={styles.ctlBtn}>
            <Text style={styles.ctlText}>⏮</Text>
          </Pressable>
          <Pressable
            onPress={() => (playing ? player.pause() : player.play())}
            style={styles.playBtn}
          >
            <Text style={styles.playText}>{playing ? "⏸" : "▶"}</Text>
          </Pressable>
          <Pressable onPress={next} style={styles.ctlBtn}>
            <Text style={styles.ctlText}>⏭</Text>
          </Pressable>
        </View>
      </View>

      <Text style={styles.upNext}>UP NEXT</Text>
      <FlatList
        data={queue}
        keyExtractor={(t) => t.id}
        renderItem={({ item, index: i }) => (
          <Pressable
            onPress={() => playTrack(i)}
            style={[styles.track, i === index && styles.trackActive]}
          >
            {item.artwork ? (
              <Image source={item.artwork} style={styles.thumb} />
            ) : (
              <Text style={styles.trackNum}>{i === index && playing ? "▶" : i + 1}</Text>
            )}
            <View style={{ flex: 1 }}>
              <Text style={styles.trackTitle}>{item.title}</Text>
              <Text style={styles.trackArtist}>{item.artist}</Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, paddingTop: 60 },
  heading: { color: colors.text, fontSize: 24, fontWeight: "bold", paddingHorizontal: 20 },
  nowPlaying: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    margin: 20,
    padding: 20,
    alignItems: "center",
  },
  npLabel: { color: colors.orange, fontSize: 11, letterSpacing: 2, fontWeight: "bold" },
  artwork: { width: 200, height: 200, borderRadius: 12, marginTop: 12 },
  npTitle: { color: colors.text, fontSize: 22, fontWeight: "bold", marginTop: 8, textAlign: "center" },
  npArtist: { color: colors.muted, fontSize: 14, marginTop: 2 },
  npTime: { color: colors.muted, fontSize: 12, marginTop: 8 },
  controls: { flexDirection: "row", alignItems: "center", gap: 20, marginTop: 16 },
  ctlBtn: { padding: 8 },
  ctlText: { fontSize: 24, color: colors.text },
  active: { color: colors.orange },
  playBtn: {
    backgroundColor: colors.orange,
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  playText: { fontSize: 28, color: "#000" },
  upNext: {
    color: colors.muted,
    fontSize: 12,
    letterSpacing: 2,
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  track: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
  },
  trackActive: { backgroundColor: colors.surface },
  thumb: { width: 44, height: 44, borderRadius: 6, marginRight: 12 },
  trackNum: { color: colors.orange, width: 28, fontSize: 14 },
  trackTitle: { color: colors.text, fontSize: 15, fontWeight: "600" },
  trackArtist: { color: colors.muted, fontSize: 12 },
});
