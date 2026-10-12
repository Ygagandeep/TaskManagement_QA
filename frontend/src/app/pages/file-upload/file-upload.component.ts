import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FileService } from '../../core/services/file.service';
import { ProjectService } from '../../core/services/project.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {
  @ViewChild('fileInput') fileInput?: ElementRef<HTMLInputElement>;
  files: any[] = [];
  projects: any[] = [];
  search = '';
  type = 'all';
  project = '';
  message = '';
  error = '';
  loading = false;
  dragging = false;
  constructor(private fileService: FileService, private projectService: ProjectService, private cdr: ChangeDetectorRef) {}
  get images() { return this.files.filter((f) => f.fileType?.startsWith('image')).length; }
  get documents() { return this.files.filter((f) => !f.fileType?.startsWith('image')).length; }
  get storage() { return this.pretty(this.files.reduce((sum, f) => sum + (f.fileSize || 0), 0)); }
  ngOnInit() {
    this.load();
    this.projectService.list().subscribe((res) => {
      this.projects = Array.isArray(res) ? res : [];
      this.cdr.detectChanges();
    });
  }
  load() {
    this.loading = true;
    this.error = '';
    this.fileService.list(this.search, this.type).subscribe({
      next: (res) => {
        this.files = Array.isArray(res) ? res : [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err.error?.message || 'Unable to load files.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
  clear() { this.search = ''; this.type = 'all'; this.load(); }
  select(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.upload(file);
    if (this.fileInput?.nativeElement) this.fileInput.nativeElement.value = '';
  }
  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.dragging = true;
  }
  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.dragging = false;
  }
  onDrop(event: DragEvent) {
    event.preventDefault();
    this.dragging = false;
    const file = event.dataTransfer?.files?.[0];
    if (file) this.upload(file);
  }
  upload(file: File) {
    this.error = '';
    this.message = '';
    const data = new FormData();
    data.append('file', file);
    if (this.project) data.append('project', this.project);
    this.fileService.upload(data).subscribe({
      next: () => {
        this.message = 'File uploaded successfully';
        this.load();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err.error?.message || 'File upload failed. Maximum file size is 10 MB.';
        this.cdr.detectChanges();
      }
    });
  }
  remove(id: string) { if (confirm('Delete this file?')) this.fileService.delete(id).subscribe(() => this.load()); }
  fileLabel(type: string) {
    if (!type) return 'Unknown';
    if (type.startsWith('image')) return 'Image';
    if (type.includes('pdf')) return 'PDF';
    if (type.includes('word') || type.includes('document')) return 'Document';
    return type;
  }
  pretty(size: number) { return size < 1024 ? `${size} Bytes` : size < 1048576 ? `${(size / 1024).toFixed(1)} KB` : `${(size / 1048576).toFixed(1)} MB`; }
}
