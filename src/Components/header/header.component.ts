import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../../app/services/sidebar.service';
import { GenericService } from '../../Services/generic.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  guid: string = "";

  constructor(private sidebarService: SidebarService, private service: GenericService) { }
  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }

  ngOnInit(): void {
    this.LoadUserGuidId();
  }

  LoadUserGuidId() {
    this.service.Get("Users/GetUserGuidIdByUserName").subscribe({
      next: (data: any) => {
   
        this.guid = data.userGuidId;
      }
    })
  }


}
