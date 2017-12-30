import { Injectable, ChangeDetectorRef } from '@angular/core';
import { CoreService } from 'meepo-core';
import { AxiosService } from 'meepo-axios';
import { Subject } from 'rxjs/Subject';
import { RunnerOrderService, Widget, TimeWeight } from './order';
import { RunnerUtilService } from './util';
@Injectable()
export class RunnerAppService {
    items: any[] = [];
    active$: Subject<any> = new Subject();
    inited$: Subject<any> = new Subject();
    setting: any;
    setting$: Subject<any> = new Subject();
    price: any;
    price$: Subject<any> = new Subject();

    weight: number = 0;
    time: TimeWeight;
    tiji: number = 0;
    distance: number = 0;

    total$: Subject<any> = new Subject();
    constructor(
        public core: CoreService,
        public axios: AxiosService,
        public order: RunnerOrderService,
        public util: RunnerUtilService
    ) {
        let now = new Date();
        this.total$.next(0);
        this.order.order$.debounceTime(100).subscribe(res => {
            let price = 0;
            res.map((item: Widget) => {
                price += item.price * 1;
            });
            price = Math.floor(price * 100) / 100;
            this.setTotal(price);
        });

        this.time = {
            year: now.getFullYear(),
            month: now.getMonth() + 1,
            day: now.getDate(),
            minute: now.getMinutes(),
            hour: now.getHours()
        };
        this.active$.subscribe(res => {
            this.setting$.next(res.setting);
        });
        this.setting$.subscribe(res => {
            this.price$.next(res.setting);
            this.setting = res;
            this.autoTime();
            this.autoWeight();
            this.autoDistance();
        });
        this.price$.subscribe(res => {
            // 设置起步价
            this.price = res;
            this.qibu(res);
        });
    }

    init() {
        let url = this.core.murl('entry//open', { __do: 'v2setting.tasksClass', m: 'imeepos_runner' }, false);
        this.axios.bpost(url, {}).subscribe((res: ReturnWidget) => {
            this.items = res.info;
            let hasActive = false;
            this.items.map(item => {
                if (item.active) {
                    this.setActive(item);
                    hasActive = true;
                }
            });
            if (!hasActive) {
                if (this.items && this.items.length > 0) {
                    this.setActive(this.items[0]);
                }
            }
            this.inited$.next(this.items);
        });
    }

    setActive(item: any) {
        item.active = true;
        this.active$.next(item);
    }

    setWeight(val: number) {
        this.weight = val;
        this.autoWeight();
    }

    setTotal(val: number) {
        this.total$.next(val);
    }

    getTotal() {
        return this.total$;
    }

    setDistance(val: number) {
        this.distance = val;
        this.autoDistance();
    }

    private autoDistance() {
        if (this.setting) {
            const distance = this.distance;
            const routeLen = distance;
            let { juli } = this.setting;
            juli = juli || { title: '总距离' }
            let juli$ = new Widget('juli', juli.title, '公里', this.distance, 0, '', this.distance > 0);
            juli$.items = this.util.jieti(this.price.juliItems, this.distance);
            juli$.desc = `${this.distance}${juli$.unit}内免费`;
            if (juli$.items.length > 0) {
                let str = '';
                juli$.items.map((i: any) => {
                    str += `${i.start}-${i.end}${juli$.unit}${i.money}元<br>`;
                    juli$.price += i.money * 1;
                });
                juli$.desc = str;
            }
            this.order.juli$.next(juli$);
        }
    }

    private autoWeight() {
        if (this.setting) {
            let { weight } = this.setting;
            weight = weight || { title: '重量' }
            let weight$ = new Widget('weight', weight.title, '公斤', this.weight, 0, '', this.weight > 0);
            weight$.items = this.util.jieti(this.price.weightItems, this.weight);
            weight$.desc = `${this.weight}${weight$.unit}内免费`;
            if (weight$.items.length > 0) {
                let str = '';
                weight$.items.map((i: any) => {
                    str += `${i.start}-${i.end}${weight$.unit}${i.money}元`;
                    weight$.money += i.money;
                });
                weight$.desc = str;
            }
            this.order.weight$.next(weight$);
        }
    }

    setTime(val: TimeWeight) {
        this.time = val;
        this.autoTime();
    }

    qibu(res: any) {
        let { len, start, duration } = res;
        let total = new Widget('total', '起步价', '', 0, 0, '', true);
        total.price = start;
        total.desc = `含${len}公里`;
        this.order.total$.next(total);
    }

    private autoTime() {
        if (this.setting) {
            let { time } = this.setting;
            time = time || { title: '预约时间' };
            let time$ = new Widget('time', time.title, '分钟', 0, 0, '', true);
            let timeItem = this.util.time(this.time, this.price.timeItems);
            time$.desc = `${timeItem.start}-${timeItem.end}`;
            time$.price = timeItem.price;
            this.order.time$.next(time$);
        }
    }

    setJifei(e: any) {

    }
}

export interface ReturnWidget {
    code: number;
    info: any;
    msg: string;
}
