import React from 'react';
import { Platform, StatusBar, StyleSheet, Text, SafeAreaView } from 'react-native';
import {useDimesions, useDeviceOrientation} from "@react-native-community/hooks";

import Main from "./components/Main.js";

export default function App() {

  const {landscape} = useDeviceOrientation();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'stretch',
      justifyContent: 'center',
      paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
    },
    menuContainer: {
      width: "90%",
      marginLeft: "auto",
      marginRight: "auto",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 14
    },
    menuBtn: {
      width: "80%",
      backgroundColor: "dodgerblue",
      alignItems: "center",
      padding: 12,
      marginTop: 4,
      marginBottom: 4,
      borderRadius: 10
    },
    menuBtnText: {
      fontSize: 16,
      fontFamily: "monospace"
    },
    main: {
      flex: 1,
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20
    },
    choosingBtn: {
      width: landscape ? "50%" : "60%",
      padding: 14,
      marginLeft: "auto",
      marginRight: "auto",
      backgroundColor: "dodgerblue",
      fontSize: landscape ? 12 : 14,
      alignItems: "center",
      borderRadius: 10,
      marginBottom: 4,
      justifyContent: "center"
    },
    choosingBtnText: {
      fontFamily: "monospace",
      fontSize: 14,
      textAlign: "center"
    },
    content: {
      flex: 4,
      alignItems: "center"
    },
    eventName: {
      marginLeft: "auto",
      marginRight: "auto",
      width: landscape ? "90%" : "80%",
      fontSize: 21,
      fontFamily: "monospace",
      marginBottom: 7
    },
    passedAway: {
      marginLeft: "auto",
      marginRight: "auto",
      width: "60%",
      fontSize: 15,
      fontFamily: "monospace",
      marginBottom: 11
    },
    timeStamps: {
      alignItems: "center",
      width: "100%"
    },
    timeDiff: {
      width: "60%",
      marginLeft: "auto",
      marginRight: "auto",
      fontSize: 14,
      fontFamily: "monospace",
      marginTop: 3,
      marginBottom: 5
    }
  });
  return (
    <SafeAreaView style={styles.container}>
      <Main styles = {styles}/>
    </SafeAreaView>
  );
}
