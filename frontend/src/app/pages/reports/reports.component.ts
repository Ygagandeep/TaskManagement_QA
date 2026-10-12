import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart } from 'chart.js/auto';
import { ReportService } from '../../core/services/report.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit, AfterViewInit {
  data: any = {};
  charts: Chart[] = [];
  constructor(private reportService: ReportService) {}
  ngOnInit() { this.load(); }
  ngAfterViewInit() { this.draw(); }
  load() { this.reportService.dashboard().subscribe((res) => { this.data = res; setTimeout(() => this.draw()); }); }
  draw() {
    this.charts.forEach((chart) => chart.destroy());
    this.charts = [];
    this.makePie('statusChart', this.data.taskStatus || [], ['#f59e0b', '#2563eb', '#16a34a']);
    this.makePie('projectChart', this.data.projectProgress || [], ['#64748b', '#2563eb', '#16a34a']);
    this.makePie('priorityChart', this.data.priorityDistribution || [], ['#16a34a', '#f59e0b', '#dc2626']);
    this.makeBar('workloadChart', this.data.employeeWorkload || []);
  }
  makePie(id: string, rows: any[], colors: string[]) {
    const canvas = document.getElementById(id) as HTMLCanvasElement | null;
    if (canvas) this.charts.push(new Chart(canvas, { type: 'doughnut', data: { labels: rows.map((x) => x._id), datasets: [{ data: rows.map((x) => x.count), backgroundColor: colors }] } }));
  }
  makeBar(id: string, rows: any[]) {
    const canvas = document.getElementById(id) as HTMLCanvasElement | null;
    if (canvas) this.charts.push(new Chart(canvas, { type: 'bar', data: { labels: rows.map((x) => x.name), datasets: [{ label: 'Tasks', data: rows.map((x) => x.count), backgroundColor: '#0f766e' }] } }));
  }
}
