import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {
  @Input() message: string;
  @Output() close = new EventEmitter<void>();
  constructor(private authService: AuthService) { }
  
  ngOnInit(): void {
  }

  onClose() {
    this.close.emit();
  }

}
