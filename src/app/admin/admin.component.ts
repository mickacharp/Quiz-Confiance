import { Component, OnInit } from '@angular/core';
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
    private questionsService: QuestionsService
  ) {}

  ngOnInit(): void {
    this.questionsService.getAllUsers().subscribe((users) => {
      this.usersList = users;
    });
  }

  signOut() {
    this.adminService.signOut();
  }
}
