import React from 'react';
import { Platform, StatusBar, StyleSheet, Text, SafeAreaView } from 'react-native';

import Main from "./components/Main.js";

export default function App() {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'stretch',
      justifyContent: 'center',
      paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
    },
    main: {
      flex: 1,
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20
    },
    choosingBtn: {
      width: "60%",
      padding: 14,
      marginLeft: "auto",
      marginRight: "auto",
      backgroundColor: "dodgerblue",
      fontSize: 14,
      alignItems: "center",
      borderRadius: 10,
      marginBottom: 4
    },
    choosingBtnText: {
      fontFamily: "monospace",
      fontSize: 14
    },
    content: {
      flex: 4,
      alignItems: "center"
    },
    eventName: {
      marginLeft: "auto",
      marginRight: "auto",
      width: "80%",
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
      alignItems: "center"
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
