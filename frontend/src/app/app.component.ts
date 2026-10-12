import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root', // Matches <app-root> in index.html
  standalone: true, //It doesn't need to be declared inside an NgModule
  imports: [RouterOutlet], //RouterOutlet = where child routes render
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  ngOnInit() {
    const theme = localStorage.getItem('theme') === 'dark' ? 'dark' : 'light';
    document.body.classList.toggle('dark-theme', theme === 'dark');
  }
}
