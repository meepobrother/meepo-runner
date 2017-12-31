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

    // 预约时间
    time: any;
    // 导航时间
    duration: any;
    // 路程
    distance: any;

    endSetting: any;
    startSetting: any;
    timeSetting: any;
    weightSetting: any;
    btnTitle: any;

    startEndCombineObserver: any;
    total: any = 0;
    constructor(
        public address: BmapAddressSelectService,
        public uuid: UuidService,
        public app: RunnerAppService,
        public order: RunnerOrderService,
        public cd: ChangeDetectorRef,
        public bmap: BmapService,
        public core: CoreService
    ) {
        this.app.total$.subscribe(res => {
            this.total = res;
            this.cd.detectChanges();
        });
        this.app.setting$.subscribe(res => {
            let {
                end, start, time,
                btnTitle, weight
            } = res;
            this.startSetting = start;
            this.endSetting = end;
            this.weightSetting = weight;
            this.timeSetting = time;
            this.btnTitle = btnTitle;
            this.cd.detectChanges();
        });

        this.app.start$.subscribe(res => {
            if (res.address) {
                this.startLoading = false;
                this.cd.detectChanges();
            }
        });
        this.app.end$.subscribe(res => {
            if (res.address) {
                this.endLoading = false;
                this.cd.detectChanges();
            }
        });
    }

    ngOnInit() {
        this.sn = this.sn || this.uuid.v1();
        this.app.sn = this.sn;
    }

    check() {
        if (this.startSetting.show) {
            if (!this.app.start.address) {
                this.core.showToast({
                    show: true,
                    title: '请选择' + this.startSetting.title,
                    message: this.startSetting.placeholder,
                    type: 'warning'
                });
                return false;
            }
        }
        if (this.endSetting.show) {
            if (!this.app.end.address) {
                this.core.showToast({
                    show: true,
                    title: '请选择' + this.endSetting.title,
                    message: this.endSetting.placeholder,
                    type: 'warning'
                });
                return false;
            }
        }
        if (this.weightSetting.show) {
            if (!this.app.weight) {
                this.core.showToast({
                    show: true,
                    title: '请输入' + this.weightSetting.title,
                    message: this.weightSetting.placeholder,
                    type: 'warning'
                });
                return false;
            }
        }
        return true;
    }
    finish() {
        if (this.check()) {
            this.app.next$.next(true);
        }
    }

    setWeight(e: any) {
        this.app.setWeight(e.target.value);
    }
}