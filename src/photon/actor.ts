import Client from './client';
import Visual from '../ui/visual';
import CONFIG from '../config';

export default class Actor extends Photon.LoadBalancing.Actor {
    public client : Client;
    public name : string;
    public actorNr : number;
    public isLocal : boolean;
    private visual : Visual;
    public posX : number;
    public posY: number;
    public sizePen: number;
    public chooseColor: string;
    public changeName: string;
    protected arrOfX: number[];
    protected arrOfY: number[];
    protected size : number;
    protected color;
    arrX: number[];

    constructor(client : Client, name : string, actorNr : number, isLocal : boolean) {
        super(name, actorNr, isLocal);
        this.arrOfX = [];
        this.arrOfY = [];
    }

    public getRoom() {
        return super.getRoom();
    }

    public hasVisual() {
        return this.visual;
    }

    public setVisual(visual : Visual): void {
        this.visual = visual;
        this.visual.generatePlayerName(`Player ${this.actorNr}`);
    }

    protected draw(nxtPosX : number, nxtPosY : number, num, coll): void {
        this.posX = nxtPosX;
        this.posY = nxtPosY;
        this.sizePen = num;
        this.chooseColor = coll;
        if (this.visual) {
            this.visual.update(nxtPosX, nxtPosY, num, coll);
        }
    }
    protected newName(name: string): void {
        this.arrX = [];
        this.changeName = name;
        if (this.visual) {
            this.visual.updateName(this.changeName);
        }console.log(this.arrX);
    }

    public moveLocal(x : number, y : number, num: number, coll) {
        const nxtPosX = x;
        const nxtPosY = y;
        const sizePen = num;
        const chooseColor = coll;
        console.log(nxtPosX);
        this.draw(nxtPosX, nxtPosY, sizePen, chooseColor);
        this.raiseEvent(CONFIG.Event.Draw, { 0: [nxtPosX, nxtPosY, sizePen, chooseColor] });
    }

    public changeOfName(name: string) {
        const nameChange = name;
        this.newName(nameChange);
        this.raiseEvent(CONFIG.Event.Change, { 1: [nameChange] });
        this.setName(`${nameChange}`);
    }
}
