import { Injectable } from '@angular/core';
import { questionsList } from 'src/assets/questions-list';
import { Question } from '../models/question.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from '../models/user.model';
import { Test } from '../models/test.model';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuestionsService {
  questions: Question[] = questionsList;

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

  getTestsOfUser(testKey: string): Observable<Test> {
    const myTest = this.afs.doc<Test>('tests/' + testKey);
    return myTest.valueChanges() as Observable<Test>;
  }
}
