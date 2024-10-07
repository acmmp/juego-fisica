import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { GameComponent } from './app/game.component';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <h1>Juego de Física</h1>
    <app-game></app-game>
  `,
  imports: [GameComponent]
})
export class App {}

bootstrapApplication(App);