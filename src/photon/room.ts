export default class Room extends Photon.LoadBalancing.Room {
    constructor(name : string) {
        super(name);
        /*  this.setEmptyRoomLiveTime(10000);
        this.setSuspendedPlayerLiveTime(10000); */
    }
}
