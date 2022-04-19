import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // needed for PrimeNg p-dialog Modal to work

// AngularFire
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import {
  provideAnalytics,
  getAnalytics,
  ScreenTrackingService,
  UserTrackingService,
} from '@angular/fire/analytics';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideFunctions, getFunctions } from '@angular/fire/functions';
import {
  provideRemoteConfig,
  getRemoteConfig,
} from '@angular/fire/remote-config';
import { provideStorage, getStorage } from '@angular/fire/storage';

// PrimeNg
import { StepsModule } from 'primeng/steps';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';

// Components
import { AppComponent } from './app.component';
import { QuestionsService } from './shared/questions.service';
import { QuestionComponent } from './question/question.component';
import { QuizComponent } from './quiz/quiz.component';
import { ResultsComponent } from './results/results.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    QuestionComponent,
    QuizComponent,
    ResultsComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    StepsModule,
    RadioButtonModule,
    ButtonModule,
    BrowserAnimationsModule, // needed for PrimeNg p-dialog Modal to work
    DialogModule,
    InputTextModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    // provideDatabase(() => getDatabase()),
    // provideMessaging(() => getMessaging()),
    // providePerformance(() => getPerformance()),
    // provideFirebaseApp(() => initializeApp(environment.firebase)),
    // provideAnalytics(() => getAnalytics()),
    // provideAuth(() => getAuth()),
    // provideFirestore(() => getFirestore()),
    // provideFunctions(() => getFunctions()),
    // provideRemoteConfig(() => getRemoteConfig()),
    // provideStorage(() => getStorage()),
  ],
  providers: [ScreenTrackingService, UserTrackingService, QuestionsService],
  bootstrap: [AppComponent],
})
export class AppModule {}
