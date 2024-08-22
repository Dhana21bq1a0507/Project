import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor() { }
  saveUserSession(userData: any) {
    sessionStorage.setItem('user', JSON.stringify(userData));
  }
  getUserSession() {
    return JSON.parse(sessionStorage.getItem('user') || '{}');
  }
  clearUserSession() {
    sessionStorage.removeItem('user');
  }
  isLoggedIn() {
    return sessionStorage.getItem('user') !== null;
  }
}
