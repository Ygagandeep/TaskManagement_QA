import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { Chart } from 'chart.js/auto';
import { ReportService } from '../../core/services/report.service';
import { filter } from 'rxjs';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  data: any = {};
  error = '';
  weeklyChart?: Chart;
  taskStatusChart?: Chart;
  projectProgressChart?: Chart;
  constructor(private reports: ReportService, private cdr: ChangeDetectorRef, private router: Router) {}
  ngOnInit() {
    this.load();
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      if (this.router.url.startsWith('/dashboard')) this.load();
    });
  }
  ngAfterViewInit() { this.draw(); }
  get taskStatusRows() {
    return this.rowsWithDefaults(['Pending', 'In Progress', 'Completed'], this.data.taskStatus || []);
  }
  get projectProgressRows() {
    return this.rowsWithDefaults(['Not Started', 'In Progress', 'Completed'], this.data.projectProgress || []);
  }
  get taskStatusTotal() {
    return this.taskStatusRows.reduce((total, item) => total + item.count, 0);
  }
  get projectProgressTotal() {
    return this.projectProgressRows.reduce((total, item) => total + item.count, 0);
  }
  get weeklyCompletedValues() {
    const rows = this.data.weeklyCompletedTasks || [];
    return [1, 2, 3, 4, 5, 6, 7].map((day) => rows.find((item: any) => Number(item._id) === day)?.count || 0);
  }
  get hasWeeklyCompletedData() {
    return this.weeklyCompletedValues.some((count) => count > 0);
  }
  load() {
    this.error = '';
    this.reports.dashboard().subscribe({
      next: (res) => {
        this.data = res || {};
        this.cdr.detectChanges();
        setTimeout(() => this.draw());
      },
      error: (err) => {
        this.error = err.error?.message || 'Unable to load dashboard data. Please login again.';
        this.cdr.detectChanges();
      }
    });
  }
  rowsWithDefaults(labels: string[], rows: any[]) {
    return labels.map((label) => ({ _id: label, count: rows.find((row) => row._id === label)?.count || 0 }));
  }
  draw() {
    this.drawSummaryChart('taskStatusChart', this.taskStatusChart, this.taskStatusRows, ['#f59e0b', '#2563eb', '#16a34a'], (chart) => this.taskStatusChart = chart);
    this.drawSummaryChart('projectProgressChart', this.projectProgressChart, this.projectProgressRows, ['#64748b', '#2563eb', '#16a34a'], (chart) => this.projectProgressChart = chart);

    const canvas = document.getElementById('weeklyChart') as HTMLCanvasElement | null;
    if (!canvas) return;
    this.weeklyChart?.destroy();
    const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const values = this.weeklyCompletedValues;
    const maxValue = Math.max(...values, 1);
    this.weeklyChart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Completed Tasks',
          data: values,
          backgroundColor: '#2563eb',
          borderRadius: 8,
          maxBarThickness: 58
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true, labels: { boxWidth: 14, usePointStyle: true } },
          tooltip: { callbacks: { label: (context) => `Completed: ${context.parsed.y}` } }
        },
        scales: {
          x: { grid: { display: false } },
          y: {
            beginAtZero: true,
            suggestedMax: maxValue < 5 ? 5 : maxValue + 1,
            ticks: { precision: 0, stepSize: 1 }
          }
        }
      }
    });
  }
  drawSummaryChart(id: string, currentChart: Chart | undefined, rows: any[], colors: string[], assign: (chart: Chart) => void) {
    const canvas = document.getElementById(id) as HTMLCanvasElement | null;
    if (!canvas) return;
    currentChart?.destroy();
    const values = rows.map((row) => row.count);
    const hasData = values.some((value) => value > 0);
    assign(new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: rows.map((row) => row._id),
        datasets: [{
          data: hasData ? values : [1],
          backgroundColor: hasData ? colors : ['#e2e8f0'],
          borderColor: '#ffffff',
          borderWidth: 4,
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '68%',
        plugins: {
          legend: { display: false },
          tooltip: {
            enabled: hasData,
            callbacks: { label: (context) => `${context.label}: ${context.parsed}` }
          }
        }
      }
    }));
  }
  statusClass(status: string) { return status?.toLowerCase().replaceAll(' ', '-'); }
}
