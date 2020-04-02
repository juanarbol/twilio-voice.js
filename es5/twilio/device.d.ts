/// <reference types="node" />
/**
 * @module Voice
 * @preferred
 * @publicapi
 */
import { EventEmitter } from 'events';
import AudioHelper from './audiohelper';
import Connection from './connection';
/**
 * @private
 */
export declare type IPStream = any;
/**
 * @private
 */
export declare type IPublisher = any;
/**
 * @private
 */
export declare type ISound = any;
/**
 * Options that may be passed to the {@link Device} constructor for internal testing.
 * @private
 */
export interface IExtendedDeviceOptions extends Device.Options {
    /**
     * Custom {@link AudioHelper} constructor
     */
    AudioHelper?: any;
    /**
     * Hostname of the signaling gateway to connect to.
     */
    chunderw?: string;
    /**
     * Custom {@link Connection} constructor
     */
    connectionFactory?: Connection;
    /**
     * Hostname of the event gateway to connect to.
     */
    eventgw?: string;
    /**
     * A list of specific ICE servers to use. Overridden by {@link Device.Options.rtcConfiguration}.
     * @deprecated
     */
    iceServers?: Object[];
    /**
     * Ignore browser support, disabling the exception that is thrown when neither WebRTC nor
     * ORTC are supported.
     */
    ignoreBrowserSupport?: boolean;
    /**
     * Whether to disable audio flag in MediaPresence (rrowland: Do we need this?)
     */
    noRegister?: boolean;
    /**
     * Custom PStream constructor
     */
    pStreamFactory?: IPStream;
    /**
     * Custom Publisher constructor
     */
    Publisher?: IPublisher;
    /**
     * Whether Insights events should be published
     */
    publishEvents?: boolean;
    /**
     * RTC Constraints to pass to getUserMedia when making or accepting a Call.
     * The format of this object depends on browser.
     */
    rtcConstraints?: Object;
    /**
     * Custom Sound constructor
     */
    soundFactory?: ISound;
}
/**
 * A sound definition used to initialize a Sound file.
 * @private
 */
export interface ISoundDefinition {
    /**
     * Name of the sound file.
     */
    filename: string;
    /**
     * The amount of time this sound file should play before being stopped automatically.
     */
    maxDuration?: number;
    /**
     * Whether or not this sound should loop after playthrough finishes.
     */
    shouldLoop?: boolean;
}
/**
 * Twilio Device. Allows registration for incoming calls, and placing outgoing calls.
 * @publicapi
 */
