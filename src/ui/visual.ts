import Scene from '../scenes/scene';

export default class Visual {
    private canvas : Scene;
    protected namePlayer: HTMLCollectionOf<HTMLElement>;
    protected changeName: string;
    protected getName: number;
    protected getPosition: number;

    protected some

    constructor(name) {
        this.getName = name;
        this.getPosition = 30;
        this.canvas = Scene.getInstance();
    }

    public update(x : number, y : number, size : number, color : number) : void {
        this.canvas.createPaint(x, y, size, color, this.getName);
    }

    public updateName(name: string) : void {
        document.getElementById(this.some).innerText = name;
        console.log(name, this.some);
    }

    public generatePlayerName(name) : void {
        this.namePlayer = document.getElementsByTagName('b');
        console.log(name);
        for (let index = 0; index < this.namePlayer.length; index++) {
            if (this.namePlayer[index].id === name) {
                this.namePlayer[index].innerText = name;
                this.some = name;
            }
        }
    }
}
