import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  legituser = false;
  username: any;

  constructor( public authService: AuthService  ) { }

  ngOnInit() {
    this.legituser = this.authService.getAuthStatus();
    this.authService.getAuthstatusListener().subscribe(( userinfo ) => {
        this.legituser = userinfo;
    });
    this.authService.getusernameListener().subscribe((username) => {
      this.username = username;
    });
  }

  onLogout() {
    this.authService.logout();
    this.username = '';
  }

}
