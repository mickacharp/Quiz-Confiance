import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Question } from '../models/question.model';
import { QuestionsService } from '../shared/questions.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
})
export class QuestionComponent implements OnInit {
  xPosition: number = 0;
  yPosition: number = 0;
  answer: string = '';

  currentQuestion: Question = new Question(0, '', '', '', '', '');

  checked1: boolean = false;
  checked2: boolean = false;

  constructor(
    private questionsService: QuestionsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.xPosition = this.questionsService.calculateXPosition();
    this.yPosition = this.questionsService.calculateYPosition();
    this.getOneQuestion();
  }

  getOneQuestion(): void {
    const id: number = parseInt(
      this.route.snapshot.paramMap.get('id') as string
    );
    this.questionsService.questions[id];
  }

  nextQuestion(): void {
    const id: number = parseInt(
      this.route.snapshot.paramMap.get('id') as string
    );
    this.router.navigate([`questions/${id + 1}`]);
  }
}
