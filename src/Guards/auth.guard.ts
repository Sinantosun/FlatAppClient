import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiDefaults } from '../Tools/projectenviorment';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private http: HttpClient, private router: Router) { }
  baseUrl = ApiDefaults.apiUrl;
  canActivate(): Observable<boolean> {
    //https://localhost:7061/api/Users/Check
    //https://testprojectwebapi.sinantosun.com/api/Users/Check
    return this.http.get<boolean>("https://testprojectwebapi.sinantosun.com/api/Users/Check", { withCredentials: true })
      .pipe(
        map(isAuth => {
          return isAuth;
        }),
        catchError(() => {
          this.router.navigate(['/login']);
          return of(false);
        })
      );
  }

}
