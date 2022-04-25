import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
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

  allUsersList: User[] = [];
  user: User = new User('', []);
  userTests: Test[] = [];
  userEmail: string = '';
  filteredEmails: string[] = [];

  constructor(private questionsService: QuestionsService) {}

  ngOnInit(): void {
    this.questionsService.getAllUsers().subscribe((users) => {
      this.allUsersList = users;
    });
  }

  showModalDialog(): void {
    this.displayModal = true;
  }

  filterEmail(event: any) {
    let filtered: string[] = [];
    let query = event.query;

    for (let i = 0; i < this.allUsersList.length; i++) {
      let email = this.allUsersList[i].email;
      if (email.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(email);
      }
    }

    this.filteredEmails = filtered;
  }

  clearLocalStorage(): void {
    localStorage.clear();
  }

  getUserAndHisTests(): void {
    this.questionsService
      .getUserByEmail(this.userEmail)
      .pipe(take(1))
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

  goToSelectedTest(index: number): void {
    this.clearLocalStorage();
    const answersOfSelectedTest = this.userTests[index].answers;
    for (let i = 0; i < answersOfSelectedTest.length; i++) {
      // values can be null in answers array because of the results Coordinates when saving a test so we specify "!= null"
      if (answersOfSelectedTest[i] != null) {
        localStorage.setItem(
          JSON.stringify(answersOfSelectedTest[i].questionNb),
          JSON.stringify(answersOfSelectedTest[i].answer)
        );
      }
    }
  }
}
