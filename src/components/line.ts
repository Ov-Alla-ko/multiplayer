/* eslint-disable no-multi-assign */
import { Graphics } from 'pixi.js';

export default class Line extends Graphics {
    protected lineWidth: number;
    protected lineColor: any;
    protected points;
    constructor(points, lineSize, lineColor) {
        super();

        let s = this.lineWidth = lineSize || 5;
        let c = this.lineColor = lineColor || '0x000000';

        this.points = points;

        this.lineStyle(s, c);

        this.moveTo(points[0], points[1]);
        this.lineTo(points[2], points[3]);
    }

    updatePoints(p) {
        const points = this.points = p.map((val, index) => val || this.points[index]);

        const s = this.lineWidth; const
            c = this.lineColor;

        this.clear();
        this.lineStyle(s, c);
        this.moveTo(points[0], points[1]);
        this.lineTo(points[2], points[3]);
    }
}
