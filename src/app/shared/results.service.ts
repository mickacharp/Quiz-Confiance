import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ResultsService {
  // Counters of points according to user's answers
  oneA: number = 0;
  oneC: number = 0;
  twoA: number = 0;
  twoC: number = 0;
  poA: number = 0;
  poC: number = 0;
  pdA: number = 0;
  pdC: number = 0;
  aoA: number = 0;
  aoC: number = 0;
  adA: number = 0;
  adC: number = 0;
  threeA: number = 0;
  threeC: number = 0;
  fourA: number = 0;
  fourC: number = 0;

  constructor() {}

  // Formulas given by the client
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
