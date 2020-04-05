import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, Subject, BehaviorSubject } from 'rxjs';
import { User } from './user.model';

export interface AuthResponseData {
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
};

@Injectable({ providedIn: 'root' })
export class AuthService {
    //Same as subject, but can be used to get last emitted value without even subscribing.
    user = new BehaviorSubject<User>(null);

    token: string = null;
    constructor(private http: HttpClient) { }

    //Sign Up URL
    //Template : https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]
    //Actual : https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyD_pxwEL_BK3GBldh4hC4gNQT5Ugf-LLJM

    //Sign In URL
    //Template : https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]
    //Actual : https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyD_pxwEL_BK3GBldh4hC4gNQT5Ugf-LLJM


    signup(email: string, password: string) {

        return this.http
            .post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyD_pxwEL_BK3GBldh4hC4gNQT5Ugf-LLJM',
                {
                    email: email,
                    password: password,
                    returnSecureToken: true
                })
            .pipe(catchError(err => { return this.handleError(err) }), tap(resData => {
                this.handleAuthentication(resData.email,
                    resData.localId,
                    resData.idToken,
                    +resData.expiresIn);
            }));
    }

    login(email: string, password: string) {
        return this.http
            .post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyD_pxwEL_BK3GBldh4hC4gNQT5Ugf-LLJM',
                {
                    email: email,
                    password: password,
                    returnSecureToken: true
                }
            )
            .pipe(catchError(err => { return this.handleError(err) }), tap(resData => {
                this.handleAuthentication(resData.email,
                    resData.localId,
                    resData.idToken,
                    +resData.expiresIn);
            }));

    }

    private handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {

        const expirationDate = new Date(new Date().getTime() + (expiresIn * 1000));
        const user = new User(email,
            userId,
            token,
            expirationDate);

        this.token = token;
        this.user.next(user);
    }

    private handleError(err: HttpErrorResponse) {

        let errorMsg = 'An unknown error occurred.';

        if (!err.error || !err.error.error) {
            return throwError(errorMsg);
        }
        switch (err.error.error.message) {
            case 'EMAIL_EXISTS':
                errorMsg = 'Email already exists !!!';
                break;
            case 'INVALID_PASSWORD':
                errorMsg = 'Invalid password !!!';
                break;
            case 'EMAIL_NOT_FOUND':
                errorMsg = 'Email ID does not exist !!! Please sign up.';
                break;
        }

        return throwError(errorMsg);
    }
}
