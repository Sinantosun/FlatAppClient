import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SidebarService } from '../../app/services/sidebar.service';
import { GenericService } from '../../Services/generic.service';
import { ModalService } from '../../app/services/modal.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
  isCollapsed = false;
  isNewMenuOpen = false;
  profilePhoto: string = "https://testprojectwebapi.sinantosun.com/Images/userprofilephoto.png";
  nameSurname: string = "";


  constructor(private sidebarService: SidebarService, private service: GenericService, private modalService: ModalService) { }



  ngOnInit() {
    this.sidebarService.collapsed$.subscribe(state => {
      this.isCollapsed = state;
      this.isNewMenuOpen = false;
    });

    this.LoadUserInfo();
  }
  toggleNewMenu() {
    this.isNewMenuOpen = !this.isNewMenuOpen;
  }
  toggleMouseLeave() {
    if (this.isCollapsed) {
      this.toggleNewMenu();
      this.isNewMenuOpen = false;
    }
  }


  LoadUserInfo() {
    this.service.Get("Users/GetUserInfoByUserName").subscribe({
      next: (data: any) => {
        this.nameSurname = data.nameSurname;
      }
    })
  }

  openModal() {
    this.isCollapsed = false;
    this.isNewMenuOpen =false;
    this.modalService.open();
  }

  closeModal() {
    this.modalService.close();
  }




}
