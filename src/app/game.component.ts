import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import * as Matter from 'matter-js';

@Component({
  selector: 'app-game',
  standalone: true,
  template: `
    <div>
      <canvas #gameCanvas></canvas>
    </div>
    <div>
      <button (click)="addCircle()">Añadir Círculo</button>
      <button (click)="addRectangle()">Añadir Rectángulo</button>
    </div>
  `,
  styles: [`
    canvas {
      border: 1px solid black;
    }
  `]
})
export class GameComponent implements OnInit, AfterViewInit {
  @ViewChild('gameCanvas', { static: true }) gameCanvas!: ElementRef<HTMLCanvasElement>;

  private engine!: Matter.Engine;
  private render!: Matter.Render;
  private world!: Matter.World;

  ngOnInit() {
    this.engine = Matter.Engine.create();
    this.world = this.engine.world;
  }

  ngAfterViewInit() {
    const canvas = this.gameCanvas.nativeElement;
    this.render = Matter.Render.create({
      canvas: canvas,
      engine: this.engine,
      options: {
        width: 800,
        height: 600,
        wireframes: false
      }
    });

    Matter.Render.run(this.render);

    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, this.engine);

    this.createBoundaries();

    Matter.Events.on(this.engine, 'afterUpdate', () => {
      this.checkBounds();
    });

    this.setupMouseConstraint();
  }

  private createBoundaries() {
    const ground = Matter.Bodies.rectangle(400, 610, 810, 60, { isStatic: true });
    const leftWall = Matter.Bodies.rectangle(-10, 300, 60, 600, { isStatic: true });
    const rightWall = Matter.Bodies.rectangle(810, 300, 60, 600, { isStatic: true });
    const ceiling = Matter.Bodies.rectangle(400, -10, 810, 60, { isStatic: true });

    Matter.Composite.add(this.world, [ground, leftWall, rightWall, ceiling]);
  }

  private setupMouseConstraint() {
    const mouse = Matter.Mouse.create(this.render.canvas);
    const mouseConstraint = Matter.MouseConstraint.create(this.engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false
        }
      }
    });

    Matter.Composite.add(this.world, mouseConstraint);
    this.render.mouse = mouse;
  }

  addCircle() {
    const circle = Matter.Bodies.circle(
      Math.random() * 700 + 50,
      50,
      Math.random() * 20 + 10,
      {
        restitution: 0.5,
        friction: 0.1,
        render: {
          fillStyle: this.getRandomColor()
        }
      }
    );
    Matter.Composite.add(this.world, circle);
  }

  addRectangle() {
    const rectangle = Matter.Bodies.rectangle(
      Math.random() * 700 + 50,
      50,
      Math.random() * 50 + 20,
      Math.random() * 50 + 20,
      {
        restitution: 0.5,
        friction: 0.1,
        render: {
          fillStyle: this.getRandomColor()
        }
      }
    );
    Matter.Composite.add(this.world, rectangle);
  }

  private getRandomColor(): string {
    return '#' + Math.floor(Math.random()*16777215).toString(16);
  }

  private checkBounds() {
    const bodies = Matter.Composite.allBodies(this.world);
    for (let body of bodies) {
      if (body.position.y > 800) {
        Matter.Composite.remove(this.world, body);
      }
    }
  }
}