import {
    Component, OnInit, ViewChild, ElementRef,
    ChangeDetectionStrategy, ChangeDetectorRef,
    ViewEncapsulation
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


    form: any = {
        start: {
            detail: '',
            mobile: '',
            city: '',
            point: {
                lat: '',
                lon: ''
            },
            address: '',
            title: ''
        },
        end: {
            detail: '',
            mobile: '',
            city: '',
            point: {
                lat: '',
                lon: ''
            },
            address: '',
            title: ''
        }
    };


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
        this.app.setting$.subscribe(items => {
            let {
                adv, baojia,
                btnTitle, end, start,
                gonggao, image, money,
                msg, price, priceStr,
                rule, setting, tiji,
                time, voice, weight
            } = items;
            this.adv = adv;
            this.baojia = baojia;
            this.btnTitle = btnTitle;
            this.end = end;
            this.start = start;
            this.gonggao = gonggao;
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
            console.log(this.start);
            this.cd.markForCheck();
        });
    }

    ngOnInit() {
        if (this.ua.isWechat()) {
            this.wx.openAddress().subscribe(res => {
                this.form.start.mobile = res.telNumber;
                this.form.start.detail = res.detailInfo;
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
}