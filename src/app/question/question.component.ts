import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  NavigationStart,
  Router,
} from '@angular/router';
import { filter } from 'rxjs';

import { Question } from '../models/question.model';
import { Answer } from '../models/answer.model';
import { QuestionsService } from '../shared/questions.service';
import { ResultsService } from '../shared/results.service';
import { QuizComponent } from '../quiz/quiz.component';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
})
export class QuestionComponent implements OnInit {
  currentQuestion: Question = new Question(0, '', '', '', '', '');
  answers: Answer[] = [
    new Answer(0, ''),
    new Answer(0, ''),
    new Answer(0, ''),
    new Answer(0, ''),
    new Answer(0, ''),
    new Answer(0, ''),
    new Answer(0, ''),
    new Answer(0, ''),
    new Answer(0, ''),
    new Answer(0, ''),
    new Answer(0, ''),
    new Answer(0, ''),
    new Answer(0, ''),
    new Answer(0, ''),
    new Answer(0, ''),
    new Answer(0, ''),
    new Answer(0, ''),
    new Answer(0, ''),
    new Answer(0, ''),
    new Answer(0, ''),
    new Answer(0, ''),
    new Answer(0, ''),
    new Answer(0, ''),
    new Answer(0, ''),
  ];

  constructor(
    private questionsService: QuestionsService,
    private resultsService: ResultsService,
    private route: ActivatedRoute,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getQuestion();
    this.getStorageValues();
    this.getQuestionWhenUrlChanges();
    this.saveAnswerToStorageWhenUrlChanges();
    setTimeout(() => this.enableQuestionsAnswered(), 1);
  }

  @ViewChild(QuizComponent) quiz: QuizComponent = new QuizComponent(
    this.questionsService
  );

  getQuestion(): void {
    const id: number = parseInt(
      this.route.snapshot.paramMap.get('id') as string
    );
    this.currentQuestion = this.questionsService.questions[id - 1];
  }

  // call getQuestion() at each changes in URL if it includes "questions" in it
  getQuestionWhenUrlChanges(): void {
    if (this.router.url.includes('questions')) {
      this.router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe(() => {
          this.getQuestion();
        });
    }
  }

  // save user's answer of the current question to localStorage
  saveAnswerToStorage(): void {
    const currentAnswer: Answer = {
      questionNb: this.currentQuestion.nb,
      answer: this.answers[this.currentQuestion.nb - 1].answer,
    };
    localStorage.setItem(
      JSON.stringify(currentAnswer.questionNb),
      JSON.stringify(currentAnswer.answer)
    );
  }

  saveAnswerToStorageWhenUrlChanges(): void {
    if (this.router.url.includes('questions')) {
      this.router.events
        .pipe(filter((event) => event instanceof NavigationStart))
        .subscribe(() => {
          this.saveAnswerToStorage();
          this.enableNextQuestion();
        });
    }
  }

  // will loop through localStorage keys and associated values and affecting them to the answers
  // this will make the user to not lose any progression if he closes/refreshes the app
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

  previousQuestion(): void {
    const id: number = parseInt(
      this.route.snapshot.paramMap.get('id') as string
    );
    if (id > 1) {
      this.router.navigate([`questions/${id - 1}`]);
    }
  }

  nextQuestion(): void {
    const id: number = parseInt(
      this.route.snapshot.paramMap.get('id') as string
    );
    if (id < 24) {
      this.router.navigate([`questions/${id + 1}`]);
    }
  }

  // look in localStorage if some questions have been answered and if so, make them clickable in steps
  enableQuestionsAnswered(): void {
    for (let i = 0; i < localStorage.length; i++) {
      const storageKey: string | null = localStorage.key(i);
      if (
        storageKey != null &&
        storageKey != 'xCoordinate' &&
        storageKey != 'yCoordinate'
      ) {
        this.quiz.stepItems[parseInt(storageKey) - 1].disabled = false;
      }
    }
  }

  enableNextQuestion(): void {
    this.quiz.stepItems[this.currentQuestion.nb - 1].disabled = false;
  }

  calculateResults(): void {
    // we reset the counters before calculating final results
    this.resultsService.resetResultsCounters();
    // then, depending on the answer's value, we increment the associated result counter
    for (let i = 0; i < this.answers.length; i++) {
      switch (this.answers[i].answer) {
        case '1a':
          this.resultsService.oneA++;
          break;
        case '1C':
          this.resultsService.oneC++;
          break;
        case '2a':
          this.resultsService.twoA++;
          break;
        case '2C':
          this.resultsService.twoC++;
          break;
        case '3a':
          this.resultsService.threeA++;
          break;
        case '3C':
          this.resultsService.threeC++;
          break;
        case '4a':
          this.resultsService.fourA++;
          break;
        case '4C':
          this.resultsService.fourC++;
          break;
        case 'Poa':
          this.resultsService.poA++;
          break;
        case 'PoC':
          this.resultsService.poC++;
          break;
        case 'Pda':
          this.resultsService.pdA++;
          break;
        case 'PdC':
          this.resultsService.pdC++;
          break;
        case 'Aoa':
          this.resultsService.aoA++;
          break;
        case 'AoC':
          this.resultsService.aoC++;
          break;
        case 'Ada':
          this.resultsService.adA++;
          break;
        case 'AdC':
          this.resultsService.adC++;
          break;
      }
    }
  }

  calculateCoordinates(): void {
    this.resultsService.calculateCoordinates();
  }

  openConfirmationModal() {
    this.confirmationService.confirm({
      message:
        'Vous avez terminé votre questionnaire ? Alors cliquez sur "Valider" pour accéder à votre résultat !',
      header: 'Questionnaire terminé ?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Valider',
      rejectLabel: 'Revenir au questionnaire',
      dismissableMask: true,
      rejectButtonStyleClass: 'cancel',
      accept: () => {
        this.router.navigate(['/results']);
      },
    });
  }
}
