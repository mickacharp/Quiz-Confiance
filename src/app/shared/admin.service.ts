import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(
    private afAuth: AngularFireAuth,
    private messageService: MessageService,
    private router: Router
  ) {}

  /* Admin Access */
  signIn(email: string, password: string) {
    this.afAuth
      .signInWithEmailAndPassword(email, password)
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
  }

  signUp(email: string, password: string) {
    this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((res) => {
        console.log('Successfully signed up!', res);
      })
      .catch((err) => {
        console.log('Something is wrong: ', err.message);
      });
  }
}
