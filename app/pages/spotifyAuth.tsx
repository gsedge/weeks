
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const SPOTIFY_API = Constants.expoConfig?.extra?.spotifyApi;

const MusicSection = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any | null>(null);

  // Spotify configuration
  const SPOTIFY_CLIENT_ID = SPOTIFY_API;
  const REDIRECT_URI = Platform.OS === 'web' 
    ? 'http://localhost:8081' // For web development
    : 'yourapp://spotify-auth'; // For mobile
  
  const SCOPES = [
    'user-read-email',
    'user-read-private',
    'user-library-read',
    'user-library-modify',
    'streaming'
  ].join(' ');

  // Load saved access token on mount
  useEffect(() => {
    const loadToken = async () => {
      try {
        // Check if we're returning from Spotify auth (web only)
        if (Platform.OS === 'web') {
          const hash = window.location.hash;
          if (hash) {
            const params = new URLSearchParams(hash.substring(1));
            const token = params.get('access_token');
            if (token) {
              setAccessToken(token);
              await AsyncStorage.setItem('spotifyAccessToken', token);
              await fetchUserProfile(token);
              // Clean up URL
              window.history.replaceState({}, document.title, window.location.pathname);
              setLoading(false);
              return;
            }
          }
        }

        // Check for existing token
        const token = await AsyncStorage.getItem('spotifyAccessToken');
        if (token) {
          setAccessToken(token);
          await fetchUserProfile(token);
        }
      } catch (error) {
        console.error('Error loading token:', error);
      } finally {
        setLoading(false);
      }
    };
    loadToken();
  }, []);

  // Authenticate with Spotify (Web version)
  const authenticateSpotify = async () => {
    if (Platform.OS === 'web') {
      const authUrl = `https://accounts.spotify.com/authorize?client_id=${SPOTIFY_CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPES)}`;
      window.location.href = authUrl;
    } else {
      // For native mobile, you'll need to implement native auth
      Alert.alert('Not Implemented', 'Mobile authentication needs to be set up');
    }
  };

  // Fetch user profile to confirm authentication
  const fetchUserProfile = async (token: any) => {
    try {
      const response = await fetch('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserProfile(data);
      } else if (response.status === 401) {
        // Token expired
        await logout();
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await AsyncStorage.removeItem('spotifyAccessToken');
      setAccessToken(null);
      setUserProfile(null);
      Alert.alert('Logged Out', 'You have been logged out of Spotify');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#1DB954" />
      </View>
    );
  }

  if (!accessToken) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Connect to Spotify</Text>
        <Text style={styles.description}>
          Connect your Spotify account to pick your favorite songs
        </Text>
        <TouchableOpacity 
          style={styles.spotifyButton}
          onPress={authenticateSpotify}
        >
          <Text style={styles.spotifyButtonText}>
            Login with Spotify
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Connected to Spotify</Text>
      
      {userProfile && (
        <View style={styles.profileSection}>
          <Text style={styles.welcomeText}>
            Welcome, {userProfile.display_name || 'User'}!
          </Text>
          <Text style={styles.emailText}>
            {userProfile.email}
          </Text>
        </View>
      )}

      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={logout}
      >
        <Text style={styles.logoutButtonText}>
          Logout
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  spotifyButton: {
    backgroundColor: '#1DB954',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  spotifyButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileSection: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  emailText: {
    fontSize: 14,
    color: '#666',
  },
  logoutButton: {
    backgroundColor: '#ff4444',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MusicSection;