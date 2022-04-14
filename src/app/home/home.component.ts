import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  displayModal: boolean = false;
  userEmail: string = '';

  showModalDialog(): void {
    this.displayModal = true;
  }
  constructor() {}

  ngOnInit(): void {}

  getTestsOfUser(): void {}
}
