import { Component, inject } from '@angular/core';
import { LoadingService } from './shared/loading.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'CandidateAdminPanel';
  public loading = inject(LoadingService);
  ngOnInit() {
    const el = document.getElementById("global-loader");
    if(el){
      el.style.transition = "opacity 0.6s ease"; 
      el.style.opacity = "0";
      setTimeout(() => {
        el.style.display = "none";
      }, 600);  
    }
  }
  
}