declare class Device extends EventEmitter {
    /**
     * The AudioContext to be used by {@link Device} instances.
     * @private
     */
    static get audioContext(): AudioContext | undefined;
    /**
     * Which sound file extension is supported.
     * @private
     */
    static get extension(): 'mp3' | 'ogg';
    /**
     * Whether or not this SDK is supported by the current browser.
     */
    static get isSupported(): boolean;
    /**
     * Package name of the SDK.
     */
    static get packageName(): string;
    /**
     * String representation of {@link Device} class.
     * @private
     */
    static toString(): string;
    /**
     * Current SDK version.
     */
    static get version(): string;
    /**
     * An AudioContext to share between {@link Device}s.
     */
    private static _audioContext?;
    /**
     * A DialtonePlayer to play mock DTMF sounds through.
     */
    private static _dialtonePlayer?;
    /**
     * Whether or not the browser uses unified-plan SDP by default.
     */
    private static _isUnifiedPlanDefault;
    /**
     * The AudioHelper instance associated with this {@link Device}.
     */
    audio: AudioHelper | null;
    /**
     * An array of {@link Connection}s. Though only one can be active, multiple may exist when there
     * are multiple incoming, unanswered {@link Connection}s.
     */
    connections: Connection[];
    /**
     * Whether or not {@link Device.setup} has been called.
     */
    isInitialized: boolean;
    /**
     * Methods to enable/disable each sound. Empty if the {@link Device} has not
     * yet been set up.
     */
    readonly sounds: Partial<Record<Device.SoundName, (value?: boolean) => void>>;
    /**
     * The JWT string currently being used to authenticate this {@link Device}.
     */
    token: string | null;
    /**
     * The currently active {@link Connection}, if there is one.
     */
    private _activeConnection;
    /**
     * An audio input MediaStream to pass to new {@link Connection} instances.
     */
    private _connectionInputStream;
    /**
     * An array of {@link Device} IDs to be used to play sounds through, to be passed to
     * new {@link Connection} instances.
     */
    private _connectionSinkIds;
    /**
     * Whether each sound is enabled.
     */
    private _enabledSounds;
    /**
     * Whether SDK is run as a browser extension
     */
    private _isBrowserExtension;
    /**
     * An instance of Logger to use.
     */
    private _log;
    /**
     * An Insights Event Publisher.
     */
    private _publisher;
    /**
     * The region the {@link Device} is connected to.
     */
    private _region;
    /**
     * The current status of the {@link Device}.
     */
    private _status;
    /**
     * Value of 'audio' determines whether we should be registered for incoming calls.
     */
    private mediaPresence;
    /**
     * The options passed to {@link Device} constructor or Device.setup.
     */
    private options;
    /**
     * A timeout ID for a setTimeout schedule to re-register the {@link Device}.
     */
    private regTimer;
    /**
     * A Map of Sounds to play.
     */
    private soundcache;
    /**
     * The Signaling stream.
     */
    private stream;
    /**
     * Construct a {@link Device} instance, without setting up up. {@link Device.setup} must
     * be called later to initialize the {@link Device}.
     * @constructor
     * @param [token] - A Twilio JWT token string granting this {@link Device} access.
     * @param [options]
     */
    constructor();
    /**
     * Construct a {@link Device} instance, and set it up as part of the construction.
     * @constructor
     * @param [token] - A Twilio JWT token string granting this {@link Device} access.
     * @param [options]
     */
    constructor(token: string, options?: Device.Options);
    /**
     * Return the active {@link Connection}. Null or undefined for backward compatibility.
     */
    activeConnection(): Connection | null | undefined;
    /**
     * @deprecated Set a handler for the cancel event.
     * @param handler
     */
    cancel(handler: (connection: Connection) => any): this;
    /**
     * Make an outgoing Call.
     * @param [params] - A flat object containing key:value pairs to be sent to the TwiML app.
     * @param [audioConstraints]
     */
    connect(params?: Record<string, string>, audioConstraints?: MediaTrackConstraints | boolean): Connection;
    /**
     * Add a listener for the connect event.
     * @param handler - A handler to set on the connect event.
     */
    connect(handler: (connection: Connection) => any): null;
    /**
     * Destroy the {@link Device}, freeing references to be garbage collected.
     */
    destroy(): void;
    /**
     * Set a handler for the disconnect event.
     * @deprecated Use {@link Device.on}.
     * @param handler
     */
    disconnect(handler: (connection: Connection) => any): this;
    /**
     * Disconnect all {@link Connection}s.
     */
    disconnectAll(): void;
    /**
     * Set a handler for the error event.
     * @deprecated Use {@link Device.on}.
     * @param handler
     */
    error(handler: (error: Connection) => any): this;
    /**
     * Set a handler for the incoming event.
     * @deprecated Use {@link Device.on}.
     * @param handler
     */
    incoming(handler: (connection: Connection) => any): this;
    /**
     * Set a handler for the offline event.
     * @deprecated Use {@link Device.on}.
     * @param handler
     */
    offline(handler: (device: Device) => any): this;
    /**
     * Set a handler for the ready event.
     * @deprecated Use {@link Device.on}.
     * @param handler
     */
    ready(handler: (device: Device) => any): this;
    /**
     * Get the {@link Region} string the {@link Device} is currently connected to, or 'offline'
     * if not connected.
     */
    region(): string;
    /**
     * Register to receive incoming calls. Does not need to be called unless {@link Device.unregisterPresence}
     * has been called directly.
     */
    registerPresence(): this;
    /**
     * Remove an event listener
     * @param event - The event name to stop listening for
     * @param listener - The callback to remove
     */
    removeListener(event: Device.EventName, listener: (...args: any[]) => void): this;
    /**
     * Initialize the {@link Device}.
     * @param token - A Twilio JWT token string granting this {@link Device} access.
     * @param [options]
     */
    setup(token: string, options?: Device.Options): this;
    /**
     * Get the status of this {@link Device} instance
     */
    status(): Device.Status;
    /**
     * String representation of {@link Device} instance.
     * @private
     */
    toString(): string;
    /**
     * Unregister to receiving incoming calls.
     */
    unregisterPresence(): this;
    /**
     * Update the token and re-register.
     * @param token - The new token JWT string to register with.
     */
    updateToken(token: string): void;
    /**
     * Add a handler for an EventEmitter and emit a deprecation warning on first call.
     * @param eventName - Name of the event
     * @param handler - A handler to call when the event is emitted
     */
    private _addHandler;
    /**
     * Called on window's beforeunload event if closeProtection is enabled,
     * preventing users from accidentally navigating away from an active call.
     * @param event
     */
    private _confirmClose;
    /**
     * Create the default Insights payload
     * @param [connection]
     */
    private _createDefaultPayload;
    /**
     * Disconnect all {@link Connection}s.
     */
    private _disconnectAll;
    /**
     * Find a {@link Connection} by its CallSid.
     * @param callSid
     */
    private _findConnection;
    /**
     * Create a new {@link Connection}.
     * @param twimlParams - A flat object containing key:value pairs to be sent to the TwiML app.
     * @param [options] - Options to be used to instantiate the {@link Connection}.
     */
    private _makeConnection;
    /**
     * Stop the incoming sound if no {@link Connection}s remain.
     */
    private _maybeStopIncomingSound;
    /**
     * Called when a 'close' event is received from the signaling stream.
     */
    private _onSignalingClose;
    /**
     * Called when a 'connected' event is received from the signaling stream.
     */
    private _onSignalingConnected;
    /**
     * Called when an 'error' event is received from the signaling stream.
     */
    private _onSignalingError;
    /**
     * Called when an 'invite' event is received from the signaling stream.
     */
    private _onSignalingInvite;
    /**
     * Called when an 'offline' event is received from the signaling stream.
     */
    private _onSignalingOffline;
    /**
     * Called when a 'ready' event is received from the signaling stream.
     */
    private _onSignalingReady;
    /**
     * Publish a NetworkInformation#change event to Insights if there's an active {@link Connection}.
     */
    private _publishNetworkChange;
    /**
     * Remove a {@link Connection} from device.connections by reference
     * @param connection
     */
    private _removeConnection;
    /**
     * Register with the signaling server.
     */
    private _sendPresence;
    /**
     * Set up the connection to the signaling server.
     * @param token
     */
    private _setupStream;
    /**
     * Start playing the incoming ringtone, and subsequently emit the incoming event.
     * @param connection
     * @param play - The function to be used to play the sound. Must return a Promise.
     */
    private _showIncomingConnection;
    /**
     * Set a timeout to send another register message to the signaling server.
     */
    private _startRegistrationTimer;
    /**
     * Stop sending registration messages to the signaling server.
     */
    private _stopRegistrationTimer;
    /**
     * Throw an Error if Device.setup has not been called for this instance.
     * @param methodName - The name of the method being called before setup()
     */
    private _throwUnlessSetup;
    /**
     * Update the input stream being used for calls so that any current call and all future calls
     * will use the new input stream.
     * @param inputStream
     */
    private _updateInputStream;
    /**
     * Update the device IDs of output devices being used to play the incoming ringtone through.
     * @param sinkIds - An array of device IDs
     */
    private _updateRingtoneSinkIds;
    /**
     * Update the device IDs of output devices being used to play sounds through.
     * @param type - Whether to update ringtone or speaker sounds
     * @param sinkIds - An array of device IDs
     */
    private _updateSinkIds;
    /**
     * Update the device IDs of output devices being used to play the non-ringtone sounds
     * and Call audio through.
     * @param sinkIds - An array of device IDs
     */
    private _updateSpeakerSinkIds;
    /**
     * Register the {@link Device}
     * @param token
     */
    private register;
}
declare namespace Device {
    /**
     * All valid {@link Device} event names.
     */
    enum EventName {
        Cancel = "cancel",
        Connect = "connect",
        Disconnect = "disconnect",
        Error = "error",
        Incoming = "incoming",
        Offline = "offline",
        Ready = "ready"
    }
    /**
     * All possible {@link Device} statuses.
     */
    enum Status {
        Busy = "busy",
        Offline = "offline",
        Ready = "ready"
    }
    /**
     * Names of all sounds handled by the {@link Device}.
     */
    enum SoundName {
        Incoming = "incoming",
        Outgoing = "outgoing",
        Disconnect = "disconnect",
        Dtmf0 = "dtmf0",
        Dtmf1 = "dtmf1",
        Dtmf2 = "dtmf2",
        Dtmf3 = "dtmf3",
        Dtmf4 = "dtmf4",
        Dtmf5 = "dtmf5",
        Dtmf6 = "dtmf6",
        Dtmf7 = "dtmf7",
        Dtmf8 = "dtmf8",
        Dtmf9 = "dtmf9",
        DtmfS = "dtmfs",
        DtmfH = "dtmfh"
    }
    /**
     * Names of all togglable sounds.
     */
    type ToggleableSound = Device.SoundName.Incoming | Device.SoundName.Outgoing | Device.SoundName.Disconnect;
    /**
     * Options that may be passed to the {@link Device} constructor, or Device.setup via public API
     */
    interface Options {
        [key: string]: any;
        /**
         * Whether the Device should raise the {@link incomingEvent} event when a new call invite is
         * received while already on an active call. Default behavior is false.
         */
        allowIncomingWhileBusy?: boolean;
        /**
         * Audio Constraints to pass to getUserMedia when making or accepting a Call.
         * This is placed directly under `audio` of the MediaStreamConstraints object.
         */
        audioConstraints?: MediaTrackConstraints | boolean;
        /**
         * Whether to enable close protection, to prevent users from accidentally
         * navigating away from the page during a call. If string, the value will
         * be used as a custom message.
         */
        closeProtection?: boolean | string;
        /**
         * An ordered array of codec names, from most to least preferred.
         */
        codecPreferences?: Connection.Codec[];
        /**
         * Whether to enable debug logging.
         */
        debug?: boolean;
        /**
         * Whether AudioContext sounds should be disabled. Useful for trouble shooting sound issues
         * that may be caused by AudioContext-specific sounds. If set to true, will fall back to
         * HTMLAudioElement sounds.
         */
        disableAudioContextSounds?: boolean;
        /**
         * Whether to use googDscp in RTC constraints.
         */
        dscp?: boolean;
        /**
         * Whether to automatically restart ICE when media connection fails
         */
        enableIceRestart?: boolean;
        /**
         * Whether the ringing state should be enabled on {@link Connection} objects. This is required
         * to enable answerOnBridge functionality.
         */
        enableRingingState?: boolean;
        /**
         * Whether or not to override the local DTMF sounds with fake dialtones. This won't affect
         * the DTMF tone sent over the connection, but will prevent double-send issues caused by
         * using real DTMF tones for user interface. In 2.0, this will be enabled by default.
         */
        fakeLocalDTMF?: boolean;
        /**
         * Experimental feature.
         * Whether to use ICE Aggressive nomination.
         */
        forceAggressiveIceNomination?: boolean;
        /**
         * The maximum average audio bitrate to use, in bits per second (bps) based on
         * [RFC-7587 7.1](https://tools.ietf.org/html/rfc7587#section-7.1). By default, the setting
         * is not used. If you specify 0, then the setting is not used. Any positive integer is allowed,
         * but values outside the range 6000 to 510000 are ignored and treated as 0. The recommended
         * bitrate for speech is between 8000 and 40000 bps as noted in
         * [RFC-7587 3.1.1](https://tools.ietf.org/html/rfc7587#section-3.1.1).
         */
        maxAverageBitrate?: number;
        /**
         * The region code of the region to connect to.
         */
        region?: string;
        /**
         * An RTCConfiguration to pass to the RTCPeerConnection constructor.
         */
        rtcConfiguration?: RTCConfiguration;
        /**
         * A mapping of custom sound URLs by sound name.
         */
        sounds?: Partial<Record<Device.SoundName, string>>;
        /**
         * Whether to enable warn logging.
         */
        warnings?: boolean;
    }
}
export default Device;
