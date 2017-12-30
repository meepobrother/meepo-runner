import { Injectable } from '@angular/core';
import { TimeWeight, Widget } from './order';
@Injectable()
export class RunnerUtilService {

    constructor() { }
    // 区间
    qujian() {

    }
    // 阶梯
    jieti(settingItems: any[], len: number) {
        let items: any = [];
        settingItems.map(res => {
            if (res.end > 0 && len > res.start && len <= res.end) {
                res['chazhi'] = len - res.start;
                if (res['chazhi'] > 0) {
                    items.push({
                        start: res.start,
                        end: len,
                        price: res.price,
                        money: Number(res['chazhi'] * res.price).toFixed(2)
                    });
                }
            } else if (res.end > 0 && len > res.start && len > res.end) {
                res['chazhi'] = res.end - res.start;
                if (res['chazhi'] > 0) {
                    items.push({
                        start: res.start,
                        end: res.end,
                        price: res.price,
                        money: Number(res['chazhi'] * res.price).toFixed(2)
                    });
                }
            } else if (!res.end && res.start > 0 && len > res.start) {
                res['chazhi'] = len - res.start;
                if (res['chazhi'] > 0) {
                    items.push({
                        start: res.start,
                        end: len,
                        price: res.price,
                        money: Number(res['chazhi'] * res.price).toFixed(2)
                    });
                }
            }
        });
        return items;
    }

    time(res: TimeWeight, timeItems: any[]): any {
        let timeAddItem = {
            price: 0,
            start: '0:00',
            end: '23:59'
        };
        const Hour = res.hour;
        const minute = res.minute;
        timeItems.map(res => {
            const start = res.start.split(':');
            const end = res.end.split(':');
            const startHour = parseInt(start[0], 10);
            const startMinute = parseInt(start[1], 10);
            const endHour = parseInt(end[0], 10);
            const endMinute = parseInt(end[1], 10);

            if (Hour > startHour && Hour < endHour) {
                if (res) {
                    timeAddItem = res;
                }
            } else if (Hour === startHour && Hour === endHour) {
                if (minute >= startMinute && minute <= endMinute) {
                    if (res) {
                        timeAddItem = res;
                    }
                }
            } else if (Hour < startHour || Hour > endHour) {

            } else {
                if (minute >= startMinute) {
                    if (res) {
                        timeAddItem = res;
                    }
                }
            }
        });
        return timeAddItem;
    }
    // 公式
    xcode() { }
    // 后付费
    back() { }
}