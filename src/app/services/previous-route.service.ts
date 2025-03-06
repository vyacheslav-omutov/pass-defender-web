import { inject, Injectable } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';
import { filter, pairwise } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PreviousRouteService {
  private previousUrl: string = '/';

  router = inject(Router)

  initialize() {
    this.router.events
      .pipe(filter((evt: any) => evt instanceof RoutesRecognized), pairwise())
      .subscribe((events: RoutesRecognized[]) => {
        this.previousUrl = events[0].urlAfterRedirects;
      });
  }

  getPreviousUrl(): string {
    return this.previousUrl;
  }
}
