import { Component ,OnInit} from '@angular/core';
import { MenuService } from 'src/app/shared/menu.service';

@Component({
  selector: 'app-main-side-menu',
  templateUrl: './main-side-menu.component.html',
  styleUrls: ['./main-side-menu.component.css']
})
export class MainSideMenuComponent implements OnInit {
  constructor(private menuService: MenuService){}
  menuList = []
  ngOnInit(): void {
    this.menuService
          .getMenuList()
          .then((result: any) => {
            this.menuList = result.data;
          }).catch((error)=>{});
  }
}
