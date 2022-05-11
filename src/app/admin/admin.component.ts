import { Component, OnInit } from '@angular/core';
import { AdminService } from '../shared/admin.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  constructor(private adminService: AdminService) {}

  ngOnInit(): void {}

  signOut() {
    this.adminService.signOut();
  }
}
