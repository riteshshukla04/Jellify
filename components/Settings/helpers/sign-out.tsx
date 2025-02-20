import React from "react";
import Button from "../../Global/helpers/button";
import Client from "../../../api/client";
import { useJellifyContext } from "../../../components/provider";
import TrackPlayer from "react-native-track-player";

export default function SignOut(): React.JSX.Element {

    const { setLoggedIn } = useJellifyContext();

    return (
        <Button onPress={() => {
            setLoggedIn(false);
            Client.signOut();
            TrackPlayer.reset();
        }}>
            Sign Out
        </Button>
    )
}