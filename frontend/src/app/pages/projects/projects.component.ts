import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../core/services/project.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  projects: any[] = [];
  error = '';
  form = { projectName: '', description: '', status: 'In Progress' };
  constructor(private projectService: ProjectService, private cdr: ChangeDetectorRef) {}
  ngOnInit() { this.load(); }
  load() {
    this.error = '';
    this.projectService.list().subscribe({
      next: (res) => {
        this.projects = Array.isArray(res) ? res : [];
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err.error?.message || 'Unable to load projects. Please login again.';
        this.cdr.detectChanges();
      }
    });
  }
  create() {
    this.error = '';
    this.projectService.create(this.form).subscribe({
      next: () => { this.form = { projectName: '', description: '', status: 'In Progress' }; this.load(); },
      error: (err) => this.error = err.error?.message || 'Unable to submit project.'
    });
  }
  remove(id: string) { if (confirm('Delete this project and its tasks?')) this.projectService.delete(id).subscribe(() => this.load()); }
}
