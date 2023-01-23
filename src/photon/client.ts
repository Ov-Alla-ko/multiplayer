/* eslint-disable no-useless-concat */
/* eslint-disable no-fallthrough */

import Actor from './actor';
import Visual from '../ui/visual';
import CONFIG from '../config';
import Scene from '../scenes/scene';
import Room from './room';

export default class Client extends Photon.LoadBalancing.LoadBalancingClient {
   protected wss : boolean;
   protected id : string;
   protected version : string;
   protected isTap : boolean;
   protected custom: any[];
   protected autoConnect = true;
   protected masterStart = false;
   protected scene: Scene;
   protected customProps;

   constructor(wss : boolean, id : string, version : string) {
       super(wss ? Photon.ConnectionProtocol.Wss : Photon.ConnectionProtocol.Ws, id, version);
       this.wss = wss;
       this.id = id;
       this.version = version;
       this.scene = Scene.getInstance();

       const addr = this.masterStart ? this.getMasterServerAddress() : this.getNameServerAddress();
       console.log(`Init addr : ${addr}, id : ${id}, version : ${version}`);
   }

   public roomFactory(name : string): Room {
       return new Room(name);
   }

   public actorFactory(name : string, actorNr : number, isLocal : boolean): Actor {
       return new Actor(this, name, actorNr, isLocal);
   }

   public myRoom() {
       return super.myRoom();
   }

   public myActor() {
       return super.myActor();
   }

   public myRoomActors() {
       return super.myRoomActors();
   }

   onJoinRoom() {
       console.log(`Room[${this.myRoom().name}]`);
       this.customProps = this.myRoom().getCustomProperty(this.myRoom().name);
       this.setupScene();
   }

   onActorJoin(actor : Actor) {
       console.log(`Actor ${actor.actorNr} `);
       // eslint-disable-next-line no-unused-expressions
       this.customProps;
       if (this.customProps !== undefined) {
           for (let index = 0; index < this.customProps.length; index++) {
               this.myActor().moveLocal(this.customProps[index][0], this.customProps[index][1], this.customProps[index][2],
                   this.customProps[index][3]);
           }
       }

       if (!actor.hasVisual()) actor.setVisual(new Visual(actor.actorNr));
       for (let index = 0; index < this.myRoomActorsArray().length; index++) {
           if (this.myRoomActorsArray()[index].name !== '')console.log(document.getElementById(`Player ${this.myRoomActorsArray()[index].actorNr}`).innerHTML = this.myRoomActorsArray()[index].name);
       }
   }

   onActorLeave(actor : Actor) {
       if (!actor.isLocal) {
           //  actor.clearVisual();
       }
       //  actor.clearVisual();
       console.log(`Actor ${actor.actorNr} `);
   }

   onEvent(code : number, content : number, actorNr : number) {
       switch (code) {
       case CONFIG.Event.Draw: {
           const actor = (this.myRoomActors()[actorNr]);
           actor.draw(content[0][0], content[0][1], content[0][2], content[0][3]);
           console.log(`Event.Drow ${content[0][0]} ${content[0][1]} ${content[0][2]} ${content[0][3]}`);

           break; }
       case CONFIG.Event.Change: {
           const actor = (this.myRoomActors()[actorNr]);
           actor.newName(content[1][0]);
           console.log(`Event.Change ${content[1][0]}`);

           break; }
       default:
           break;
       }
   }

    onStateChange = (() => {
        const LBC = Photon.LoadBalancing.LoadBalancingClient;
        return (state) => {
            this.myRoom().setMaxPlayers(3);
            const stateText = state === LBC.State.Joined
                ? `State: ${LBC.StateToName(state)}, RoomName: ${this.myRoom().name}`
                : `State: ${LBC.StateToName(state)}`;
            console.log(stateText, this.myRoom());

            switch (state) {
            case LBC.State.ConnectedToNameServer:

                this.getRegions();
                this.connectToRegionMaster('US');
                break;
            case LBC.State.ConnectedToMaster:
                break;
            case LBC.State.JoinedLobby:
                if (this.autoConnect) {
                    console.log('joining random room ...');
                    this.joinRandomRoom();
                    console.log(`RoomName: ${this.myRoom().name}`);
                }
                break;
            default:
                break;
            }
        };
    })();

    onOperationResponse(errorCode : number, errorMessage : string, code : number, content : number) {
        if (errorCode) {
            switch (code) {
            case Photon.LoadBalancing.Constants.OperationCode.JoinRandomGame:
                switch (errorCode) {
                case Photon.LoadBalancing.Constants.ErrorCode.NoRandomMatchFound:
                    console.log(`Join Random ${errorCode} :`);
                    this.createRoom();
                    break;
                default:
                    console.log(`Join Random ${errorCode}`);
                    break;
                }

            default:
                console.log(`Operarion Response Error ${errorCode}, ${errorMessage}, ${code}, ${content}`);
                break;
            }
        }
    }

    public start() {
        this.setCustomAuthentication('username=' + 'yes' + '&token=' + 'yes');
        if (this.masterStart) {
            this.connect({ keepMasterConnection: true });
        } else {
            this.connectToRegionMaster('PUN');
        }
        this.setupUI();
    }

    private setupUI() {
        const select = <HTMLInputElement>document.getElementById('selectId');
        const colorWell = <HTMLInputElement>document.getElementById('colorWell');
        colorWell.select();
        this.scene.interactive = true;
        this.custom = [];
        let startX = [];
        let startY = [];
        let timerId;
        this.scene.on('pointermove', (event) => {
            if (!event.target) return;
            if (event.target.name === 'field' && this.isTap) {
                const { x } = event.data.global;
                const { y } = event.data.global;
                startX.push(x);
                startY.push(y);
                this.custom.push([x, y, Number(select.value) * 2, colorWell.value.replace('#', '0x')]);
                if (x > 790 || x < 10 || y > 590 || y < 10) {
                    this.isTap = false;
                }
            }
        }).on('pointerdown', () => {
            this.isTap = true;
            this.custom = [];
            timerId = setInterval(() => {
                console.log(startX);
                this.myActor().moveLocal(startX, startY, Number(select.value) * 2, colorWell.value.replace('#', '0x'));
                startX = [];
                startY = [];
                console.log(startX);
            }, 50);
        }).on('pointerup', () => {
            this.isTap = false;
            this.myRoom().setCustomProperty(this.myRoom().name, this.custom);
            console.log(this.custom);

            setTimeout(() => { clearInterval(timerId); console.log('stop'); }, 0);
        });
        document.getElementById('name').addEventListener('input', () => this.myActor().changeOfName((<HTMLInputElement>document.getElementById('name')).value));
    }

    protected setupScene() {
        for (const aNr in this.myRoomActors()) {
            if (Object.prototype.hasOwnProperty.call(this.myRoomActors(), aNr)) {
                const actor = this.myRoomActors()[aNr];
                if (!actor.hasVisual()) actor.setVisual(new Visual([aNr]));
            }
        }
    }
}
