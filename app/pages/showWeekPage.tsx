import React from 'react';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import WeeklyDigest from './weeklyDigest';
import { Theme } from '../../assets/themes';

// Define your navigation param types
type RootStackParamList = {
  ShowWeek: {
    moments: { text: string; day: string }[];
    imageUris: string[];
    selectedLocations: string[];
    musicSelected: string[];
    userID: string;
    themeSelected: Theme;
    weekRange?: string;
  };
  // ... other routes
};

type ShowWeekScreenRouteProp = RouteProp<RootStackParamList, 'ShowWeek'>;
type ShowWeekScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ShowWeek'>;

type Props = {
  route: ShowWeekScreenRouteProp;
  navigation: ShowWeekScreenNavigationProp;
};

const ShowWeekScreen: React.FC<Props> = ({ route }) => {
  const {
    moments,
    imageUris,
    selectedLocations,
    musicSelected,
    userID,
    themeSelected,
    weekRange
  } = route.params;

  return (
    <WeeklyDigest
      moments={moments}
      imageUris={imageUris}
      selectedLocations={selectedLocations}
      musicSelected={musicSelected}
      userID={userID}
      themeSelected={themeSelected}
      weekRange={weekRange}
    />
  );
};

export default ShowWeekScreen;