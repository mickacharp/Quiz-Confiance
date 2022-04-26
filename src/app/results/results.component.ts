import { Component, OnInit } from '@angular/core';
import { Test } from '../models/test.model';
import { User } from '../models/user.model';
import { Question } from '../models/question.model';
import { QuestionsService } from '../shared/questions.service';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { questionsList } from 'src/assets/questions-list';
import { Answer } from '../models/answer.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
})
export class ResultsComponent implements OnInit {
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

  // Variables
  questions: Question[] = questionsList;
  answers: Answer[] = [];
  finalAnswers: any[] = [];
  selectedAnswer: any;

  canSaveTest: boolean = true;

  userEmail: string = '';
  userTestName: string = '';

  constructor(
    private questionsService: QuestionsService,
    private afs: AngularFirestore,
    private message: MessageService
  ) {}

  ngOnInit(): void {
    this.getStorageValues();
    this.getFinalAnswers();
    this.checkIfUserCanSaveTest();
  }

  displayModal: boolean = false;
  showModalDialog(): void {
    this.displayModal = true;
  }
  hideModalDialog(): void {
    this.displayModal = false;
    this.message.add({
      severity: 'success',
      summary: 'Questionnaire sauvegardé',
      detail: `Votre questionnaire a bien été enregistré, vous pouvez y accéder à tout moment depuis la page d'accueil.`,
    });
  }

  checkIfUserCanSaveTest(): void {
    const canUserSaveTest: string | null =
      sessionStorage.getItem('canSaveTest');
    if (canUserSaveTest != null) {
      this.canSaveTest = false;
    } else {
      this.canSaveTest = true;
    }
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

  saveTestInDatabase(): void {
    const userToSave: User = new User(this.afs.createId(), this.userEmail, []);
    const testToSave: Test = new Test(
      [],
      this.userTestName,
      this.formatDate(new Date()),
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
    // canSaveTest is set to false to avoid user to save multiple times his same test
    this.canSaveTest = false;
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

  // convert Date into string of 'dd/mm/yyy hh:min' format
  formatDate(date: Date): string {
    return (
      [
        this.padTo2Digits(date.getDate()),
        this.padTo2Digits(date.getMonth() + 1),
        date.getFullYear(),
      ].join('/') +
      ' à ' +
      [
        this.padTo2Digits(date.getHours()),
        this.padTo2Digits(date.getMinutes()),
        this.padTo2Digits(date.getSeconds()),
      ].join(':')
    );
  }
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart
  padTo2Digits(num: number): string {
    return num.toString().padStart(2, '0');
  }
}
