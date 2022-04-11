import { Injectable } from '@angular/core';
import { questionsList } from 'src/assets/questions-list';
import { Question } from '../models/question.model';

@Injectable({
  providedIn: 'root',
})
export class QuestionsService {
  questions: Question[] = questionsList;
  oneA: number = 1;
  oneC: number = 4;
  twoA: number = 3;
  twoC: number = 2;
  poA: number = 2;
  poC: number = 3;
  pdA: number = 2;
  pdC: number = 1;
  aoA: number = 2;
  aoC: number = 2;
  adA: number = 3;
  adC: number = 1;
  threeA: number = 2;
  threeC: number = 1;
  fourA: number = 1;
  fourC: number = 4;

  constructor() {}

  calculateXPosition(): number {
    return (
      (this.twoA +
        this.adA +
        this.fourA -
        this.oneA -
        this.aoA -
        this.threeA +
        (this.twoC +
          this.adC +
          this.fourC -
          this.oneC -
          this.aoC -
          this.threeC) *
          3) /
      24
    );
  }

  calculateYPosition(): number {
    return (
      (this.oneA +
        this.twoA +
        this.pdA -
        this.poA -
        this.threeA -
        this.fourA +
        (this.oneC +
          this.twoC +
          this.pdC -
          this.poC -
          this.threeC -
          this.fourC) *
          3) /
      24
    );
  }
}
