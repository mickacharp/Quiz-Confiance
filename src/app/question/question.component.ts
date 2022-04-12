import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

import { Question } from '../models/question.model';
import { Answer } from '../models/answer.model';
import { QuestionsService } from '../shared/questions.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
})
export class QuestionComponent implements OnInit {
  xPosition: number = 0;
  yPosition: number = 0;
  allAnswers: Answer[] = [];
  storageKeys: any[] = [];
  currentQuestion: Question = new Question(0, '', '', '', '', '');
  answers: string[] = [
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
  ];
  checked1: boolean = false;
  checked2: boolean = false;

  constructor(
    private questionsService: QuestionsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getQuestion();
    this.getStorageKeys();
    // call getQuestion() at each changes in URL if it includes "questions" in it
    if (this.router.url.includes('questions')) {
      this.router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe(() => {
          this.getQuestion();
        });
    }
    this.xPosition = this.questionsService.calculateXPosition();
    this.yPosition = this.questionsService.calculateYPosition();
    console.log(this.answers);
  }

  getQuestion(): void {
    const id: number = parseInt(
      this.route.snapshot.paramMap.get('id') as string
    );
    this.currentQuestion = this.questionsService.questions[id - 1];
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

  saveAnswer(): void {
    const currentAnswer: Answer = {
      questionNb: this.currentQuestion.nb,
      answer: this.answers[this.currentQuestion.nb - 1],
    };
    const indexOfAnswerThatAlreadyExists: number = this.allAnswers.findIndex(
      (element) => element.questionNb === this.currentQuestion.nb
    );
    if (indexOfAnswerThatAlreadyExists != -1) {
      this.allAnswers[indexOfAnswerThatAlreadyExists].answer =
        this.answers[this.currentQuestion.nb - 1];
      localStorage.setItem(
        JSON.stringify(currentAnswer.questionNb),
        JSON.stringify(this.answers[this.currentQuestion.nb - 1])
      );
    } else {
      this.allAnswers.push(currentAnswer);
      localStorage.setItem(
        JSON.stringify(currentAnswer.questionNb),
        JSON.stringify(currentAnswer.answer)
      );
    }
    console.log(this.allAnswers);
  }

  getStorageKeys(): void {
    for (let i = 0; i < localStorage.length; i++) {
      const key: string | null = localStorage.key(i);
      if (key != null) {
        const value: string | null = localStorage.getItem(key);
        if (value != null) {
          this.answers[parseInt(key) - 1] = JSON.parse(value);
        }
      }
    }
  }

  // reinitializeAnswerChoice(): void {
  //   this.getStorageKeys();
  //   const id: number = parseInt(
  //     this.route.snapshot.paramMap.get('id') as string
  //   );

  //   if (!this.storageKeys.some((key) => key == id + 1)) {
  //     this.answer = '';
  //   }
  // }
}
