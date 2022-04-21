import { Injectable } from '@angular/core';
import { Question } from '../models/question.model';
import { User } from '../models/user.model';
import { Test } from '../models/test.model';
import { questionsList } from 'src/assets/questions-list';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { arrayUnion } from 'firebase/firestore';
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

  saveTestInDatabase(newTest: Test, newUser: User): void {
    // add the test in db (collection 'tests')
    this.afs
      .collection<Test>('tests')
      .add(JSON.parse(JSON.stringify(newTest)))
      .then((docRef) => {
        // then search in db if any user has the same email as the newUser
        this.getUserByEmail(newUser.email).subscribe(([userExists]) => {
          // if so, add the newTest's id (docRef.id) in the tests array of the user in db
          if (userExists) {
            this.afs
              .collection<User>('users', (ref) =>
                ref.where('email', '==', newUser.email)
              )
              .valueChanges({ idField: 'uid' })
              .subscribe((users) =>
                this.afs
                  .doc('users/' + users[0].uid)
                  .set({ tests: arrayUnion(docRef.id) }, { merge: true })
              );
            // if no user is found, he is created
          } else {
            this.saveUserInDatabase(
              new User(newUser.email, newUser.firstname, newUser.lastname, [
                docRef.id,
              ])
            );
          }
        });
      });
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

  getAllUsers(): Observable<User[]> {
    return this.afs
      .collection<User>('users')
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
}
