import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { tap, map, take } from 'rxjs/operators';
import { AdminService } from './shared/admin.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(
    private adminService: AdminService,
    private router: Router,
    private messageService: MessageService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.adminService.adminData.pipe(
      take(1),
      map((user) => !!user), // <-- map to boolean
      tap((loggedIn) => {
        if (!loggedIn) {
          console.log('access denied');
          this.router.navigate(['/']);
          this.messageService.add({
            severity: 'error',
            summary: 'Accès interdit',
            detail: `Vous devez être connecté en tant qu'administrateur pour accéder à cette page.`,
          });
        }
      })
    );
  }
}
