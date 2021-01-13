import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { interval, Subscription, iif } from 'rxjs';
import { mergeMap, takeWhile } from 'rxjs/operators';
import { HttpService } from 'src/app/service/http.service';
import { WebSocketService } from 'src/app/service/web-socket.service';

interface BusArrival {
  BusStopCode: string;
  Services: [];
}

@Component({
  selector: 'app-bus-arrival',
  templateUrl: './bus-arrival.component.html',
  styleUrls: ['./bus-arrival.component.css'],
})
export class BusArrivalComponent implements OnInit, OnDestroy {
  arrivalUpdate$: Subscription;
  intervalRequest$: Subscription;
  intervalPing$: Subscription;
  busArrivalDetail: BusArrival | {} = {};
  services: [] = [];
  stopCode: number;
  constructor(
    private route: ActivatedRoute,
    private http: HttpService,
    private wsService: WebSocketService
  ) {}
  ngOnDestroy() {
    this.arrivalUpdate$.unsubscribe();
    this.intervalRequest$.unsubscribe();
    this.wsService.close();
  }
  ngOnInit(): void {
    this.stopCode = parseInt(this.route.snapshot.params['id']);
    // Subscribe to ws subject updating from WebSocket
    // Future implementation might change to HTTP for simple design
    this.arrivalUpdate$ = this.wsService.arrivalObservable.subscribe((res) => {
      this.services = res['Services'];
    });

    // Initial HTTP call
    this.http.getBusArrivalByCode(this.stopCode).then((res) => {
      this.busArrivalDetail = res;
      this.services = res['Services'];
    });
    this.wsService.subLiveUpdate(this.stopCode);

    this.intervalPing$ = interval(25 * 1000)
      .pipe(takeWhile(() => !!this.wsService.socketState))
      .subscribe(() => this.wsService.pingServer());

    // Observable to trigger request call every minute
    this.intervalRequest$ = interval(60 * 1000)
      .pipe(takeWhile(() => !!this.wsService.socketState))
      .subscribe(() => this.wsService.requestUpdate(this.stopCode));
  }
}
