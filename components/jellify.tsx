import _ from "lodash";
import React from "react";
import Navigation from "./navigation";
import Login from "./Login/component";
import { JellyfinAuthenticationProvider } from "./Login/provider";
import { PlayerProvider } from "../player/provider";
import { JellifyProvider, useJellifyContext } from "./provider";
import { ToastProvider } from "@tamagui/toast";
import { PortalProvider } from "tamagui";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useColorScheme } from "react-native";
import { JellifyDarkTheme, JellifyLightTheme } from "./theme";

export default function Jellify(): React.JSX.Element {

  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
    <NavigationContainer theme={isDarkMode ? JellifyDarkTheme : JellifyLightTheme}>

    <PortalProvider shouldAddRootHost>
      <ToastProvider burntOptions={{ from: 'top'}}>
        <JellifyProvider>
          <App />
        </JellifyProvider>
      </ToastProvider>
    </PortalProvider>
    </NavigationContainer>
    </SafeAreaProvider>
  );
}

function App(): React.JSX.Element {

  const { loggedIn } = useJellifyContext();

  console.debug(` User is ${!loggedIn ? "" : "not"} logged in to Jellyfin`);
  
  return (
        loggedIn ? (
          <PlayerProvider>
            <Navigation />
          </PlayerProvider>
         ) : (
           <JellyfinAuthenticationProvider>
            <Login /> 
          </JellyfinAuthenticationProvider>
        )
  )
}