import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { TaskService } from '../../core/services/task.service';
import { ProjectService } from '../../core/services/project.service';
import { EmployeeService } from '../../core/services/employee.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {
  statuses = ['Pending', 'In Progress', 'Completed'];
  tasks: any[] = [];
  projects: any[] = [];
  employees: any[] = [];
  view: 'board' | 'list' = 'board';
  showAdd = false;
  showFilter = false;
  dragged: any = null;
  error = '';
  filters = { search: '', status: 'All', priority: 'All', assignedTo: 'All' };
  form: any = this.blank();

  constructor(private taskService: TaskService, private projectService: ProjectService, private employeeService: EmployeeService, public auth: AuthService, private cdr: ChangeDetectorRef) {}
  ngOnInit() { this.load(); this.loadProjects(); this.employeeService.list().subscribe((r) => this.employees = r); }
  blank() { const today = new Date().toISOString().slice(0, 10); return { taskTitle: '', description: '', project: '', assignedTo: '', assignedDate: today, startDate: today, dueDate: today, priority: 'Medium', status: 'Pending' }; }
  load() {
    this.error = '';
    this.taskService.list(this.filters).subscribe({
      next: (res) => {
        this.tasks = Array.isArray(res) ? res : [];
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err.error?.message || 'Unable to load tasks.';
        this.cdr.detectChanges();
      }
    });
  }
  loadProjects() {
    this.projectService.list().subscribe({
      next: (res) => {
        this.projects = Array.isArray(res) ? res : [];
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err.error?.message || 'Unable to load projects for task management.';
        this.cdr.detectChanges();
      }
    });
  }
  byStatus(status: string) { return this.tasks.filter((task) => task.status === status); }
  projectsByLane(status: string) {
    const map: Record<string, string> = { Pending: 'Not Started', 'In Progress': 'In Progress', Completed: 'Completed' };
    return this.projects.filter((project) => project.status === map[status]);
  }
  create(taskForm?: NgForm) {
    this.error = '';
    if (taskForm?.invalid) {
      this.error = 'Please fill all required task fields.';
      this.cdr.detectChanges();
      return;
    }
    if (!this.form.project || !this.form.assignedTo) {
      this.error = 'Please select project and employee.';
      this.cdr.detectChanges();
      return;
    }
    this.taskService.create(this.form).subscribe({
      next: () => { this.form = this.blank(); this.showAdd = false; this.load(); },
      error: (err) => {
        this.error = this.createErrorMessage(err);
        this.cdr.detectChanges();
      }
    });
  }
  createErrorMessage(err: any) {
    if (err.status === 0) return 'Backend is not running. Please start or restart the Node.js server and try again.';
    return err.error?.message || 'Unable to create task. Please check all required fields.';
  }
  remove(id: string) { if (confirm('Delete this task?')) this.taskService.delete(id).subscribe(() => this.load()); }
  resetFilters() { this.filters = { search: '', status: 'All', priority: 'All', assignedTo: 'All' }; this.load(); this.showFilter = false; }
  drop(status: string) {
    const dragged = this.dragged;
    if (!dragged?.item) return;

    const currentBoardStatus = dragged.type === 'project'
      ? this.projectBoardStatus(dragged.item.status)
      : dragged.item.status;
    if (currentBoardStatus === status) return;

    const rank: Record<string, number> = { Pending: 1, 'In Progress': 2, Completed: 3 };
    const isBackward = rank[status] < rank[currentBoardStatus];
    const reason = isBackward ? prompt('Please type reason for moving this backward') || '' : '';
    if (isBackward && !reason.trim()) return;

    if (dragged.type === 'project') {
      this.projectService.updateStatus(dragged.item._id, { status: this.projectStatusFromLane(status), reason }).subscribe(() => {
        this.loadProjects();
        this.load();
      });
    } else {
      this.taskService.updateStatus(dragged.item._id, { status, reason }).subscribe(() => this.load());
    }
    this.dragged = null;
  }
  statusClass(status: string) { return status?.toLowerCase().replaceAll(' ', '-'); }
  projectStatusClass(status: string) { return status === 'Not Started' ? 'pending' : this.statusClass(status); }
  projectBoardStatus(status: string) {
    return status === 'Not Started' ? 'Pending' : status;
  }
  projectStatusFromLane(status: string) {
    return status === 'Pending' ? 'Not Started' : status;
  }
}
