import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor( public auth: AuthService ) { }

  ngOnInit() {
  }

  onLogin(form: NgForm) {
    this.auth.login(form.value.email, form.value.password);
  }

}
