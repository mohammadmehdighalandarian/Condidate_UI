import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuService } from 'src/app/shared/menu.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent {
  menuList = []
  cardRows = []
  constructor(private router: Router,private menuService: MenuService) {}
  ngOnInit(): void {
    this.menuService
          .getMenuList()
          .then((result: any) => {
            this.menuList = result.data.filter(x=>x.isShownInMainPage);
            for (let i = 0; i < this.menuList.length/3; i++) {
              let x = []
              for(let j = 0 ; j < 3; j++){
                if(i*3 + j < this.menuList.length)
                  x.push(this.menuList[i*3 + j]);
              }
              this.cardRows.push(x);
            } 
          }).catch((error)=>{});
  }
  navigateTo(menuUrl) {
    this.router.navigate(['/' + menuUrl]);
  }
}
