/* eslint-disable import/no-unresolved */
import * as PIXI from 'pixi.js';
import {
    Application, Container, Loader,
} from 'pixi.js';
import { WebfontLoaderPlugin } from 'pixi-webfont-loader';
import CONFIG from './config';
import Client from './photon/client';
import Scene from './scenes/scene';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const globalAny:any = global;
globalAny.window.PIXI = PIXI;

Loader.registerPlugin(WebfontLoaderPlugin);

export default class Game {
    public app: Application;
    protected mainContainer: Container;
    protected scene: Scene;
    private static instance: Game;

    constructor() {
        this.buildGame();
    }

    public static getInstance(): Game {
        if (!Game.instance) {
            Game.instance = new Game();
        }
        return Game.instance;
    }

    public async buildGame() {
        const APP_WSS = CONFIG.photon.Wss;
        const APP_ID = CONFIG.photon.Id;
        const APP_VERSION = CONFIG.photon.Version;
        await this.init();
        this.scene = Scene.getInstance();
        await this.scene.init();
        this.mainContainer.addChild(this.scene);
        this.scene.sortableChildren = true;
        const client = new Client(APP_WSS, APP_ID, APP_VERSION);
        client.start();
    }

    private async init() {
        this.app = new PIXI.Application({
            width: 800,
            height: 600,
            antialias: true,
            resolution: window.devicePixelRatio || 1,
        });

        this.mainContainer = new Container();
        this.app.stage.addChild(this.mainContainer);
        document.body.appendChild(this.app.view);
    }

    public getApp() {
        return this.app;
    }
}

Game.getInstance();
