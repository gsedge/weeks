import { createStackNavigator } from "@react-navigation/stack";
import { Theme } from "../assets/themes";
import CreateWeek from "./pages/createweekpage";
import HomeScreen from "./pages/homepage";
import ShowWeekPage from "./pages/showWeekPage";
import MusicSection from "./pages/spotifyAuth";

type RootStackParamList = {
  HomeScreen: undefined;
  CreateWeekPage: undefined;
  SpotifyAuthPage: undefined;
  ShowWeek: {
    moments: { text: string; day: string }[];
    imageUris: string[];
    selectedLocations: string[];
    musicSelected: string[];
    userID: string;
    themeSelected: Theme;
    weekRange?: string;
  };
};

const Stack = createStackNavigator<RootStackParamList>();


function CreateStack() {
    return (
        <Stack.Navigator screenOptions={({route}) => ({ headerShown: false})}>
            <Stack.Screen name="HomeScreen" component={HomeScreen} /> 
            <Stack.Screen name="CreateWeekPage" component={CreateWeek} />
            <Stack.Screen name="SpotifyAuthPage" component={MusicSection} />   
            <Stack.Screen name="ShowWeek" component={ShowWeekPage} /> 
        </Stack.Navigator>
    )
}




export default function App() {
    

    return (
        <CreateStack />
    )
}