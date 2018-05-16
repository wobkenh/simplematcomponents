export class Width {

  private percent: number;
  private pixel: number;
  private _shrink: boolean = false;
  private _grow: boolean = false;

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

  shrink() {
    this._shrink = true;
    return this;
  }

  grow() {
    this._grow = true;
    return this;
  }

  getFlex() {
    return (+this._grow).toString() + ' ' + (+this._shrink).toString() + ' ' +
      (this.percent ? this.percent.toString() + '%' : this.pixel.toString() + 'px');
  }

}
