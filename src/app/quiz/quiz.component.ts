import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Question } from '../models/question.model';
import { QuestionsService } from '../shared/questions.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss'],
})
export class QuizComponent implements OnInit {
  stepItems: MenuItem[] = [];
  questions: Question[] = [];

  constructor(private questionsService: QuestionsService) {}

  ngOnInit(): void {
    this.questions = this.questionsService.questions;
    this.generateStepItems();
  }

  generateStepItems(): void {
    for (let i: number = 0; i < this.questions.length; i++) {
      this.stepItems.push({
        label: `Q${this.questions[i].nb}`,
        routerLink: `questions/${this.questions[i].nb}`,
      });
    }
  }
}
