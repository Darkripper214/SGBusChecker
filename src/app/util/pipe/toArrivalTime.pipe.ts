import { PipeTransform, Pipe } from '@angular/core';

@Pipe({
  name: 'toArrivalTime',
})
export class ArrivalTimePipe implements PipeTransform {
  constructor() {}

  transform(datetime: string): string {
    // Check time in seconds
    const currTime = Date.now() / 1000;
    const arrivalTime = Date.parse(datetime) / 1000;
    const difference = Math.floor((arrivalTime - currTime) / 60);
    return difference <= 2 ? 'Arriving' : `In ${difference} Minutes`;
  }
}
