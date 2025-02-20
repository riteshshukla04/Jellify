import { Api } from "@jellyfin/sdk/lib/api";
import { JellyfinInfo } from "./info";
import { JellifyServer } from "../types/JellifyServer";
import { JellifyUser } from "../types/JellifyUser";
import { storage } from '../constants/storage';
import { MMKVStorageKeys } from "../enums/mmkv-storage-keys";
import uuid from 'react-native-uuid';
import { JellifyLibrary } from "../types/JellifyLibrary";

export default class Client {
    static #instance: Client;

    private api : Api | undefined = undefined;
    private user : JellifyUser | undefined = undefined;
    private server : JellifyServer | undefined = undefined;
    private library : JellifyLibrary | undefined = undefined;
    private sessionId : string = uuid.v4();

    private constructor(
        api?: Api | undefined, 
        user?: JellifyUser | undefined, 
        server?: JellifyServer | undefined, 
        library?: JellifyLibrary | undefined
    ) {

        const userJson = storage.getString(MMKVStorageKeys.User)
        const serverJson = storage.getString(MMKVStorageKeys.Server);
        const libraryJson = storage.getString(MMKVStorageKeys.Library);

        if (user)
            this.setAndPersistUser(user)
        else if (userJson)
            this.user = JSON.parse(userJson)
        else
            this.user = undefined;
        
        if (server) 
            this.setAndPersistServer(server)
        else if (serverJson)
            this.server = JSON.parse(serverJson);
        else 
            this.server = undefined;
        
        if (library)
            this.setAndPersistLibrary(library)
        else if (libraryJson)
            this.library = JSON.parse(libraryJson)
        else 
            this.library = undefined;

        if (api)
            this.api = api
        else if (this.user && this.server)
            this.api = new Api(this.server.url, JellyfinInfo.clientInfo, JellyfinInfo.deviceInfo, this.user.accessToken);
        else
            this.api = undefined;
    }

    public static get instance(): Client {
        if (!Client.#instance) {
            Client.#instance = new Client();
        }

        return Client.#instance;
    }

    public static get api(): Api | undefined {
        return Client.#instance.api;
    }

    public static get server(): JellifyServer | undefined {
        return Client.#instance.server;
    }

    public static get user(): JellifyUser | undefined {
        return Client.#instance.user;
    }

    public static get library(): JellifyLibrary | undefined {
        return Client.#instance.library;
    }

    public static get sessionId(): string {
        return Client.#instance.sessionId;
    }

    public static signOut(): void {
        Client.#instance.removeCredentials()
    }

    public static switchServer() : void {
        Client.#instance.removeServer();
    }

    public static switchUser(): void {
        Client.#instance.removeUser();
    }

    public static setUser(user: JellifyUser): void {
        Client.#instance.setAndPersistUser(user);
    }

    private setAndPersistUser(user: JellifyUser) {
        this.user = user;

        // persist user details
        storage.set(MMKVStorageKeys.User, JSON.stringify(user));
    }

    private setAndPersistServer(server : JellifyServer) {
        this.server = server;

        storage.set(MMKVStorageKeys.Server, JSON.stringify(server));
    }

    private setAndPersistLibrary(library : JellifyLibrary) {
        this.library = library;

        storage.set(MMKVStorageKeys.Library, JSON.stringify(library))
    }

    private removeCredentials() {
        this.library = undefined;
        this.server = undefined;
        this.user = undefined;

        storage.delete(MMKVStorageKeys.Server)
        storage.delete(MMKVStorageKeys.Library)
        storage.delete(MMKVStorageKeys.User)
    }

    private removeServer() {
        this.server = undefined;

        storage.delete(MMKVStorageKeys.Server)
    }

    private removeUser() {
        this.user = undefined;

        storage.delete(MMKVStorageKeys.User)
    }

    /**
     * Uses the jellifyClient to create a public Jellyfin API instance.
     * @param serverUrl The URL of the Jellyfin server
     * @returns 
     */
    public static setPublicApiClient(server : JellifyServer) : void {
        const api = JellyfinInfo.createApi(server.url);

        Client.#instance = new Client(api, undefined, server, undefined)
    }

    /**
     * 
     * @param serverUrl The URL of the Jellyfin server
     * @param accessToken The assigned accessToken for the Jellyfin user
     */
    public static setPrivateApiClient(server : JellifyServer, user : JellifyUser) : void {
        const api = JellyfinInfo.createApi(server.url, user.accessToken);

        Client.#instance = new Client(api, user, server, undefined);
    }

    public static setLibrary(library : JellifyLibrary) : void {

        Client.#instance = new Client(undefined, undefined, undefined, library);
    }
}