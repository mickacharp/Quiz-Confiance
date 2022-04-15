import { Injectable } from '@angular/core';
import { questionsList } from 'src/assets/questions-list';
import { Question } from '../models/question.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Answer } from '../models/answer.model';
import { User } from '../models/user.model';
import { Test } from '../models/test.model';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuestionsService {
  questions: Question[] = questionsList;
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

  constructor(private afs: AngularFirestore) {}

  saveUserInDatabase(newUser: User): void {
    this.afs.collection<User>('users').add(JSON.parse(JSON.stringify(newUser))); // we need to JSON the file before pushing it to Firebase
  }

  saveTestInDatabase(newTest: Test): void {
    this.afs.collection<Test>('tests').add(JSON.parse(JSON.stringify(newTest)));
  }

  getUserByEmail(userEmail: string): Observable<User[]> {
    return this.afs
      .collection<User>('users', (ref) => ref.where('email', '==', userEmail))
      .snapshotChanges()
      .pipe(
        map((changes) =>
          changes.map((c) => {
            const data = c.payload.doc.data() as User;
            const id = c.payload.doc.id;
            return { id, ...data };
          })
        )
      );
  }

  // getTestsOfUser(userTest: string): Test {
  //   return this.afs.collection<Test>('tests').doc(userTest).ref.get();
  // }

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
