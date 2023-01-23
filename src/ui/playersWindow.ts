import { Container, Graphics } from 'pixi.js';

import Game from '../index';
import Label from '../components/label';
import Scene from '../scenes/scene';

export default class Players extends Container {
    protected game: Game;
    protected size: number;
    protected sizePop: number;
    protected text:string;
    protected label: Label;
    protected labelButton: Label;
    protected scene: Scene;
    protected win : string;

    constructor() {
        super();
        this.createPlayersField();
        // this.init();
    }

    protected createPlayersField(): void {
        const players = new Graphics();

        players.lineStyle(2, 0x00000, 1);
        players.beginFill(0xFFFFFF);
        players.drawRect(130, 30, 280, 160);
        players.endFill();
        this.addChild(players);
    }
}
