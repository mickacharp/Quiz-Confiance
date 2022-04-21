import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Test } from '../models/test.model';
import { User } from '../models/user.model';
import { QuestionsService } from '../shared/questions.service';
import { ResultsService } from '../shared/results.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
})
export class ResultsComponent implements OnInit {
  xCoordinate: number = this.resultsService.calculateXPosition();
  yCoordinate: number = this.resultsService.calculateYPosition();

  data: any = {
    datasets: [
      {
        label: 'Votre résultat',
        data: [{ x: this.xCoordinate, y: this.yCoordinate, r: 10 }],
        backgroundColor: '#f2440f',
      },
    ],
  };

  options: any = {
    scales: {
      x: {
        min: -4,
        max: 4,
        position: 'center',
        width: 50,
        ticks: {
          display: false,
        },
        grid: {
          borderWidth: 2,
          borderColor: 'black',
          lineWidth: 1,
        },
      },
      y: {
        min: -4,
        max: 4,
        position: 'center',
        ticks: {
          display: false,
        },
        grid: {
          borderWidth: 2,
          borderColor: 'black',
          lineWidth: 1,
        },
      },
    },
    plugins: {
      title: {
        display: true,
        text: 'My Title',
        font: { size: 30, color: 'red' },
        color: '#15a608',
      },
      legend: {
        display: false,
      },
    },
  };

  displayModal: boolean = false;
  showModalDialog(): void {
    this.displayModal = true;
  }

  userFirstname: string = '';
  userLastname: string = '';
  userEmail: string = '';

  constructor(
    private questionsService: QuestionsService,
    private resultsService: ResultsService,

    private afs: AngularFirestore
  ) {}

  ngOnInit(): void {}

  saveTestInDatabase(): void {
    const userToSave: User = new User(
      this.userEmail,
      this.userFirstname,
      this.userLastname,
      []
    );
    const testToSave: Test = new Test([]);

    for (let i = 0; i < localStorage.length; i++) {
      const storageKey: string | null = localStorage.key(i);
      if (storageKey != null) {
        const storageValue: string | null = localStorage.getItem(storageKey);
        if (storageValue != null) {
          testToSave.answers[i] = {
            questionNb: parseInt(storageKey),
            answer: storageValue.replace(/"/g, ''),
          };
        }
      }
    }
    // sort the test to save so the answers are sorted by question number
    testToSave.answers.sort((a, b) => {
      return a.questionNb - b.questionNb;
    });

    this.questionsService.saveTestInDatabase(testToSave, userToSave);
  }

  userAlreadyExists(): void {
    this.afs
      .collection<User>('users')
      .valueChanges({ idField: 'uid' })
      .subscribe((users) => console.log(users[0].uid));
  }
}
