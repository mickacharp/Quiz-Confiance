import { Component, OnInit } from '@angular/core';
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

  // Chart data
  data: any = {
    datasets: [
      {
        label: 'Votre résultat',
        data: [{ x: this.xCoordinate, y: this.yCoordinate, r: 8 }],
        backgroundColor: '#f2440f',
      },
    ],
  };

  // Chart options
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
          borderWidth: 0,
          borderColor: 'black',
          lineWidth: 0,
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
          borderWidth: 0,
          borderColor: 'black',
          lineWidth: 0,
        },
      },
    },
    plugins: {
      title: {
        display: false,
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

  userFirstname: string = '';
  userLastname: string = '';
  userEmail: string = '';

  constructor(
    private questionsService: QuestionsService,
    private resultsService: ResultsService
  ) {}

  ngOnInit(): void {}

  showModalDialog(): void {
    this.displayModal = true;
  }

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
}
