import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  constructor( public auth: AuthService ) { }

  ngOnInit() {
  }

  onSignup(form: NgForm) {
   this.auth.onNewSignup(form.value.email, form.value.password);
  }

}
