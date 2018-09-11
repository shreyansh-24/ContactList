import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string;
  private tokenTimer: any;
  private username;
  private authStatusListener = new Subject<boolean>();
  private usernameListener = new Subject();
  private legituser = false;
  constructor( private http: HttpClient, private router: Router ) {}



  onNewSignup(email: string, password: string) {
    const user: any = {email: email, password: password};
    this.http.post<{message: string}>('http://localhost:3000/api/signup', user )
    .subscribe((responseMessage) => {
      console.log(responseMessage.message);
    });
  }

  login(email: string, password: string) {
    const authData = { email: email, password: password };
    this.http.post<{token: string, message: string, email: string, expiresIn: number}>('http://localhost:3000/api/login', authData)
      .subscribe((response) => {
        console.log(response.message);
        const token = response.token;
        this.token = token;
        const username = response.email;
        if (token) {
        const expiresInDuration =  response.expiresIn;
        console.log(expiresInDuration);
        this.setAuthTimer(expiresInDuration);
        this.legituser = true;
        this.authStatusListener.next(true);
        const now = new Date();
        const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
        this.saveAuthData(token, expirationDate, username);
        this.username = username;
        this.usernameListener.next(this.username);
        this.router.navigate(['/']);
        }
      });

  }

  autoAuthonReload() {
   const AuthInfo =  this.getAuthData();
   if (!AuthInfo) {
     return;
   }
   const now = new Date();
   const expiresIn = AuthInfo.expirationDate.getTime() - now.getTime();
   if (expiresIn > 0  ) {
     this.token = AuthInfo.token;
     this.legituser = true;
     this.authStatusListener.next(true);
     this.usernameListener.next(this.username);
     this.setAuthTimer(expiresIn / 1000); // setAuthTimer works in milliseconds
   }
  }

  logout() {
    this.token = null;
    this.legituser = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.deleteAuthData();
    this.router.navigate(['/']);
  }

  getToken() {
    return this.token;
  }

  getAuthstatusListener() {
    return this.authStatusListener.asObservable();
  }

  getusernameListener() {
    return this.usernameListener.asObservable();
  }

  getAuthStatus() {
    return this.legituser;
  }

  private saveAuthData(token: string, expirationDate: Date, username: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('username', username);
  }

  private deleteAuthData() {
    localStorage.removeItem('token');
  }

  private getAuthData() {
    const token  = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    if (!token && !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate)
    };
  }

  private setAuthTimer(duration: number) {
    console.log('Setting Timer' + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

}
