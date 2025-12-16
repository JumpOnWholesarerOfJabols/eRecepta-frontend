import { Injectable } from '@angular/core';
import { Role } from '../../../models/UserData';
import { jwtDecode } from 'jwt-decode';

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



  getUserRole(): Role | null {
  const token = this.getToken();
  if (!token) return null;
  
  try {
    const decoded: any = jwtDecode(token);
    return decoded.role || null;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}

  getUserId(): string | null {
  const token = this.getToken();
  if (!token) return null;
  
  try {
    const decoded: any = jwtDecode(token);
    return decoded.sub || decoded.id || null;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}
}
