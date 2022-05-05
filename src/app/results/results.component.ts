import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { Test } from '../models/test.model';
import { Question } from '../models/question.model';
import { Answer } from '../models/answer.model';
import { QuestionsService } from '../shared/questions.service';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
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
  pointRadius: number =
    window.screen.width >= 1100 ? 12 : window.screen.width >= 800 ? 10 : 8;
  // Chart data
  data: any = {
    datasets: [
      {
        label: 'Votre résultat',
        data: [
          { x: this.xCoordinate, y: this.yCoordinate, r: this.pointRadius },
        ],
        backgroundColor: '#ff5550',
        borderWidth: 3,
        borderColor: '#FFFFFF',
      },
    ],
  };

  // Chart options
  options: any = {
    aspectRatio: 1,
    scales: {
      x: {
        min: -3,
        max: 3,
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
        min: -3,
        max: 3,
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

  tableBodyArray: any = [];

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
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();

    // Chart initialization
    const chart: HTMLElement = document.querySelector('#chart-container')!;
    const chartWidthTemp: number = chart.offsetWidth;
    const chartHeightTemp: number = chart.offsetHeight;
    chart.style.width = '650px';
    chart.style.height = '650px';

    // Fonts
    function setFontToMainTitle(): jsPDF {
      return pdf.setFont('Helvetica', 'bold').setFontSize(14);
    }
    function setFontToCitation(): jsPDF {
      return pdf.setFont('Helvetica', 'italic').setFontSize(10);
    }
    function setFontToSubtitles(): jsPDF {
      return pdf.setFont('Helvetica', 'bold').setFontSize(11);
    }
    function setFontToParagraph(): jsPDF {
      return pdf.setFont('Helvetica', 'normal').setFontSize(8);
    }
    function setFontToName(): jsPDF {
      return pdf.setFont('Helvetica', 'bold').setFontSize(9);
    }
    function setFontToJob(): jsPDF {
      return pdf.setFont('Helvetica', 'bold').setFontSize(8);
    }

    setTimeout(() => {
      html2canvas(chart, { scale: 1 }).then((canvas) => {
        //////////////////////// HEADER ////////////////////////

        // Top-left Logo
        const logo = new Image();
        logo.src = '../assets/logo.png';
        pdf.addImage(logo, 'png', 2, 0, 20, 20);

        // Main Title
        setFontToMainTitle();
        const mainTitle: Element = document.querySelector('#main-title')!;
        pdf.text(mainTitle.innerHTML, pdfWidth / 2 + 2, 10, {
          align: 'center',
        });

        // Citation
        setFontToCitation();
        const citation: Element = document.querySelector('#citation')!;
        pdf.text(citation.innerHTML, pdfWidth / 2, 15, {
          align: 'center',
        });

        // Citation author
        const citationAuthor: Element =
          document.querySelector('#citation-author')!;
        pdf.text(citationAuthor.innerHTML, pdfWidth / 2, 19, {
          align: 'center',
        });

        //////////////////////// CONTENT ////////////////////////

        // Subtitle "Votre résultat"
        setFontToSubtitles();
        const subtitleResults: Element =
          document.querySelector('#subtitle-results')!;
        pdf.text(subtitleResults.innerHTML, 3, 27);
        pdf.setDrawColor('#4CAF50').setLineWidth(0.5).line(3, 28, 80, 28); // green underline

        // Interpretation
        setFontToParagraph();
        const interpretationStart: Element = document.querySelector(
          '#interpretation-start'
        )!;
        const interpretationEnd: Element = document.querySelector(
          '#interpretation p span:not(#interpretation-start)'
        )!;
        const interpretationTotal: string = `${interpretationStart.innerHTML}${interpretationEnd.innerHTML}`;
        pdf.text(interpretationTotal, pdfWidth / 2, 33, {
          align: 'center',
        });

        // Chart image
        pdf.addImage(canvas.toDataURL('image/png'), 'png', 60, 38, 100, 100);
        pdf.setDrawColor('#FFFFFF').setLineWidth(1).line(158, 38, 158, 124); // white line to hide unwanted grey line

        // Subtitle "Vos réponses"
        setFontToSubtitles();
        const subtitleAnswers: Element =
          document.querySelector('#subtitle-answers')!;
        pdf.text(subtitleAnswers.innerHTML, 3, 129);
        pdf.setDrawColor('#4CAF50').setLineWidth(0.5).line(3, 130, 80, 130); // green underline

        // Answers Table
        autoTable(pdf, {
          head: [['#', 'Question', 'Réponse']],
          headStyles: {
            halign: 'center',
            valign: 'middle',
            fillColor: '#4CAF50',
            fontSize: 9,
          },
          body: this.tableBodyArray,
          bodyStyles: { fontSize: 6.5, overflow: 'linebreak', cellPadding: 1 },
          columnStyles: {
            0: {
              cellWidth: 6,
              halign: 'center',
              valign: 'middle',
              fillColor: '#4CAF50',
              textColor: '#FFFFFF',
            },
            1: { cellWidth: 'auto' },
            2: {
              cellWidth: 25,
              halign: 'center',
              valign: 'middle',
              fontStyle: 'bold',
            },
          },
          startY: 134,
          margin: 5,
        });

        //////////////////////// FOOTER ////////////////////////

        // Bottom-left Logo
        pdf.addImage(logo, 'png', 2, 275, 20, 20);

        // Name
        setFontToName();
        const clientName: Element = document.querySelector('#client-name')!;
        pdf.text(clientName.innerHTML, pdfWidth / 3, 284, { align: 'center' });

        // Job
        setFontToJob();
        const clientJob: Element = document.querySelector('#client-job')!;
        pdf.text(clientJob.innerHTML, pdfWidth / 3, 288, {
          align: 'center',
        });

        // Email
        setFontToParagraph();
        const clientEmail: Element = document.querySelector('#client-email')!;
        pdf.text(clientEmail.innerHTML, (2 * pdfWidth) / 3, 283, {
          align: 'center',
        });

        // Phone
        const clientPhone: Element = document.querySelector('#client-phone')!;
        pdf.text(clientPhone.innerHTML, (2 * pdfWidth) / 3, 286, {
          align: 'center',
        });

        // Hours
        const clientHours: Element = document.querySelector('#client-hours')!;
        pdf.text(clientHours.innerHTML, (2 * pdfWidth) / 3, 289, {
          align: 'center',
        });

        pdf.save(
          `Résultats_Test_Confiance_${this.formatDate(new Date())
            .slice(0, 10)
            .split('/')
            .join('-')}.pdf`
        );
      });
      chart.style.width = `${chartWidthTemp}px`;
      chart.style.height = `${chartHeightTemp}px`;
    }, 500);
  }

  createTableBody(): any {
    for (let i = 0; i < this.finalAnswers.length; i++) {
      this.tableBodyArray.push([
        this.finalAnswers[i].questionNb,
        this.finalAnswers[i].question,
        this.finalAnswers[i].answer,
      ]);
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
    this.createTableBody();
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
