import {
    Component, OnInit, ViewChild, ElementRef,
    ChangeDetectionStrategy, ChangeDetectorRef,
    ViewEncapsulation, EventEmitter, Input, Output
} from '@angular/core';
import { RunnerOrderService, Widget } from '../service/order';
import { RunnerAppService } from '../service/app';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { WxService } from 'meepo-jssdk';
import { UaService } from 'meepo-ua';

@Component({
    selector: 'runner-forms',
    templateUrl: './runner-forms.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class RunnerFormsComponent implements OnInit {
    items$: Observable<any>;
    @Output() onRefresh: EventEmitter<any> = new EventEmitter();
    setting: any;
    adv: any;
    baojia: any;
    btnTitle: any;
    end: any;
    start: any;
    gonggao: any;
    image: any;
    msg: any;
    price: any;
    priceStr: any;
    rule: any;
    tiji: any;
    time: any;
    voice: any;
    weight: any;
    money: any;
    baojias: any;
    active: any;
    items: any[] = [];
    constructor(
        public order: RunnerOrderService,
        public app: RunnerAppService,
        public cd: ChangeDetectorRef,
        public wx: WxService,
        public ua: UaService
    ) {
        // 处理得到新流
        this.items$ = this.app.inited$.map(items => {
            items.map(item => {
                item.value = item.code
            });
            return items;
        });
        this.items$.debounceTime(300).subscribe(res => {
            this.items = res;
            this.cd.markForCheck();
        });
        this.app.active$.subscribe(res => {
            let { baojias } = res;
            this.baojias = baojias;
            this.cd.markForCheck();
        });
        this.app.setting$.subscribe(items => {
            let {
                adv, baojia,
                btnTitle, end, start,
                gonggao, image, money,
                msg, price, priceStr,
                rule, setting, tiji,
                time, voice, weight
            } = items;
            this.baojia = baojia;
            this.btnTitle = btnTitle;
            this.end = end;
            this.start = start;
            this.image = image;
            this.money = money;
            this.msg = msg;
            this.price = price;
            this.priceStr = priceStr;
            this.rule = rule;
            this.setting = setting;
            this.tiji = tiji;
            this.time = time;
            this.voice = voice;
            this.weight = weight;
            this.cd.detectChanges();
        });

        this.app.start$.subscribe(res => {
            this.startAddress = res;
            this.cd.detectChanges();
        });
        this.app.end$.subscribe(res => {
            this.endAddress = res;
            this.cd.detectChanges();
        });
    }
    startAddress: any;
    endAddress: any;

    onSelect(e: any) {
        this.app.setBaojia(e);
    }

    ngOnInit() {
        if (this.ua.isWechat()) {
            this.wx.openAddress().subscribe(res => {
                this.app.start.mobile = res.telNumber;
                this.app.start.detail = res.detailInfo;
            });
        }
    }

    changeWeight(e: any) {
        this.app.setWeight(e);
    }

    changeClass(e: any) {
        this.app.setActive(e);
    }

    changeJifei(e: any) {
        this.app.setJifei(e);
    }

    showTiji() {
        this.tiji.detail = !this.tiji.detail;
        this.onRefresh.emit('1');
    }

    showTip() {
        this.app.showTip();
    }

    agree() {
        this.app.switchAgree();
    }

    changeLength(e: any) {
        console.log(this.app.tiji);
        this.app.tiji.length = e;
    }

    changeWidth(e: any) {
        this.app.tiji.width = e;
    }

    changeHeight(e: any) {
        this.app.tiji.height = e;
    }

    imageUpload(e: any) {
        console.log(e);
        this.app.images = e;
    }

    setMsg(e: any) {
        this.app.msg = e;
    }
}