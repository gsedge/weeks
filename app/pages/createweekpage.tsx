import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from "react";
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { THEMES } from "../../assets/themes";


const { width, height } = Dimensions.get("window");
const vw = width / 100;
const vh = height / 100;

export default function CreateWeek() {
    const [moments, updateMoments] = useState<{text: string, day: string}[]>([]);
    const [imageUris, setImageUris] = useState<string[]>([]);
    const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
    const [musicSelected, setMusicSelected] = useState<string[]>([]);   
    const [userID, setUserID] = useState<string>("0");
    const [themeSelected, setThemeSelected] = useState<string>("");

    const navigation = useNavigation();

    function submitWeek() {
        (navigation as any).navigate("ShowWeek", {
            moments: moments,
            imageUris: imageUris,
            selectedLocations: selectedLocations,
            musicSelected: musicSelected,
            userId: userID,
            themeSelected: themeSelected
        } );
    }


    return (
        <ScrollView>
            <View style={styles.headerView}>
                <TouchableOpacity onPress={() => {navigation.goBack()}}>
                    <Ionicons name="arrow-back" size={24} color="black"/>

                </TouchableOpacity>
                <Text>What have you been up to this week</Text>

            </View>
            <View style={styles.sections}>
                <JournalSection moments={moments} updateMoments={updateMoments} />
                <PictureSection imageUris={imageUris} setImageUris={setImageUris} />
                <LocationSection selectedLocations={selectedLocations} setSelectedLocations={setSelectedLocations} />
                <MusicSection musicSelected={musicSelected} setMusicSelected={setMusicSelected} />
                <UserIdSelection userId={userID} updateUserId={setUserID} />
                <ThemeSelection themeSelected={themeSelected} setThemeSelected={setThemeSelected} />   
                <TouchableOpacity onPress={() => {submitWeek()}}>
                    <Text>Save Week</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}

function JournalSection({moments, updateMoments}: {moments: {text: string, day: string}[], updateMoments: React.Dispatch<React.SetStateAction<{text: string, day: string}[]>>}) {
    const [updating, setUpdating] = useState(false);
    const [currentMoment, setCurrentMoment] = useState("");
    const [selectedDay, setSelectedDay] = useState("Monday");

    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    function addToMoments() {
        updateMoments([...moments, {text: currentMoment, day: selectedDay}]);
        setCurrentMoment("");
        setSelectedDay("Monday");
    }

    return (
        <View style={{borderColor:"black", height: "100%"}}>
            <Text>Any notable moments</Text>

            {updating ? (
                <View>
                    <TextInput 
                        value={currentMoment} 
                        onChangeText={setCurrentMoment} 
                        style={styles.textInputStyle}
                        placeholder="What happened?"
                    />
                    
                    <View style={{marginVertical: 10}}>
                        <Text>Select day:</Text>
                        {daysOfWeek.map((day) => (
                            <TouchableOpacity 
                                key={day}
                                onPress={() => setSelectedDay(day)}
                                style={{
                                    padding: 8,
                                    backgroundColor: selectedDay === day ? '#007AFF' : '#f0f0f0',
                                    marginVertical: 2
                                }}
                            >
                                <Text style={{color: selectedDay === day ? 'white' : 'black'}}>
                                    {day}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <TouchableOpacity onPress={() => {setUpdating(false); addToMoments()}}>
                        <Text>Add Moment</Text>
                    </TouchableOpacity>
                </View>
            ) : (
              <TouchableOpacity onPress={() => {setUpdating(true)}}>
                    <Text>Add Moment</Text>
                </TouchableOpacity>  
            )}
            
            {moments.map((moment, index) => (
                <Text key={index}>{moment.day}: {moment.text}</Text>
            ))}
        </View>
    )
}

function PictureSection({imageUris, setImageUris}: {imageUris: string[], setImageUris: React.Dispatch<React.SetStateAction<string[]>>}) {

    async function pickImage() {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            quality: 0.8,
        });

        if (!result.canceled) {
            setImageUris(prevUris => [...prevUris, result.assets[0].uri]);
        }
    }

    function removeImage(index: number) {
        setImageUris(prevUris => prevUris.filter((_, i) => i !== index));
    }

    return (
        <View style={{borderColor:"black", height: "100%"}}>
            <Text>Pictures</Text>
            <TouchableOpacity onPress={pickImage}>
                <Text>Add Picture</Text>
            </TouchableOpacity>
            
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 }}>
                {imageUris.length > 0 && imageUris.map((uri, index) => (
                    <View key={index} style={{ margin: 5 }}>
                        <Image 
                            source={{ uri: uri }} 
                            style={{ width: 100, height: 100 }} 
                        />
                        <TouchableOpacity 
                            onPress={() => removeImage(index)}
                            style={{ position: 'absolute', top: 5, right: 5, backgroundColor: 'red', borderRadius: 12, width: 24, height: 24, alignItems: 'center', justifyContent: 'center' }}
                        >
                            <Text style={{ color: 'white', fontWeight: 'bold' }}>×</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
        </View>
    )
}


function LocationSection({selectedLocations, setSelectedLocations}: {selectedLocations: string[], setSelectedLocations: React.Dispatch<React.SetStateAction<string[]>>}) {
    const [currentLocation, setCurrentLocation] = useState("");
    const [selecting, setSelecting] = useState(false);

    function addToMoments() {
        setSelectedLocations([...selectedLocations, currentLocation]);
        setCurrentLocation("");
    }

    return (
        <View style={{borderColor:"black", height: "100%"}}>
            <Text>Where have you been this week?</Text>

            {selecting ? (
                <View>
                    <TextInput value={currentLocation} onChangeText={setCurrentLocation} style={styles.textInputStyle}></TextInput>
                    <TouchableOpacity onPress={() => {setSelecting(false); addToMoments()}}>
                        <Text>Add Location</Text>
                    </TouchableOpacity>
                </View>
            ) : (
              <TouchableOpacity onPress={() => {setSelecting(true)}}>
                    <Text>Add Location</Text>
                </TouchableOpacity>  
            )}
            
            {selectedLocations.map((location, index) => (
                <Text key={index}>{location}</Text>
            ))}
        </View>
    )
}

function MusicSection({musicSelected, setMusicSelected}: {musicSelected: string[], setMusicSelected: React.Dispatch<React.SetStateAction<string[]>>}) {
    

    return (
        <View style={{borderColor:"black", height: "100%"}}>
            <Text>Music</Text>
        </View>
    )
}

interface ThemeOption {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
  };
}



function ThemeSelection({
  themeSelected,
  setThemeSelected
}: {
  themeSelected: string;
  setThemeSelected: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Theme</Text>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {Object.values(THEMES).map((theme: any) => (
          <TouchableOpacity
            key={theme.id}
            style={[
              styles.themeCard,
              themeSelected === theme.id && styles.themeCardSelected
            ]}
            onPress={() => setThemeSelected(theme.id)}
            activeOpacity={0.7}
          >
            <View style={styles.colorPreview}>
              <View style={[styles.colorBox, { backgroundColor: theme.colors.primary }]} />
              <View style={[styles.colorBox, { backgroundColor: theme.colors.secondary }]} />
              <View style={[styles.colorBox, { backgroundColor: theme.colors.background }]} />
            </View>
            <Text style={[
              styles.themeName,
              themeSelected === theme.id && styles.themeNameSelected
            ]}>
              {theme.name}
            </Text>
            {themeSelected === theme.id && (
              <View style={styles.checkmark}>
                <Text style={styles.checkmarkText}>✓</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
function UserIdSelection({userId, updateUserId}: {userId: string, updateUserId: (text: string) => void}) {

    return (
        <View>
            <Text>Select User ID</Text>
            <TextInput value={userId} onChangeText={updateUserId}></TextInput>
        </View>
    )
}




const styles = StyleSheet.create({
    headerView: {
        display: "flex",
        flexDirection: "row"
    },

    sections: {
        flexDirection: "column",
        justifyContent: "space-between",
        margin: 5 * vh,
        alignItems: "center",
    },

    innerRightSection: {
        justifyContent: "space-between",
        flexDirection: "column",
    },

    textInputStyle: {
        borderColor: "black",
        borderWidth: 1
    },

      container: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  scrollContent: {
    paddingRight: 16,
  },
  themeCard: {
    width: 120,
    padding: 12,
    marginRight: 12,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
  },
  themeCardSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#E3F2FD',
  },
  colorPreview: {
    flexDirection: 'row',
    marginBottom: 8,
    gap: 4,
  },
  colorBox: {
    width: 30,
    height: 30,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  themeName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  themeNameSelected: {
    color: '#007AFF',
    fontWeight: '600',
  },
  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#007AFF',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },

})