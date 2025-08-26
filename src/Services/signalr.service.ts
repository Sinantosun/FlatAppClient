import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { SendFirstMessageModel } from '../Models/send-first-message-model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  private hubConnection!: signalR.HubConnection;
  private _messageSubject = new BehaviorSubject<string>("");
  message$ = this._messageSubject.asObservable();

  private _mesageTypingStatusSubject = new BehaviorSubject<boolean>(false);
  messageTypeStatus$ = this._mesageTypingStatusSubject.asObservable();

  private _conservatinonStatusSubject = new BehaviorSubject<boolean>(false);
  conservationStatus$ = this._conservatinonStatusSubject.asObservable();

    private _lastSeenDateSubject = new BehaviorSubject<string>("");
  latSeenDate$ = this._lastSeenDateSubject.asObservable();


  constructor() { }

  startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder().withUrl("https://testprojectwebapi.sinantosun.com/ChatAppHub")
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('SignalR bağlantısı kuruldu.'))
      .catch(err => console.log('Bağlantı hatası: ' + err));
  }

  SendFirstMessage(data: SendFirstMessageModel) {
    this.hubConnection.invoke("SendFirstMessage", data)
  }

  ReciveThisConservationAlreadExist() {
    this.hubConnection.on("ReciveThisConservationAlreadExist", (() => {
      alert("Bu konuşma zaten mevcut son konuşmalardan 'sohbet' butonuna basarak bu konuşmaya erişebilirsiinz.")
    }))
  }

  SendMessage(reciverId: number, message: string) {
    this.hubConnection.invoke("SendMessage", reciverId, message)
  }

  reciveMessasge() {
    this.hubConnection.on("reciveMesage", ((data) => {
      this._messageSubject.next(data);
    }))
  }

  Typing(reciverId: number) {
    this.hubConnection.invoke("Typing", reciverId)
  }

  reciveTyping() {
    this.hubConnection.on("reciveTyping", (() => {
      this._mesageTypingStatusSubject.next(true);
    }))
  }

  CancelTyping(reciverId: number) {
    this.hubConnection.invoke("CancelTyping", reciverId)
  }

  reciveCancelTyping() {
    this.hubConnection.on("CancelTyping", (() => {
      this._mesageTypingStatusSubject.next(false);
    }))
  }

  ConservationStart(reciverId: number) {
    this.hubConnection.invoke("ConservationStart", reciverId)
  }

  reciveConservationStarted() {
    this.hubConnection.on("ConservationStarted", (() => {
      this._conservatinonStatusSubject.next(true);
    }))
  }


   ConservationTest(reciverId: number) {
    this.hubConnection.invoke("ConservationTest", reciverId)
  }

  ConservationTestRecive() {
    this.hubConnection.on("ConservationTestRecive", (() => {
      this._conservatinonStatusSubject.next(false);
    }))
  }
   ReciveReciverLastSeenDate() {
    this.hubConnection.on("ReciveReciverLastSeenDate", ((data) => {
      this._lastSeenDateSubject.next(data);
    }))
  }


  


}
