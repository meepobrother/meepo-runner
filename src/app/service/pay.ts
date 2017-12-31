import { Injectable } from '@angular/core';
import { CoreService } from 'meepo-core';
import { AxiosService } from 'meepo-axios';
import { WxService } from 'meepo-jssdk';
import { UuidService } from 'meepo-uuid';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class RunnerPayService {

    pay$: Subject<any> = new Subject();
    checkResult$: Subject<any> = new Subject();
    wxPay$: Subject<any> = new Subject();
    postOrder$: Subject<any> = new Subject();
    paySuccess$: Subject<any> = new Subject();
    payError$: Subject<any> = new Subject();

    opt: any;
    taskJson: any;

    constructor(
        public core: CoreService,
        public axios: AxiosService,
        public wx: WxService,
        public uuid: UuidService
    ) {
        this.pay$.subscribe(res => {
            this.postOrder(res);
        });
        this.postOrder$.subscribe((data: any) => {
            console.log(data);
            if (data.code === 1) {
                this.opt = data.info.opt;
                this.taskJson = data.info.taskJson
                this.wxPay();
            }
        });
        this.wxPay$.subscribe((res: any) => {
            console.log('支付结果', res);
            this.checkResult();
        });
        this.checkResult$.subscribe((res: any) => {
            console.log('检查支付结果', res);
            if (res.code === 3) {
                setTimeout(() => {
                    this.checkResult();
                }, 1000);
            } else if (res.code === 1) {
                this.paySuccess$.next(res);
            } else {
                this.payError$.next(res);
            }
        });
    }

    guid() {
        return 'xxxxxxxxxxxx4xxxyxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    postOrder(order: any): any {
        order.tid = order.tid || this.guid();
        order.payType = order.payType || 'wechat';
        order.total = order.total > 0 ? order.total : '0.01';
        order.action = order.action || 'task';
        order.goods = order.goods || '发布任务';
        let url = this.core.murl('entry//open', { __do: 'paylog.postOrder', m: 'imeepos_runner' }, false);
        console.log('postOrder', url);
        console.log('postOrder', order);
        let post = this.axios.bpost(url, order)
            .do(console.log)
            .subscribe(res => {
                this.postOrder$.next(res);
                post.unsubscribe();
            }, err => {
                console.log(err);
                this.axios.bpost(url, {}).subscribe(res => {
                    console.log(res);
                });
                post.unsubscribe();
            });
    }

    checkResult(): any {
        let post = { taskJson: this.taskJson };
        let url = this.core.murl('entry//open', { __do: 'paylog.checkResult', m: 'imeepos_runner' }, false);
        console.log('checkResult', url);
        this.axios.bpost(url, post).subscribe(res => {
            this.checkResult$.next(res);
        });
    }

    wxPay(): any {
        console.log('微信支付', this.opt);
        return this.wx.chooseWXPay({
            timestamp: this.opt.timeStamp,
            nonceStr: this.opt.nonceStr,
            package: this.opt.package,
            signType: this.opt.signType,
            paySign: this.opt.paySign
        }).subscribe(res => {
            this.wxPay$.next(res);
        });
    }
}

export interface HttpRespon {
    code: any;
    info: any;
    msg: string;
}

export interface WechatPayOpt {
    timeStamp: string,
    nonceStr: string,
    package: string,
    signType: string,
    paySign: string
}

export interface HttpResponPostOrder {
    code: any;
    info: {
        opt: WechatPayOpt,
        taskJson: any
    };
    msg: string;
}