import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PreviousRouteService } from './services/previous-route.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`
})
export class AppComponent implements OnInit {
  previousRouteService = inject(PreviousRouteService);

  ngOnInit() {
    this.previousRouteService.initialize();
  }
}
