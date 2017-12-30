import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { BmapAddressSelectService, BmapService } from 'meepo-bmap';
import { UuidService } from 'meepo-uuid';
import { CoreService } from 'meepo-core';

import { RunnerAppService } from '../service/app';
import { RunnerOrderService } from '../service/order';
import { Subject } from 'rxjs/Subject';

@Component({
    selector: 'runner-map',
    templateUrl: './runner-map.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./runner-map.scss']
})
export class RunnerMapComponent implements OnInit {
    @Input() startLoading: boolean = true;
    @Input() endLoading: boolean = true;
    @Input() loading: boolean = true;
    isStart: boolean = true;
    @Input() sn: string;
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
    end$: Subject<any> = new Subject();
    // 预约时间
    time: any;
    // 导航时间
    duration: any;
    // 路程
    distance: any;

    endSetting: any;
    startSetting: any;
    timeSetting: any;
    btnTitle: any;

    startEndCombineObserver: any;
    constructor(
        public address: BmapAddressSelectService,
        public uuid: UuidService,
        public app: RunnerAppService,
        public order: RunnerOrderService,
        public cd: ChangeDetectorRef,
        public bmap: BmapService,
        public core: CoreService
    ) {
        this.app.setting$.subscribe(res => {
            let {
                end, start, time, btnTitle
            } = res;
            this.startSetting = start;
            this.endSetting = end;
            this.timeSetting = time;
            this.btnTitle = btnTitle;
            this.cd.markForCheck();
        });

        this.bmap.getAddress$.subscribe(res => {
            this.setAddress(res);
            this.core.closeLoading();
            this.cd.detectChanges();
        });
        this.address.show$.subscribe(res => {
            let { isStart, data } = res;
            if(data){
                setTimeout(() => {
                    this.isStart = !isStart;
                }, 300);
            }
            this.setAddress(data);
            this.core.closeLoading();
        });
        this.bmap.movestart$.subscribe(res => {
            this.loading = true;
            this.cd.detectChanges();
            this.core.showLoading({ show: true, full: false });
        });

        this.startEndCombineObserver =
            this.start$.asObservable().combineLatest(this.end$.asObservable()).subscribe(res => {
                // 计算距离 路径规划
                if (res[0].address && res[1].address) {
                    if (res[0].point === res[1].point) {
                        this.bmap.clearOverlays();
                        this.core.closeLoading();
                    } else {
                        let route$ = this.bmap.getRoutePlan(res[0], res[1]).subscribe(routes => {
                            this.distance = Math.floor(routes.distance / 10) / 100;
                            this.duration = Math.floor(routes.duration / 60);
                            if (isNaN(this.distance)) {
                                this.distance = 0;
                                this.duration = 0;
                            }
                            // this.btnTitle = `总路程:${this.distance}公里`;
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
                            this.cd.detectChanges();
                        });
                    }
                }
            });
    }

    ngOnInit() {
        this.sn = this.sn || this.uuid.v1();
    }

    private setAddress(data: any) {
        console.log(this.isStart);
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
        this.app.setDistance(this.distance);
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
        this.bmap.getCurrentPosition(false);
    }

    _onStartAddressSelect() {
        this.isStart = true;
        this.startLoading = true;
        this.address.show(this.sn, true);
    }

    _onEndAddressSelect() {
        this.isStart = false;
        this.endLoading = true;
        this.address.show(this.sn, false);
    }

    onTimePicker(e: any) {
        this.time = e;
    }

    finish() {

    }
}