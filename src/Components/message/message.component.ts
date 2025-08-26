import { AfterContentChecked, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import * as signalR from '@microsoft/signalr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../Components/sidebar/sidebar.component';
import { HeaderComponent } from '../../Components/header/header.component';
import { GenericService } from '../../Services/generic.service';
import { SignalrService } from '../../Services/signalr.service';
import { SendFirstMessageModel } from '../../Models/send-first-message-model';
import { ConservationModel } from '../../Models/conservation-model';
import { LastConservationModel } from '../../Models/last-conservation-model';
import { ModalService } from '../../app/services/modal.service';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, HeaderComponent, FormsModule, CommonModule],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css'
})
export class MessageComponent implements OnInit {
  @ViewChild('scrollMe') private scrollContainer!: ElementRef;
  @ViewChild('messageContainer') messageContainer!: ElementRef;

  constructor(private service: GenericService, private signalRService: SignalrService, private modalService: ModalService) { }

  isTyping = false;
  loader = false;
  showMessageIcon = false;
  nameSurname: string = "";
  reciverUserId: number = 0;
  conservation: number = 0;
  LastSeenDate: string = "";

  IsOtherUserConservationPageOpen = false;

  coservationStart: boolean = false;
  conservationRequestModel: ConservationModel[] = [];
  lastConservationRequestModel: LastConservationModel[] = [];
  userId: string = "";
  IsActive: boolean = false;
  sendFirstMessageRequestModel: SendFirstMessageModel = {
    message: "",
    reciverId: 0,
    senderId: 0
  };
  reciverNameSurname: string = "";

  message: string = "";

  isModalOpen = true;


  private setFormatDate(): string {
    const now = new Date();
    const formatted = new Intl.DateTimeFormat("tr-TR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(now);

    return formatted;
  }

  ngOnInit(): void {
    this.signalRService.startConnection();
    this.loadHistoryMessages();
    this.signalRService.reciveMessasge();
    this.signalRService.reciveTyping();
    this.signalRService.reciveCancelTyping();
    this.signalRService.reciveConservationStarted();
    this.signalRService.ConservationTestRecive();
    this.signalRService.ReciveReciverLastSeenDate();

    this.signalRService.conservationStatus$.subscribe((data) => {
      this.IsOtherUserConservationPageOpen = data;

      if (data) {
        let item = document.querySelectorAll(".message-delivery-type");
        item.forEach((element, index) => {
          element.classList.add("text-primary");
          element.classList.remove("text-muted");
        });

      }
    })

    this.signalRService.latSeenDate$.subscribe((data) => {
      this.LastSeenDate = data;
    })



    this.signalRService.messageTypeStatus$.subscribe((data) => {
      if (this.coservationStart) {
        this.isTyping = data;
      }
    })

    this.signalRService.message$.subscribe((data) => {
      let formatdate = this.setFormatDate();
      this.conservationRequestModel.push({
        message: data,
        date: formatdate,
        isSender: false,
        messageDeliveryType: 0,
      })
      if (data != "") {
        if (this.messageContainer) {
          this.messageContainer.nativeElement.addEventListener('scroll', () => {
            const el = this.messageContainer.nativeElement;
            const isBottom = el.scrollHeight - el.scrollTop === el.clientHeight;
            if (isBottom) {
              this.showMessageIcon = false
            }
          });
        }
        this.checkScroll();
      }

    })
    this.modalService.isOpen$.subscribe((data) => {
      this.isModalOpen = data;
    })

    setTimeout(() => {
      this.scrollToBottom();
    }, 300);

  }

  loadMessages() {
    this.service.Get("Conservations").subscribe({
      next: (data: any) => {
        this.conservationRequestModel = data;
      }
    })
  }

  checkScroll() {
    if (this.messageContainer) {
      const el = this.messageContainer.nativeElement;
      const isBottom = el.scrollHeight - el.scrollTop === el.clientHeight;
      if (!isBottom) {
        this.showMessageIcon = true;
      }
      else {
        this.showMessageIcon = false;
        setTimeout(() => {
          this.scrollToBottom();
        }, 100);
      }
    }
  }

  UserTyping() {
    if (this.message.length > 0) {
      this.signalRService.Typing(this.reciverUserId);
    }
    else {
      this.signalRService.CancelTyping(this.reciverUserId);
    }
  }



  StartConservation(reciverId: number, conservationId: number, index: number) {
    this.moveToTop(index);

    this.nameSurname = this.lastConservationRequestModel[index].nameSurname;

    this.service.Get(`Conservations/GetConservationByUserIds?reciverId=${reciverId}`).subscribe({
      next: (data: any) => {
        this.signalRService.ConservationStart(reciverId);
        this.coservationStart = true;


        this.conservationRequestModel = data;
        this.loader = false;
        this.conservation = conservationId;
        this.reciverUserId = reciverId;

        setTimeout(() => {
          this.scrollToBottom();
        }, 250);
      }, error: (err) => { this.loader = false }
    })
  }

  private moveToTop(index: number) {
    if (index === 0) return;

    const item = this.lastConservationRequestModel[index];

    const element = document.querySelectorAll('.conversation-item')[index] as HTMLElement;
    element.style.top = '-40px';
    setTimeout(() => {
      element.style.top = '0';

      this.lastConservationRequestModel.splice(index, 1);
      this.lastConservationRequestModel.unshift(item);
    }, 200);
  }


  loadHistoryMessages() {
    this.service.Get("Conservations/GetLastConservations").subscribe({
      next: (data: any) => {
        this.lastConservationRequestModel = data;
      }
    })
  }

  scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTo({
        top: this.scrollContainer.nativeElement.scrollHeight,
        behavior: 'smooth'   // 👈 yumuşak kaydırma
      });
    } catch (err) { }

    this.showMessageIcon = false;
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.IsActive = false;
    this.userId = "";
    this.isModalOpen = false;
  }

  GetUserByGuidId() {
    this.service.Get(`Users/GetUserByGuidId?guidId=${this.userId}`).subscribe({
      next: (data: any) => {

        this.IsActive = true;
        this.reciverNameSurname = data.reciverNameSurname;
        this.sendFirstMessageRequestModel.reciverId = data.reciverId;
        this.sendFirstMessageRequestModel.senderId = data.senderId;

      },
      error: (response) => {
        this.userId = "";
        alert(response.error.payload)
      }
    })
  }

  sendMessage() {
    this.signalRService.SendFirstMessage(this.sendFirstMessageRequestModel);
  }

  Send() {
    let id = 0;
    if (this.IsOtherUserConservationPageOpen) {
      id = 1;
    } else {
      id = 0;
    }

    let formatdate = this.setFormatDate();
    this.signalRService.CancelTyping(this.reciverUserId);
    this.conservationRequestModel.push({
      message: this.message,
      date: formatdate,
      isSender: true,
      messageDeliveryType: id,
    })
    this.signalRService.SendMessage(this.reciverUserId, this.message);
    this.message = "";
    setTimeout(() => {
      this.scrollToBottom();
    }, 150);
  }

}
