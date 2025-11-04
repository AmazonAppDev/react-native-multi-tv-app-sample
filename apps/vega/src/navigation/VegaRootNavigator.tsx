import { createNativeStackNavigator } from '@amazon-devices/react-navigation__native-stack';
import { RootStackParamList } from './types';
import VegaDrawerNavigator from './VegaDrawerNavigator';
import { DetailsScreen, PlayerScreen } from '@multi-tv/shared-ui';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function VegaRootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Main" component={VegaDrawerNavigator} />
      <Stack.Screen name="Details" component={DetailsScreen} />
      <Stack.Screen name="Player" component={PlayerScreen} />
    </Stack.Navigator>
  );
}
