import _ from "lodash";
import React from "react";
import Navigation from "./navigation";
import Login from "./Login/component";
import { JellyfinAuthenticationProvider } from "./Login/provider";
import { PlayerProvider } from "../player/provider";
import { JellifyProvider, useJellifyContext } from "./provider";
import { ToastProvider } from "@tamagui/toast";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useColorScheme } from "react-native";

export default function Jellify(): React.JSX.Element {

  return (
    <ToastProvider burntOptions={{ from: 'top'}}>
      <JellifyProvider>
        <App />
      </JellifyProvider>
    </ToastProvider>
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