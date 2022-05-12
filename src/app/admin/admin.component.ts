import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from '../models/user.model';
import { AdminService } from '../shared/admin.service';
import { QuestionsService } from '../shared/questions.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  usersList: User[] = [];
  selectedAnswer: any;

  constructor(
    private adminService: AdminService,
    private questionsService: QuestionsService,
    private afs: AngularFirestore
  ) {}

  ngOnInit(): void {
    this.questionsService.getAllUsers().subscribe((users) => {
      this.usersList = users;
    });
  }

  signOut() {
    this.adminService.signOut();
  }

  updateUser(userToUpdate: User): void {
    this.afs
      .collection<User>('users')
      .doc<User>(userToUpdate.uid)
      .update({ isRelanced: userToUpdate.isRelanced });
  }
}
