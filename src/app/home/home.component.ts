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
  user: User = new User('', '', '', []);
  userTests: Test[] = [];
  allUsersList: User[] = [];

  showModalDialog(): void {
    this.displayModal = true;
  }

  userEmail: string = '';
  emails: string[] = [];
  filteredEmails: string[] = [];

  filterEmail(event: any) {
    //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
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

  constructor(private questionsService: QuestionsService) {}

  ngOnInit(): void {
    this.questionsService.getAllUsers().subscribe((users) => {
      this.allUsersList = users;
    });
  }

  getUserAndHisTests(): void {
    this.questionsService
      .getUserByEmail(this.userEmail)
      .subscribe((userFound) => {
        this.user = userFound[0];
        this.getUserTests();
        console.log(this.userTests);
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
