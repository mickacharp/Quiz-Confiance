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
import { Test } from '../models/test.model';
import { QuizComponent } from '../quiz/quiz.component';
import { ResultsService } from '../shared/results.service';

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
    private router: Router
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

  enableQuestionsAnswered(): void {
    for (let i = 0; i < localStorage.length; i++) {
      const storageKey: string | null = localStorage.key(i);
      if (storageKey != null) {
        this.quiz.stepItems[parseInt(storageKey) - 1].disabled = false;
      }
    }
  }

  enableNextQuestion(): void {
    this.quiz.stepItems[this.currentQuestion.nb - 1].disabled = false;
  }

  // will loop through localStorage keys and associated values and affecting them to the answers
  // this will make the user to not lose any progression if he closes/refreshes the app
  getStorageValues(): void {
    for (let i = 0; i < localStorage.length; i++) {
      const storageKey: string | null = localStorage.key(i);
      if (storageKey != null) {
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

  // saveUserInDatabase(): void {
  //   this.questionsService.saveUserInDatabase(NEW USER HERE);
  // }

  saveTestInDatabase(): void {
    // initialize a Test object and loop through it: then affect it the value and the answer of each question
    const testToSave: Test = new Test([]);
    for (let i = 0; i < this.answers.length; i++) {
      testToSave.answers[i] = {
        questionNb: i + 1,
        answer: this.answers[i].answer,
      };
    }

    this.questionsService.saveTestInDatabase(testToSave);
  }

  gatherResults(): void {
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
}
