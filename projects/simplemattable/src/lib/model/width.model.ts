export class Width {

  private percent: number;
  private pixel: number;

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

  toString(): string {
    return this.percent ? this.percent + '%' : this.pixel + 'px';
  }

}
