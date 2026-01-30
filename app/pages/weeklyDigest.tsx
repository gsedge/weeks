import React, { useState } from 'react';
import { ScrollView, View, Text, Image, StyleSheet, Dimensions } from 'react-native';

interface Theme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
  };
}

interface WeeklyDigestProps {
  moments: { text: string; day: string }[];
  imageUris: string[];
  selectedLocations: string[];
  musicSelected: string[];
  userID: string;
  themeSelected: Theme;
  weekRange?: string; // e.g., "SEPT 24-30"
}

const WeeklyDigest: React.FC<WeeklyDigestProps> = ({
  moments,
  imageUris,
  selectedLocations,
  musicSelected,
  userID,
  themeSelected,
  weekRange = "WEEK DIGEST"
}) => {
  const { width } = Dimensions.get('window');

  // Seeded random number generator for consistent randomization
  const seededRandom = (seed: number) => {
    let x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };

  // Create a unique seed from userID and weekRange
  const createSeed = (userId: string, week: string): number => {
    let hash = 0;
    const combined = userId + week;
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  };

  const seed = createSeed(userID, weekRange);

  // Generate random values based on seed
  const getRandom = (index: number, min: number = 0, max: number = 1): number => {
    const value = seededRandom(seed + index);
    return min + value * (max - min);
  };

  // Randomize layout parameters
  const headerHeight = 200 + getRandom(1, 0, 100); // 200-300px
  const cardBorderRadius = 10 + getRandom(2, 0, 10); // 10-20px
  const shadowIntensity = getRandom(3, 0.1, 0.4); // Shadow opacity
  const headerGradientOpacity = getRandom(4, 0.2, 0.5);
  const gridGap = getRandom(5, 8, 15); // 8-15px
  const cardPadding = 15 + getRandom(6, 0, 10); // 15-25px
  
  // Randomize image grid layout (2 or 3 columns)
  const gridColumns = getRandom(7) > 0.5 ? 2 : 3;
  
  // Randomize card order (0-5 represents different orderings)
  const layoutVariant = Math.floor(getRandom(8, 0, 6));

  // Helper function to darken a color for contrast
  const darkenColor = (color: string, amount: number = 0.3): string => {
    const hex = color.replace('#', '');
    const r = Math.max(0, parseInt(hex.substring(0, 2), 16) * (1 - amount));
    const g = Math.max(0, parseInt(hex.substring(2, 4), 16) * (1 - amount));
    const b = Math.max(0, parseInt(hex.substring(4, 6), 16) * (1 - amount));
    return `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`;
  };

  // Helper function to lighten a color
  const lightenColor = (color: string, amount: number = 0.9): string => {
    const hex = color.replace('#', '');
    const r = Math.min(255, parseInt(hex.substring(0, 2), 16) + (255 - parseInt(hex.substring(0, 2), 16)) * amount);
    const g = Math.min(255, parseInt(hex.substring(2, 4), 16) + (255 - parseInt(hex.substring(2, 4), 16)) * amount);
    const b = Math.min(255, parseInt(hex.substring(4, 6), 16) + (255 - parseInt(hex.substring(4, 6), 16)) * amount);
    return `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`;
  };

  // Determine if theme is light or dark for text color
  const isLightTheme = (color: string): boolean => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 155;
  };

  const darkBackground = darkenColor(themeSelected.colors.primary);
  const lightCard = lightenColor(themeSelected.colors.background, 0.7);
  const textColorDark = isLightTheme(themeSelected.colors.background) ? '#1a1625' : '#ffffff';
  const textColorLight = isLightTheme(lightCard) ? '#1a1625' : '#ffffff';

  // Define different card components for reordering
  const musicCard = musicSelected.length > 0 && (
    <View 
      key="music"
      style={[
        styles.musicCard, 
        { 
          backgroundColor: themeSelected.colors.primary,
          borderRadius: cardBorderRadius,
          padding: cardPadding,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: shadowIntensity,
          shadowRadius: 4,
          elevation: 3,
        }
      ]}
    >
      <View style={[styles.playButton, { backgroundColor: themeSelected.colors.background }]}>
        <Text style={[styles.playIcon, { color: themeSelected.colors.primary }]}>▶</Text>
      </View>
      <View style={styles.musicInfo}>
        <Text style={[styles.musicLabel, { color: lightenColor(textColorDark, 0.5) }]}>Artist:</Text>
        <Text style={[styles.musicArtist, { color: textColorDark }]}>{musicSelected[0]}</Text>
      </View>
    </View>
  );

  const locationCard = selectedLocations.length > 0 && (
    <View 
      key="location"
      style={[
        styles.locationCard, 
        { 
          backgroundColor: lightCard,
          borderRadius: cardBorderRadius,
          padding: cardPadding,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: shadowIntensity,
          shadowRadius: 4,
          elevation: 3,
        }
      ]}
    >
      <View style={[styles.locationIcon, { backgroundColor: themeSelected.colors.background }]}>
        <Text style={styles.pinIcon}>📍</Text>
      </View>
      <View style={styles.locationInfo}>
        <Text style={[styles.locationLabel, { color: themeSelected.colors.secondary }]}>LOCATION:</Text>
        <Text style={[styles.locationText, { color: textColorLight }]}>{selectedLocations[0]}</Text>
      </View>
      {imageUris.length > 0 && (
        <Image 
          source={{ uri: imageUris[0] }} 
          style={[styles.locationThumbnail, { borderRadius: cardBorderRadius - 5 }]}
        />
      )}
    </View>
  );

  const momentsCard = moments.length > 0 && (
    <View 
      key="moments"
      style={[
        styles.momentsCard, 
        { 
          backgroundColor: lightCard,
          borderRadius: cardBorderRadius,
          padding: cardPadding,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: shadowIntensity,
          shadowRadius: 4,
          elevation: 3,
        }
      ]}
    >
      <Text style={[styles.momentsTitle, { color: themeSelected.colors.secondary }]}>SPECIAL MOMENT:</Text>
      {moments.map((moment, index) => (
        <View key={index} style={styles.momentItem}>
          <Text style={[styles.momentText, { color: textColorLight }]}>{moment.text}</Text>
          <Text style={[styles.momentDay, { color: themeSelected.colors.secondary }]}>{moment.day}</Text>
        </View>
      ))}
    </View>
  );

  const imageGrid = imageUris.length > 1 && (
    <View key="images" style={[styles.imageGrid, { gap: gridGap }]}>
      {imageUris.slice(1).map((uri, index) => (
        <Image 
          key={index}
          source={{ uri }} 
          style={[
            styles.gridImage,
            { 
              width: (width - 40 - (gridGap * (gridColumns - 1))) / gridColumns,
              borderRadius: cardBorderRadius - 5
            }
          ]}
        />
      ))}
    </View>
  );

  const userBadge = (
    <View 
      key="badge"
      style={[
        styles.userBadge, 
        { 
          backgroundColor: lightCard,
          borderRadius: cardBorderRadius,
          padding: cardPadding,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: shadowIntensity,
          shadowRadius: 4,
          elevation: 3,
        }
      ]}
    >
      <Text style={[styles.userIdLabel, { color: themeSelected.colors.secondary }]}>User ID</Text>
      <Text style={[styles.userIdText, { color: textColorLight }]}>{userID}</Text>
    </View>
  );

  // Define different layout orders based on layoutVariant
  const getCardOrder = (): (React.JSX.Element | false)[] => {
    switch (layoutVariant) {
      case 0:
        return [musicCard, locationCard, momentsCard, imageGrid, userBadge];
      case 1:
        return [locationCard, musicCard, momentsCard, imageGrid, userBadge];
      case 2:
        return [musicCard, momentsCard, locationCard, imageGrid, userBadge];
      case 3:
        return [musicCard, locationCard, imageGrid, momentsCard, userBadge];
      case 4:
        return [locationCard, momentsCard, musicCard, imageGrid, userBadge];
      case 5:
        return [momentsCard, musicCard, locationCard, imageGrid, userBadge];
      default:
        return [musicCard, locationCard, momentsCard, imageGrid, userBadge];
    }
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: darkBackground }]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Header with gradient background effect */}
      <View 
        style={[
          styles.header, 
          { 
            backgroundColor: themeSelected.colors.primary,
            height: headerHeight
          }
        ]}
      >
        <View 
          style={[
            styles.gradientOverlay, 
            { backgroundColor: `${themeSelected.colors.secondary}${Math.round(headerGradientOpacity * 255).toString(16).padStart(2, '0')}` }
          ]} 
        />
        <Text style={[styles.title, { color: textColorDark }]}>WEEKLY DIGEST:</Text>
        <Text style={[styles.dateRange, { color: textColorDark }]}>{weekRange}</Text>
        
        {/* Concert/crowd silhouette effect */}
        <View style={styles.crowdSilhouette} />
      </View>

      {/* Render cards in randomized order */}
      {getCardOrder().map((card, index) => card && (
        <View key={index} style={{ marginTop: index === 0 ? 20 : 15 }}>
          {card}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginHorizontal: -20,
    marginTop: -20,
    justifyContent: 'center',
    paddingHorizontal: 30,
    overflow: 'hidden',
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  crowdSilhouette: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  dateRange: {
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginTop: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  musicCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  playIcon: {
    fontSize: 20,
    marginLeft: 3,
  },
  musicInfo: {
    flex: 1,
  },
  musicLabel: {
    fontSize: 12,
    marginBottom: 3,
  },
  musicArtist: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  pinIcon: {
    fontSize: 24,
  },
  locationInfo: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 3,
  },
  locationText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  locationThumbnail: {
    width: 70,
    height: 70,
    marginLeft: 10,
  },
  momentsCard: {},
  momentsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
  },
  momentItem: {
    marginBottom: 8,
  },
  momentText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  momentDay: {
    fontSize: 14,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridImage: {
    height: 150,
  },
  userBadge: {
    alignItems: 'center',
  },
  userIdLabel: {
    fontSize: 12,
    marginBottom: 5,
  },
  userIdText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default WeeklyDigest;