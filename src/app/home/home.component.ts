import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { Test } from '../models/test.model';
import { User } from '../models/user.model';
import { QuestionsService } from '../shared/questions.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  displayModal: boolean = false;
  displayAdminModal: boolean = false;
  homeModalVisible: boolean = true;

  allUsersList: User[] = [];
  user: User = new User('', '', []);
  userTests: Test[] = [];
  userEmail: string = '';
  filteredEmails: string[] = [];

  adminEmail: string = '';
  adminPassword: string = '';

  constructor(
    private questionsService: QuestionsService,
    private router: Router,
    private afAuth: AngularFireAuth,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.questionsService.getAllUsers().subscribe((users) => {
      this.allUsersList = users;
    });
  }

  hideHomeModal(): void {
    this.homeModalVisible = false;
  }

  showModalDialog(): void {
    this.displayModal = true;
  }

  showAdminModalDialog(): void {
    this.displayAdminModal = true;
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

  clearStorage(): void {
    localStorage.clear();
    sessionStorage.clear();
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
    this.userTests = [];
    if (this.user.tests && this.user.tests.length > 0) {
      this.user.tests.forEach((testKey) => {
        this.questionsService.getTestsOfUser(testKey).subscribe((test) => {
          this.userTests.push(test);
        });
      });
    }
  }

  goToSelectedTest(index: number): void {
    this.clearStorage();
    // setting answers in localStorage
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
    // setting xCoordinate in localStorage
    const xCoordinateOfSelectedTest = this.userTests[index].xCoordinate;
    localStorage.setItem(
      'xCoordinate',
      JSON.stringify(xCoordinateOfSelectedTest)
    );
    // setting yCoordinate in localStorage
    const yCoordinateOfSelectedTest = this.userTests[index].yCoordinate;
    localStorage.setItem(
      'yCoordinate',
      JSON.stringify(yCoordinateOfSelectedTest)
    );
    // setting a property in sessionStorage which will be verified at the results page:
    // if user consults a previous test, button to save test in db "Sauvegarder mon questionnaire" will not show
    // if it's a brand new test, button will show (cf ResultsComponent)
    sessionStorage.setItem('canSaveTest', 'false');
    this.router.navigate(['/results']);
  }

  /* Admin Access */
  signIn() {
    this.afAuth
      .signInWithEmailAndPassword(this.adminEmail, this.adminPassword)
      .then((res) => {
        console.log('Successfully signed in!', res);
        this.messageService.add({
          severity: 'success',
          summary: 'Bonjour Thierry',
          detail: `Vous êtes bien connecté en tant qu'administrateur`,
        });
        this.router.navigate(['/admin']);
      })
      .catch((err) => {
        console.log('Something is wrong: ', err.message);
        this.messageService.add({
          severity: 'error',
          summary: 'Mauvaise saisie',
          detail: `Vérifiez que votre email et/ou votre mot de passe sont corrects`,
        });
      });
    this.adminEmail = '';
    this.adminPassword = '';
  }

  signUp() {
    this.afAuth
      .createUserWithEmailAndPassword(this.adminEmail, this.adminPassword)
      .then((res) => {
        console.log('Successfully signed up!', res);
      })
      .catch((err) => {
        console.log('Something is wrong: ', err.message);
      });
  }
}
