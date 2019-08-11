export class Height {

  private percent: number;
  private pixel: number;

  static pct(percent: number): Height {
    const height = new Height();
    height.percent = percent;
    return height;
  }

  static px(pixel: number): Height {
    const height = new Height();
    height.pixel = pixel;
    return height;
  }

  toString(): string {
    return this.percent ? this.percent + '%' : this.pixel + 'px';
  }

  getNumber(): number {
    return this.percent || this.pixel;
  }

  isPercent(): boolean {
    return !!this.percent;
  }

}
