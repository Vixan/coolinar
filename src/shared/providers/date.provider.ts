import { Injectable } from '@nestjs/common';
import * as moment from 'moment';

export interface DateInterval {
  start: Date;
  end: Date;
}

export enum DatePart {
  HOUR = 'hour',
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year',
}

@Injectable()
export class DateProvider {
  createDateInterval(date: Date | string, datePart: DatePart) {
    const dateInterval: DateInterval = {
      start: moment(date)
        .startOf(datePart)
        .toDate(),
      end: moment(date)
        .endOf(datePart)
        .toDate(),
    };

    return dateInterval;
  }
}
