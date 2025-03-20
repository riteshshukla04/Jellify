import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Player from "./Player/stack";
import { Tabs } from "./tabs";
import { StackParamList } from "./types";
import { SafeAreaProvider } from "react-native-safe-area-context";

const RootStack = createNativeStackNavigator<StackParamList>();

export default function Navigation(): React.JSX.Element {

  console.debug("Rendering navigational tree...")
  
    return (
      <SafeAreaProvider>

      <RootStack.Navigator>
          <RootStack.Screen 
            name="Tabs" 
            component={Tabs}
            options={{
              headerShown: false
            }}
            />
          <RootStack.Screen 
            name="Player" 
            component={Player} 
            options={{
              headerShown: false,
              presentation: 'modal'
            }}
            />
    </RootStack.Navigator>
      </SafeAreaProvider>
    )
}