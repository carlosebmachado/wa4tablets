import React from "react";
import { StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

import { services, colors } from "../constants";


export default function Home() {
  return (
    <WebView
      style={styles.container}
      source={{ uri: services.baseURI }}
      userAgent={services.userAgent}>
    </WebView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

/*
Last user agents: https://www.whatismybrowser.com/guides/the-latest-user-agent/chrome
API: https://developers.whatismybrowser.com/api/docs/v3/
*/
