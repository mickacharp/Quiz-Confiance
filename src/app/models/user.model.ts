export class User {
  constructor(
    public uid: string,
    public email: string,
    public tests: string[],
    public isRelanced: boolean
  ) {}
}
