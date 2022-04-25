import { Component, OnInit } from '@angular/core';
import { Test } from '../models/test.model';
import { User } from '../models/user.model';
import { Question } from '../models/question.model';
import { QuestionsService } from '../shared/questions.service';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { questionsList } from 'src/assets/questions-list';
import { Answer } from '../models/answer.model';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
})
export class ResultsComponent implements OnInit {
  questions: Question[] = questionsList;
  answers: Answer[] = [];
  finalAnswers: any[] = [];
  selectedAnswer: any;

  displayModal: boolean = false;

  userEmail: string = '';
  userTestName: string = '';

  // convert Coords to number putting '+' before, knowing that parseInt doesn't work and return 0
  xCoordinate: number = +localStorage.getItem('xCoordinate')!;
  yCoordinate: number = +localStorage.getItem('yCoordinate')!;

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

  constructor(private questionsService: QuestionsService) {}

  ngOnInit(): void {
    this.getStorageValues();
    this.getFinalAnswers();
  }

  generatePDF(): void {
    const data: HTMLElement | null = document.getElementById('pdf');
    if (data) {
      const pdf = new jsPDF('p', 'mm', 'a4');
      // scale: the higher the value, the higher the pdf resolution
      html2canvas(data, { scale: 2 }).then((canvas) => {
        const fileWidth = 210;
        const fileHeight = (canvas.height * fileWidth) / canvas.width;
        const docDataURL = canvas.toDataURL('image/png');
        pdf.addImage(docDataURL, 'PNG', 0, 0, fileWidth, fileHeight);
        pdf.save('Résultats_Test_Confiance.pdf');
      });
    }
  }

  showModalDialog(): void {
    this.displayModal = true;
  }

  saveTestInDatabase(): void {
    const userToSave: User = new User(this.userEmail, []);
    const testToSave: Test = new Test(
      [],
      this.userTestName,
      'DATE A METTRE',
      this.xCoordinate,
      this.yCoordinate
    );

    for (let i = 0; i < localStorage.length; i++) {
      const storageKey: string | null = localStorage.key(i);
      if (
        storageKey != null &&
        storageKey != 'xCoordinate' &&
        storageKey != 'yCoordinate'
      ) {
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

  getStorageValues(): void {
    for (let i = 0; i < localStorage.length; i++) {
      const storageKey: string | null = localStorage.key(i);
      if (
        storageKey != null &&
        storageKey != 'xCoordinate' &&
        storageKey != 'yCoordinate'
      ) {
        const storageValue: string | null = localStorage.getItem(storageKey);
        if (storageValue != null) {
          this.answers[parseInt(storageKey) - 1] = {
            questionNb: JSON.parse(storageKey),
            answer: JSON.parse(storageValue),
          };
        }
      }
    }
  }

  getFinalAnswers(): void {
    this.answers.sort((a, b) => {
      return a.questionNb - b.questionNb;
    });

    for (let i = 0; i < this.questions.length; i++) {
      this.finalAnswers.push({
        questionNb: this.questions[i].nb,
        question: this.questions[i].name,
        answer:
          this.answers[i].answer === this.questions[i].valueA
            ? 'oui, tout à fait'
            : this.answers[i].answer === this.questions[i].valueB
            ? 'oui'
            : this.answers[i].answer === this.questions[i].valueC
            ? 'non'
            : 'non, absolument pas',
      });
    }
  }
}
