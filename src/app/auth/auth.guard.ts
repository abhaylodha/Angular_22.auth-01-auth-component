import { AuthService } from './auth.service';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

    constructor(private authSvc: AuthService,
        private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, router: RouterStateSnapshot)
        : boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        return this.authSvc.user
            .pipe(
                take(1),  //Subscribe to take only one value and unsubscribe
                map(
                    user => {
                        if (!!user)
                            return true;
                        else {
                            return this.router.createUrlTree(['/auth']);
                            //false;
                        }
                    }));
    }
}
