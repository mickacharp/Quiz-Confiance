import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { Test } from '../models/test.model';
import { Question } from '../models/question.model';
import { Answer } from '../models/answer.model';
import { QuestionsService } from '../shared/questions.service';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { questionsList } from 'src/assets/questions-list';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
})
export class ResultsComponent implements OnInit {
  // convert Coords to number putting '+' before, knowing that parseInt doesn't work and return 0
  xCoordinate: number = +localStorage.getItem('xCoordinate')!;
  yCoordinate: number = +localStorage.getItem('yCoordinate')!;
  pointRadius: number = window.screen.width >= 1100 ? 8 : 4;
  // Chart data
  data: any = {
    datasets: [
      {
        label: 'Votre résultat',
        data: [
          { x: this.xCoordinate, y: this.yCoordinate, r: this.pointRadius },
        ],
        backgroundColor: '#4CAF50',
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

  pChartWidth: string = '';

  constructor(
    private afs: AngularFirestore,
    private router: Router,
    private questionsService: QuestionsService,
    private confirmationService: ConfirmationService,
    private message: MessageService
  ) {}

  ngOnInit(): void {
    this.checkIfDisplayResultsPage();
    this.getStorageValues();
    this.getFinalAnswers();
    this.checkIfUserCanSaveTest();
  }

  clearStorage(): void {
    localStorage.clear();
    sessionStorage.clear();
  }

  // p-dialog modal variables & methods (Save a test)
  displayTestModal: boolean = false;
  showTestModalDialog(): void {
    this.displayTestModal = true;
  }
  hideTestModalDialog(): void {
    this.displayTestModal = false;
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

  checkIfDisplayResultsPage(): void {
    if (localStorage.length < 26) {
      this.router.navigate(['/home']);
      this.message.add({
        severity: 'error',
        summary: 'Accès impossible',
        detail: `Vous avez été redirigé vers la page d'accueil car vous n'avez aucun résultat à afficher. Répondez d'abord au questionnaire.`,
      });
    }
  }

  openConfirmationModal() {
    this.confirmationService.confirm({
      message: `<p>Attention, si vous voulez recommencer le questionnaire, <strong>tous les résultats et réponses au
        test que vous venez de faire seront perdus !</strong> Vous pouvez le sauvegarder en
        cliquant sur "Sauvegarder mon questionnaire". </p>
        <p>Si vous êtes sûr de votre choix, alors cliquez sur "Commencer" </p>
        <p>(Si vous êtiez en train de consulter un de vos précédents tests, alors pas d'inquiètude, il restera enregistré dans notre base de données 😉)</p>`,
      header: 'Refaire un test',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Commencer',
      rejectLabel: 'Revenir aux résultats',
      dismissableMask: true,
      rejectButtonStyleClass: 'cancel',
      accept: () => {
        this.clearStorage();
        this.router.navigate(['/questions/1']);
      },
    });
  }

  generatePDF(): void {
    const pChartWidthTemp: string = this.pChartWidth;
    // since PDF is generated from the DOM, we set the viewport to 1920px width
    // so the PDF will always be the same as if it was generated on a 1920px desktop
    // even if generated from a mobile/iPad
    if (window.screen.width < 1920) {
      document
        .getElementById('viewport')!
        .setAttribute('content', 'width=1920');
    }
    this.pChartWidthFunction();
    setTimeout(() => {
      const data: HTMLElement | null = document.getElementById('pdf');
      if (data) {
        const pdf = new jsPDF('p', 'mm', 'a4');
        // scale: the higher the value, the higher the pdf resolution
        html2canvas(data, { scale: 1 }).then((canvas) => {
          const fileWidth = 210;
          const fileHeight = (canvas.height * fileWidth) / canvas.width;
          const docDataURL = canvas.toDataURL('image/png');
          pdf.addImage(docDataURL, 'PNG', 0, 0, fileWidth, fileHeight);
          pdf.save('Résultats_Test_Confiance.pdf');
        });
      }
      // at the end, we set viewport back to its initial value
      if (window.screen.width < 1920) {
        document
          .getElementById('viewport')!
          .setAttribute('content', 'width=device-width, initial-scale=1');
        this.pChartWidth = pChartWidthTemp;
      }
    }, 1000);
  }

  pChartWidthFunction(): void {
    const viewP: HTMLElement = document.getElementById('viewport')!;
    const content: string = viewP.getAttribute('content')!;
    if (content == 'width=1920') {
      this.pChartWidth = '1320px';
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
