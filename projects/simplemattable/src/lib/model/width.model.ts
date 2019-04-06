export class Width {

  private percent: number;
  private pixel: number;
  private _shrink: number = 0;
  private _grow: number = 0;

  static pct(percent: number): Width {
    const width = new Width();
    width.percent = percent;
    return width;
  }

  static px(pixel: number): Width {
    const width = new Width();
    width.pixel = pixel;
    return width;
  }

  shrink(weight: number = 1) {
    this._shrink = weight;
    return this;
  }

  grow(weight: number = 1) {
    this._grow = weight;
    return this;
  }

  getFlex() {
    return this._grow.toString() + ' ' + this._shrink.toString() + ' ' +
      (this.percent ? this.percent.toString() + '%' : this.pixel.toString() + 'px');
  }

  toString(): string {
    return this.percent ? this.percent + '%' : this.pixel + 'px';
  }

}
