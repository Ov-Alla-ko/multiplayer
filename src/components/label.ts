import {
    Container, Text, Texture,
} from 'pixi.js';

export interface IStyle {

  fontFamily?: string,
  fontSize?: number,
  fontWeight?: string,
  fill?: number,
}

export interface ILabelSetting {
  label: string;
  style: IStyle;
  posit?: string;
}

export interface IImg {
  resource?: Texture;
  size?: number;
  positionStart?: boolean,
  margin?: number;
}

export default class Label extends Container {
  protected text: Text;
  protected label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected style: any;
  protected posit?: string;

  constructor(options: ILabelSetting) {
      super();
      this.label = options.label;
      this.style = options.style;

      this.init();
  }

  protected init(): void {
      this.text = new Text(this.label, this.style);
      this.addChild(this.text);
  }

  public getValue(): string {
      return this.text.text;
  }

  public addTint(varible): void {
      if (varible === true) {
          this.text.tint = 0xcccccc;
      } else if (varible === false) {
          this.text.tint = 0xFFFFFF;
      }
  }

  public removeLabelText(newLabel: string) {
      this.text.text = newLabel;
  }
}
