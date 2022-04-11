import { Component, OnInit } from '@angular/core';
import { QuestionsService } from '../shared/questions.service';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss'],
})
export class QuestionsComponent implements OnInit {
  xPosition: number = 0;
  yPosition: number = 0;

  constructor(private questionsService: QuestionsService) {}

  ngOnInit(): void {
    this.xPosition = this.questionsService.calculateXPosition();
    this.yPosition = this.questionsService.calculateYPosition();
  }
}
