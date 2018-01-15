import { Injectable, ChangeDetectorRef } from '@angular/core';
import { CoreService } from 'meepo-core';
import { AxiosService } from 'meepo-axios';
import { Subject } from 'rxjs/Subject';
import { RunnerOrderService, Widget, TimeWeight } from './order';
import { RunnerUtilService } from './util';
import { BmapAddressSelectService, BmapService } from 'meepo-bmap';

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
    tiji: any = {
        width: 0,
        length: 0,
        height: 0
    };
    images: any;
    msg: string;
    distance: number = 0;
    duration: number = 0;
    start: any = {
        point: {},
        address: '',
        title: '',
        city: '',
        mobile: '',
        detail: ''
    };
    start$: Subject<any> = new Subject();
    end: any = {
        point: {},
        address: '',
        title: '',
        city: '',
        mobile: '',
        detail: ''
    };
    baojia: any;
    end$: Subject<any> = new Subject();

    startEndCombineObserver: any;

    total$: Subject<any> = new Subject();

    endLoading: boolean = true;
    startLoading: boolean = true;
    isStart: boolean = true;
    sn: string;
    loading: boolean = true;

    next$: Subject<any> = new Subject();

    agree: boolean = true;
    constructor(
        public core: CoreService,
        public axios: AxiosService,
        public order: RunnerOrderService,
        public util: RunnerUtilService,
        public address: BmapAddressSelectService,
        public bmap: BmapService
    ) {
        this.total$.next(0);
        this.order.order$.debounceTime(100).subscribe(res => {
            let price = 0;
            res.map((item: Widget) => {
                item.price = Math.floor(item.price * 100) / 100;
                price += item.price * 1;
            });
            price = Math.floor(price * 100) / 100;
            this.setTotal(price);
        });
        this.active$.subscribe(res => {
            let { baojias } = res;
            baojias && baojias.map(res => {
                if (res.active) {
                    this.baojia = res;
                }
            });
            this.setting$.next(res.setting);
        });
        this.setting$.subscribe(res => {
            if (res && res.setting) {
                this.price$.next(res.setting);
                this.setting = res;
                if (!this.setting) {
                    this.core.showToast({
                        title: '此类型未配置',
                        message: '请联系管理员进行配置',
                        show: true
                    });
                } else {
                    let {
                    adv, baojia,
                        btnTitle, end, start,
                        gonggao, image, money,
                        msg, price, priceStr,
                        rule, setting, tiji,
                        time, voice, weight
                } = res;
                    if (start.show && end.show) {
                        this.start$.next(this.start);
                        this.end$.next(this.end);
                    } else {
                        if (this.bmap) {
                            this.bmap.clearOverlays();
                        }
                        this.distance = 0;
                        this.duration = 0;
                        this.autoDistance();
                    }
                    if (time.show) {
                        if (!this.time) {
                            this.initNowTime();
                        }
                        this.autoTime();
                    }
                    if (weight.show) {
                        this.autoWeight();
                    }
                    if (baojia.show) {
                        this.autoBaojia();
                    }
                    this.autoTianqi();
                }
            }
        });
        this.price$.subscribe(res => {
            // 设置起步价
            this.price = res;
            if (this.price) {
                this.qibu(res);
            } else {
                this.core.showToast({
                    title: '没有设置价格策略',
                    message: '请联系管理员进行配置',
                    show: true
                });
            }
        });

        this.startEndCombineObserver =
            this.start$.asObservable().combineLatest(this.end$.asObservable()).subscribe(res => {
                // 计算距离 路径规划
                if (res[0].address && res[1].address) {
                    if (res[0].point === res[1].point) {
                        if (this.bmap) {
                            this.bmap.clearOverlays();
                        }
                        this.core.closeLoading();
                    } else {
                        let route$ = this.bmap.getRoutePlan(res[0], res[1]).subscribe(routes => {
                            this.distance = Math.floor(routes.distance / 10) / 100;
                            this.duration = Math.floor(routes.duration / 60);
                            if (isNaN(this.distance)) {
                                this.distance = 0;
                                this.duration = 0;
                            }
                            this.getDistancePrice();
                            let arrPois = [];
                            if (routes && routes.steps) {
                                routes.steps.map(step => {
                                    const stepOriginLocation = step.stepOriginLocation;
                                    const points = [];
                                    step.pois.map(p => {
                                        points.push(new this.bmap.BMap.Point(p.location.lng, p.location.lat));
                                    });
                                    const stepDestinationLocation = step.stepDestinationLocation;
                                    arrPois = [
                                        ...arrPois,
                                        new this.bmap.BMap.Point(stepOriginLocation.lng, stepOriginLocation.lat),
                                        ...points,
                                        new this.bmap.BMap.Point(stepDestinationLocation.lng, stepDestinationLocation.lat)
                                    ];
                                });
                            }
                            this.bmap.addLine(arrPois);
                            route$.unsubscribe();
                        });
                    }
                }
            });
        this.bmap.getAddress$.subscribe(res => {
            this.setAddress(res);
            this.core.closeLoading();
        });

        this.address.show$.subscribe(res => {
            let { isStart, data } = res;
            if (data) {
                this.isStart = isStart;
                this.setAddress(data);
                this.core.closeLoading();
            }
        });
        this.bmap.movestart$.subscribe(res => {
            this.loading = true;
            this.core.showLoading({ show: true, full: false });
        });
    }
    tip$: Subject<any> = new Subject();
    showTip() {
        this.tip$.next(true);
    }
    hideTip() {
        this.tip$.next(false);
    }
    switchAgree() {
        this.agree = !this.agree;
    }
    private initNowTime() {
        let now = new Date();
        this.time = {
            year: now.getFullYear(),
            month: now.getMonth() + 1,
            day: now.getDate(),
            hour: now.getHours(),
            minute: now.getMinutes()
        };
    }

    private setAddress(data: any) {
        if (this.isStart) {
            this.setStart(data);
        } else {
            this.setEnd(data);
        }
    }

    private setStart(data: any) {
        if (data) {
            this.setCityAndTitle(this.start, data);
            this.startLoading = false;
            this.start$.next(this.start);
        }
    }

    private setCityAndTitle(res: any, data: any) {
        if (data.city) {
            res.city = data.city;
            res.title = data.title;
            res.address = data.address;
        } else {
            res.city = data.addressComponents.city;
            res.title = data.surroundingPois.length > 0 ? data.surroundingPois[0].title : '';
            res.address = data.surroundingPois.length > 0 ? data.surroundingPois[0].address : data.address;
        }
        res.point = data.point;
    }

    private setEnd(data: any) {
        if (data) {
            this.setCityAndTitle(this.end, data);
            this.endLoading = false;
            this.end$.next(this.end);
        }
    }

    private getDistancePrice() {
        this.setDistance(this.distance);
    }

    myLocation(e: Event, isStart: boolean) {
        e.stopPropagation();
        e.preventDefault();
        this.isStart = isStart;
        if (isStart) {
            this.startLoading = true;
            this.endLoading = false;
        } else {
            this.endLoading = true;
            this.startLoading = false;
        }
        this.core.showLoading({ show: true, full: false });
        this.bmap && this.bmap.getCurrentPosition(false);
    }

    _onStartAddressSelect() {
        this.isStart = true;
        this.startLoading = true;
        this.address.show(this.sn, true);
        this.next$.next('all');
    }

    _onEndAddressSelect() {
        this.isStart = false;
        this.endLoading = true;
        this.address.show(this.sn, false);
        this.next$.next('all');
    }

    onTimePicker(e: any) {
        this.time = e;
        this.setTime(e);
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
                item.value = item.code;
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
        this.items.map(res => {
            res.active = false;
        });
        item.active = true;
        this.active$.next(item);
        this.inited$.next(this.items);
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
                    weight$.price += i.money;
                });
                weight$.desc = str;
            }
            this.order.weight$.next(weight$);
        }
    }

    setBaojia(e: any) {
        this.baojia = e;
        this.autoBaojia();
    }

    autoBaojia() {
        let e = this.baojia;
        if (this.setting && e) {
            let { baojia } = this.setting;
            baojia = baojia || { title: '保价' }
            let baojia$ = new Widget('baojia', baojia.title, '', 0, e.money, e.desc, true);
            this.order.baojia$.next(baojia$);
        }
    }

    autoTianqi() {
        if (this.price) {
            let { tianqiItems } = this.price;
            let tianqi$ = new Widget('tianqi', '其他', '', 0, 0, '');
            if (tianqiItems) {
                tianqiItems.map(res => {
                    tianqi$.desc += res.title;
                    tianqi$.price += res.price * 1;
                });
                this.order.tianqi$.next(tianqi$);
            }
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
