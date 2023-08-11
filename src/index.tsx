import {
  EventEmitter,
  NativeModulesProxy,
  Subscription,
} from "expo-modules-core";
import * as React from "react";

import { SpotifyAuthorizationData, SpotifyContext } from "./ExpoSpotify.types";
import ExpoSpotifyModule from "./ExpoSpotifyModule";

const emitter = new EventEmitter(
  ExpoSpotifyModule ?? NativeModulesProxy.ExpoSpotify
);

/** Helper hook to log native messages to the console. Remove this in production. */
function addNativeLogger(
  listener: ({ message }: { message: string }) => void
): Subscription {
  return emitter.addListener<{ message: string }>(
    ExpoSpotifyModule.LoggerEventName,
    listener
  );
}
const useSpotifyLogger = () => {
  React.useEffect(() => {
    const subscription = addNativeLogger(({ message }) => {
      console.log(message);
    });
    return () => subscription.remove();
  }, []);
};
/** remove end */

function addAuthListener(
  listener: (data: SpotifyAuthorizationData) => void
): Subscription {
  return emitter.addListener<SpotifyAuthorizationData>(
    ExpoSpotifyModule.AuthEventName,
    listener
  );
}

const SpotifyAuthContext = React.createContext<SpotifyContext>({
  accessToken: null,
  authorize: async (playURI?: string) => {},
});

const SpotifyProvider: React.FC<React.PropsWithChildren<object>> = ({
  children,
}) => {
  const [token, setToken] = React.useState<string | null>(null);
  React.useEffect(() => {
    const subscription = addAuthListener((data) => {
      setToken(data.token);
      if (data.error) console.error(`Spotify auth error: ${data.error}`);
    });
    return () => subscription.remove();
  }, []);

  async function authorize(playURI?: string): Promise<void> {
    try {
      await ExpoSpotifyModule.authorize(playURI);
    } catch (error) {
      console.error(`Spotify auth error: ${error}`);
    }
  }

  return (
    <SpotifyAuthContext.Provider
      value={{ accessToken: token, authorize }}
      children={children}
    />
  );
};

const useSpotify = () => React.useContext(SpotifyAuthContext);

export { SpotifyProvider, useSpotify, useSpotifyLogger };