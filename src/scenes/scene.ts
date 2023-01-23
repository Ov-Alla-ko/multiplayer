import {
    Application, autoDetectRenderer, Container, Graphics, Sprite, Texture,
} from 'pixi.js';

import Game from '../index';
import Players from '../ui/playersWindow';

export default class Scene extends Container {
    protected game: Game;
    protected app: Application;
    protected bg: Sprite;
    protected field : Container;
    protected playerField : Graphics;
    private static instance: Scene;
    protected startX : number;
    protected isLongeX : number;
    protected paintingLine: Graphics;

    protected arr : [][]

    constructor() {
        super();
        this.game = Game.getInstance();
        this.app = this.game.app;
        this.arr = [];
    }

    public static getInstance(): Scene {
        if (!Scene.instance) {
            Scene.instance = new Scene();
        }
        return Scene.instance;
    }

    public async init(): Promise<void> {
        this.createElements();
    }

    protected async createElements() {
        // this.createBg();
        // this.createPlayersField();
        this.createField();
    }

    private createBg() {
        const baseBG = new Graphics();
        baseBG.name = 'baseBG';
        baseBG.beginFill(0xffffff, 1);
        baseBG.drawRoundedRect(0, 0, 1000, 900, 0);
        this.addChild(baseBG);
    }

    private createField() {
        this.field = new Container();

        this.addChild(this.field);
        this.field.name = 'field';
        this.playerField = new Graphics();

        this.playerField.lineStyle(6, 0x00000, 1);
        this.playerField.beginFill(0xFFFFFF);
        this.playerField.drawRect(0, 0, 800, 600);
        this.playerField.endFill();
        this.field.addChild(this.playerField);
        this.field.interactive = true;
        this.startX = 0;
        this.isLongeX = 0;
    }

    public createPaint(x : number, y : number, size : number, color : number, getName: number) : void {
        this.paintingLine = new Graphics();
        let array = [];
        if (Number(x)) {
            this.paintingLine.name = `paintingLine${getName}`;
            this.paintingLine.beginFill(color, 1);
            this.paintingLine.drawRoundedRect(x, y, size, size, 100);
            this.paintingLine.zIndex = 100;
            this.field.addChild(this.paintingLine);
        } else {
            // @ts-ignore
            for (let index = 0; index < x.length; index++) {
                array.push([x[index], y[index]]);
            }

            for (let index = 0; index < array.length; index++) {
                this.paintingLine.name = `paintingLine${getName}`;
                this.paintingLine.beginFill(color, 1);
                this.paintingLine.drawRoundedRect(array[index][0], array[index][1], size, size, 100);
                this.paintingLine.zIndex = 100;
                this.field.addChild(this.paintingLine); console.log(array);
                console.log(this.field.children);
            }

            array = [];
        }
    }

    private createPlayersField() {
        const field = new Players();
        this.addChild(field);
    }
}
