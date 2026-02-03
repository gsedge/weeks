
import { useNavigation } from "@react-navigation/native";
import { Text, TouchableOpacity, View } from 'react-native';

export default function Homepage() {

    const navigation = useNavigation();


    return (
        <View>
            <View>
                <Text>Your weeks </Text>
                <TouchableOpacity onPress={() => {navigation.navigate("CreateWeekPage")}}>
                    <Text>Add this week</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => {navigation.navigate("SpotifyAuthPage")}}>
                    <Text>Connect Spotify</Text>
                </TouchableOpacity>
            </View>
            
            <AllWeeks />
        </View>
    ) 
}



function AllWeeks() {
    return (
        <View>

        </View>
    );
}