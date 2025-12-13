import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  setToken(rememberMe: boolean, token: string) {
    if (rememberMe)
      localStorage.setItem('token', token);
    else
      sessionStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  }

  // getUser(): any {
  //   const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
  //   return userStr ? JSON.parse(userStr) : null;
  // }

  isLoggedIn(): boolean {
    console.log("get tk:" + this.getToken())
    console.log("get tk u:" + !!this.getToken())
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
  }
}
