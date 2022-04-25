import { Answer } from './answer.model';

export class Test {
  constructor(
    public answers: Answer[],
    public name: string,
    public date: string,
    public xCoordinate: number,
    public yCoordinate: number
  ) {}
}
