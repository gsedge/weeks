import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, View } from 'react-native';

const { width } = Dimensions.get('window');
const COLUMN_COUNT = 3;
const GUTTER = 10;
const COLUMN_WIDTH = (width - (GUTTER * (COLUMN_COUNT + 1))) / COLUMN_COUNT;

const seededRandom = (seed: string) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  return () => {
    hash = (hash * 1664525 + 1013904223) % 4294967296;
    return hash / 4294967296;
  };
};

export const WeeklyMidnightBoard = ({ moments, imageUris, selectedLocations, musicSelected, userID }: any) => {
  const seed = `${userID}-${new Date().getFullYear()}-W${Math.ceil(new Date().getDate() / 7)}`;
  const rng = seededRandom(seed);

  const safeExtract = (data: any, type: string) => {
    if (!data) return [];
    return Object.values(data).map((val) => ({ type, data: val }));
  };

  const allTiles = [
    ...safeExtract(imageUris, 'image'),
    ...safeExtract(moments, 'note'),
    ...safeExtract(selectedLocations, 'weather'),
    ...safeExtract(musicSelected, 'music'),
  ].sort(() => rng() - 0.5);

  const columns: any[][] = [[], [], []];
  allTiles.forEach((item, i) => columns[i % COLUMN_COUNT].push(item));

  const Tile = ({ item }: { item: any }) => {
    const itemRng = seededRandom(item.data + seed);
    const randomHeight = 110 + (itemRng() * 90); // 110px to 200px

    const GlassWrapper = ({ children, style }: any) => (
      <View style={[styles.tileContainer, style]}>
        {/* Using "dark" tint for better contrast on dark backgrounds */}
        <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
        <View style={styles.glassBorder} />
        {children}
      </View>
    );

    switch (item.type) {
      case 'image':
        return (
          <View style={[styles.tileContainer, { height: randomHeight + 40 }]}>
            <Image source={{ uri: item.data }} style={styles.image} />
            <View style={[styles.glassBorder, { borderColor: 'rgba(255,255,255,0.15)' }]} />
          </View>
        );

      case 'note':
        // DYNAMIC FONT SCALING LOGIC
        // Lower character count + more height = Huge font
        const charCount = item.data.length;
        const baseSize = (randomHeight * COLUMN_WIDTH) / (charCount * 1.5);
        const dynamicFontSize = Math.min(Math.max(baseSize, 14), 32); 

        return (
          <GlassWrapper style={{ height: randomHeight, justifyContent: 'center' }}>
            <Text 
              style={[styles.noteText, { fontSize: dynamicFontSize }]} 
              adjustsFontSizeToFit={true} // iOS Native help
              numberOfLines={8}
            >
              {item.data}
            </Text>
          </GlassWrapper>
        );

      case 'weather':
        return (
          <GlassWrapper style={styles.weatherTile}>
            <Text style={styles.weatherIcon}>☁️</Text>
            <Text style={styles.weatherTemp}>18°</Text>
            <Text style={styles.weatherCity}>{item.data}</Text>
          </GlassWrapper>
        );

      case 'music':
        return (
          <View style={[styles.tileContainer, styles.musicTile]}>
            <LinearGradient colors={['rgba(29, 185, 84, 0.5)', '#000']} style={StyleSheet.absoluteFill} />
            <Text style={styles.musicLabel}>LISTENING TO</Text>
            <Text style={styles.musicName}>{item.data}</Text>
            <View style={styles.playCircle}><Text style={styles.playIcon}>▶</Text></View>
          </View>
        );
      default: return null;
    }
  };

  return (
    <View style={styles.screen}>
      {/* Darkened, Moody Background Gradient */}
      <LinearGradient 
        colors={['#09090B', '#1A1033', '#0F172A']} 
        style={StyleSheet.absoluteFill} 
      />
      
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Weekly Digest</Text>
          <View style={styles.userBadge} />
        </View>

        <View style={styles.masonryGrid}>
          {columns.map((col, i) => (
            <View key={i} style={styles.column}>
              {col.map((item, j) => <Tile key={j} item={item} />)}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#000' },
  scrollContainer: { paddingTop: 60, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15, marginBottom: 20 },
  title: { fontSize: 28, fontWeight: '800', color: '#E4E4E7', letterSpacing: -0.5 },
  userBadge: { width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.1)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  masonryGrid: { flexDirection: 'row', paddingHorizontal: GUTTER / 2 },
  column: { flex: 1, marginHorizontal: GUTTER / 2 },
  tileContainer: {
    width: '100%', borderRadius: 20, marginBottom: GUTTER,
    overflow: 'hidden', backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  glassBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  image: { width: '100%', height: '100%', resizeMode: 'cover', opacity: 0.9 },
  noteText: { 
    color: '#FFF', 
    fontWeight: '700', 
    padding: 12, 
    textAlign: 'center',
    letterSpacing: -0.2
  },
  weatherTile: { height: 110, justifyContent: 'center', alignItems: 'center' },
  weatherIcon: { fontSize: 24, marginBottom: 2 },
  weatherTemp: { fontSize: 20, fontWeight: 'bold', color: '#FFF' },
  weatherCity: { fontSize: 9, color: 'rgba(255,255,255,0.4)', fontWeight: '800', textTransform: 'uppercase' },
  musicTile: { height: 140, padding: 12, justifyContent: 'space-between' },
  musicLabel: { color: 'rgba(255,255,255,0.4)', fontSize: 7, fontWeight: '900', letterSpacing: 1 },
  musicName: { color: '#FFF', fontSize: 13, fontWeight: '800' },
  playCircle: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center' },
  playIcon: { fontSize: 8, color: '#000', marginLeft: 1 }
});