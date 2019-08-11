export class TestData {
  constructor(public key: string, public value: string, public date: Date) {}
}

export class ComplexTestData {
  constructor(
    public id: number,
    public value: number,
    public description: string,
    public data: TestData,
    public notes: string
  ) {}
}
