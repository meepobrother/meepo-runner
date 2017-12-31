import {
    Component, OnInit, ChangeDetectionStrategy,
    ChangeDetectorRef, ViewEncapsulation,
    ViewChild
} from '@angular/core';
import { RunnerAppService } from '../service/app';
import { CoreService } from 'meepo-core';
import { XscrollComponent } from 'meepo-xscroll';
import { RunnerPayService } from '../service/pay';

@Component({
    selector: 'runner-info',
    templateUrl: './runner-info.html',
    styleUrls: ['./runner-info.scss'],
    encapsulation: ViewEncapsulation.None
})
export class RunnerInfoComponent implements OnInit {
    showOrderDetail: boolean = false;
    total: any = 0;
    btnTitle: any;
    @ViewChild(XscrollComponent) xscroll: XscrollComponent;

    order = {
        desc: '',
        serverId: '',
        voice_time: '',
        src: '',
        money: 0,// 小费
        type: '',//类型,
        payType: 'wechat',
        duration: '',// 时长
        duration_value: 0,
        routeLen: 0,
        total: 0,// 总计
        price: 0,// 价值
        goods: '',//
        weight: 0,
        end: {},
        start: {},
        images: [],
        baojia: {},
        tiji: {},
        number: 1,
        time: {},
    };
    constructor(
        public app: RunnerAppService,
        public cd: ChangeDetectorRef,
        public core: CoreService,
        public pay: RunnerPayService
    ) {
        this.app.total$.subscribe(res => {
            this.total = res;
            this.order.total = res;
            this.cd.detectChanges();
        });
        this.app.active$.subscribe(res => {
            this.order.goods = res.title;
            this.order.type = res.code;
        });
        this.app.setting$.subscribe(res => {
            this.btnTitle = res.btnTitle;
        });
        this.app.next$.subscribe(res => {
            if (res === 'all') {
                this.showInfo = false;
                this.showOrderDetail = false;
                this.cd.markForCheck();
            } else if (res) {
                this.showDetail();
            } else {
                this.showInfo = true;
                this.hideDetail();
            }
            this.cd.markForCheck();
        });
    }

    ngOnInit() { }

    showInfo: boolean = false;

    closeInfo() {
        this.showInfo = false;
        this.cd.markForCheck();
    }

    switchShowOrderDetail() {
        this.showInfo = !this.showInfo;
        this.showOrderDetail = false;
    }

    showDetail() {
        this.showInfo = false;
        this.showOrderDetail = true;
    }

    hideDetail() {
        this.showInfo = true;
        this.showOrderDetail = false;
    }

    cancel() {
        this.hideDetail();
    }

    onRefresh(e: any) {
        this.xscroll.onEnd();
    }

    finish() {
        // 支付
        if (this.app.agree) {
            this.order.start = this.app.start;
            this.order.end = this.app.end;
            this.order.time = this.app.time;
            this.order.weight = this.app.weight;

            this.order.baojia = this.app.baojia;
            this.order.payType = 'wechat';
            this.order.tiji = this.app.tiji;
            this.order.images = this.app.images;
            this.order.desc = this.app.msg;
            this.order.duration = '预计：' + (this.app.duration + this.app.price.duration) + '分钟';
            this.order.duration_value = this.app.duration;
            this.order.routeLen = this.app.distance;
            
            this.pay.pay$.next(this.order);
        } else {
            this.core.showAlert({
                title: '请注意',
                content: '您必须勾选条款才可以发单'
            });
        }
    }
}

