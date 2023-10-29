import React, { useState, useEffect, useRef } from "react";
import { View, Text, Button, StyleSheet } from "react-native";

import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

import { WebView } from "react-native-webview";

import { services, colors } from "../constants";
import { registerForPushNotificationsAsync } from "../utils/Notifications";

interface WebViewNavigationStateChangeParams {
  url?: string;
  title?: string;
  loading?: boolean;
  canGoBack?: boolean;
  canGoForward?: boolean;
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

(WebView as any).isFileUploadSupported().then((isSupported: boolean) => {
  if (isSupported) {
    console.info("File upload is supported");
  } else {
    console.warn("File upload is not supported");
  }
});

export default function Home() {
  const [loadTryCount, setLoadTryCount] = useState<number>(1);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [expoPushToken, setExpoPushToken] = useState<string>("");
  const [initNotifications, setInitNotifications] = useState<boolean>(false);
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();
  var webview: any;

  function handleNewTry() {
    setLoadTryCount(loadTryCount + 1);
  }

  function handleNavigationStateChange(newNavState: WebViewNavigationStateChangeParams) {
    const { url } = newNavState;
    if (!url) return;

    if (!url.includes(services.waDomains[0])) {
      console.info(`${url} is not a WhatsApp Web domain`);
      webview.injectJavaScript(`window.location = "${services.baseURI}"`);
      setLoadTryCount(loadTryCount + 1);
      return;
    }
  }

  function handleLoadEnd(event: any) {
    const { nativeEvent } = event;

    if (nativeEvent.loading) return;

    setLoaded(true);

    console.info("Load ended");
  }

  async function handleMessage(event: any) {
    const { nativeEvent } = event;

    if (Device.isDevice) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: nativeEvent.title,
          body: "Nova Mensagem",
          data: { data: nativeEvent.data },
        },
        trigger: { seconds: 1 },
      });
    } else {
      alert(nativeEvent.data);
    }
  }

  function handleError(event: any) {
    const { nativeEvent } = event;
    console.log("Error");
    console.log("event", event);
    console.log("nativeEvent", nativeEvent);
  }

  useEffect(() => {
    if (!initNotifications) {
      setInitNotifications(true);

      registerForPushNotificationsAsync().then((token) => setExpoPushToken(token?.toString() || ""));

      notificationListener.current = Notifications.addNotificationReceivedListener((notification: any) => {
        console.log(notification);
      });

      responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

      return () => {
        Notifications.removeNotificationSubscription(notificationListener.current);
        Notifications.removeNotificationSubscription(responseListener.current);
      };
    }
  }, [initNotifications]);

  return (
    <View style={styles.container}>
      {loadTryCount % 2 === 0 ? (
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text style={{ fontSize: 16, marginBottom: 10 }}>Couldn't load WhatsApp</Text>
          <Button title="Try Again" color={colors.lightGreen} onPress={handleNewTry} />
        </View>
      ) : (
        <WebView
          style={{ flex: 1 }}
          ref={(ref) => (webview = ref)}
          source={{ uri: services.baseURI }}
          originWhitelist={services.waUris}
          // desktop mode behavior
          contentMode="desktop"
          allowsBackForwardNavigationGestures={false}
          injectedJavaScript={services.desktopModeJavaScript}
          userAgent={services.userAgent}
          // events
          onNavigationStateChange={handleNavigationStateChange}
          onMessage={handleMessage}
          onLoadEnd={handleLoadEnd}
          onError={handleError}
          onHttpError={(err) => console.error(err)}
          onFileDownload={({ nativeEvent }) => {
              const { downloadUrl } = nativeEvent;
              console.log(downloadUrl);
          }}
          // configs
          scalesPageToFit={true}
          startInLoadingState={true}
          javaScriptEnabledAndroid={true}
          javaScriptEnabled={true}
          bounces={false}
          allowFileAccess={true}
          domStorageEnabled={true}
          geolocationEnabled={true}
          allowFileAccessFromFileURLs={true}
          allowUniversalAccessFromFileURLs={true}
          allowingReadAccessToURL="*"
          mixedContentMode={'always'}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
  },
});
