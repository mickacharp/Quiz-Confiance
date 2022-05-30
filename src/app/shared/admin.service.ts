import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import firebase from 'firebase/compat';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  adminData: Observable<firebase.User | null>;

  constructor(
    private afAuth: AngularFireAuth,
    private messageService: MessageService,
    private router: Router
  ) {
    this.adminData = afAuth.authState;
  }

  /* Admin Access */
  signIn(email: string, password: string) {
    this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Bonjour Thierry',
          detail: `Vous êtes bien connecté en tant qu'administrateur`,
        });
        this.router.navigate(['/admin']);
      })
      .catch(() => {
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

  async signOut() {
    await this.afAuth.signOut();
    this.router.navigate(['/']);
    this.messageService.add({
      severity: 'success',
      summary: 'Déconnexion',
      detail: `Vous êtes bien déconnecté. À bientôt !`,
      icon: 'pi-moon',
    });
  }
}
