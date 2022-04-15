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
  userTests: Test[] = [new Test([])];

  showModalDialog(): void {
    this.displayModal = true;
  }
  constructor(private questionsService: QuestionsService) {}

  ngOnInit(): void {}

  // getTestsOfUser(): void {
  //   for (let i = 0; i < this.user.tests.length; i++)
  //   {
  //     this.questionsService
  //     .getTestsOfUser(this.user.tests[i]).then(test => this.userTests.push(test))
  //    }
  // }

  getUserByEmail(): void {
    this.questionsService
      .getUserByEmail(this.userEmail)
      .subscribe((userFound) => (this.user = userFound[0]));
    setTimeout(() => {
      console.log(this.user);
    }, 2000);
  }
}
