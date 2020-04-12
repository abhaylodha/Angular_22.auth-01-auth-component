import { Component, OnInit, OnDestroy } from '@angular/core';

import { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { User } from '../auth/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  isAuthenticated = false;
  constructor(private dataStorageService: DataStorageService,
    private authSvc: AuthService) { }

  onSaveData() {
    this.dataStorageService.storeRecipes();
  }

  onFetchData() {
    this.dataStorageService.fetchRecipes().subscribe();
  }

  onLogout() {
    this.authSvc.logout();
  }

  ngOnInit() {
    this.subscription = this.authSvc.user.subscribe(user => {
      //this.isAuthenticated = user ? false : true;
      //OR
      this.isAuthenticated = !!user;
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
