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
  threeA: number = 0;
  threeC: number = 0;
  fourA: number = 0;
  fourC: number = 0;
  poA: number = 0;
  poC: number = 0;
  pdA: number = 0;
  pdC: number = 0;
  aoA: number = 0;
  aoC: number = 0;
  adA: number = 0;
  adC: number = 0;

  constructor() {}

  resetResultsCounters(): void {
    this.oneA = 0;
    this.oneC = 0;
    this.twoA = 0;
    this.twoC = 0;
    this.threeA = 0;
    this.threeC = 0;
    this.fourA = 0;
    this.fourC = 0;
    this.poA = 0;
    this.poC = 0;
    this.pdA = 0;
    this.pdC = 0;
    this.aoA = 0;
    this.aoC = 0;
    this.adA = 0;
    this.adC = 0;
  }

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
