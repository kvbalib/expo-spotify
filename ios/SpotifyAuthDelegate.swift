import ExpoModulesCore
import SpotifyiOS

public class SpotifyAuthDelegate: ExpoAppDelegateSubscriber, SPTSessionManagerDelegate {
    let spotifyAuth = ExpoSpotifyAuth.shared

    public func sessionManager(manager: SPTSessionManager, didInitiate session: SPTSession) {
        spotifyAuth.sessionManager(manager: manager, didInitiate: session)
    }

    public func sessionManager(manager: SPTSessionManager, didFailWith error: Error) {
        spotifyAuth.sessionManager(manager: manager, didFailWith: error)
    }

    public func sessionManager(manager: SPTSessionManager, didRenew session: SPTSession) {
        spotifyAuth.sessionManager(manager: manager, didRenew: session)
    }

    public func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any] = [:]) -> Bool {
        spotifyAuth.sessionManager.application(app, open: url, options: options)
        return true
    }
}
