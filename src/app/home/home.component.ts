import { Component, OnInit } from '@angular/core';
import { Test } from '../models/test.model';
import { User } from '../models/user.model';
import { QuestionsService } from '../shared/questions.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  displayModal: boolean = false;
  userEmail: string = '';
  user: User = new User('', '', '', []);
  userTests: Test[] = [];

  showModalDialog(): void {
    this.displayModal = true;
  }

  constructor(private questionsService: QuestionsService) {}

  ngOnInit(): void {}

  getUserAndHisTests(): void {
    this.questionsService
      .getUserByEmail(this.userEmail)
      .subscribe((userFound) => {
        this.user = userFound[0];
        this.getUserTests();
      });
  }

  getUserTests(): void {
    if (this.user.tests && this.user.tests.length > 0) {
      this.user.tests.forEach((testKey) => {
        this.questionsService.getTestsOfUser(testKey).subscribe((test) => {
          this.userTests.push(test);
        });
      });
    }
  }
}
