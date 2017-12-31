
import {
    Component, OnInit,
    ChangeDetectionStrategy, ChangeDetectorRef,
    ViewEncapsulation, EventEmitter, Output
} from '@angular/core';
import { RunnerOrderService, Widget } from '../service/order';
import { RunnerAppService } from '../service/app';

import { Subject } from 'rxjs/Subject';

@Component({
    selector: 'runner-order',
    templateUrl: 'runner-order.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    styleUrls: [
        './runner-order.scss'
    ]
})
export class RunnerOrderComponent implements OnInit {
    total: any = 0;
    btnTitle: any;
    @Output() onCancel: EventEmitter<any> = new EventEmitter();
    constructor(
        public order: RunnerOrderService,
        public cd: ChangeDetectorRef,
        public app: RunnerAppService
    ) {
        this.app.setting$.subscribe(res => {
            this.btnTitle = res.btnTitle;
        });
        this.app.total$.subscribe(res => {
            this.total = res;
            this.cd.detectChanges();
        });
        
    }

    ngOnInit() {
        
    }

    cancel() {
        this.onCancel.emit();
    }

    finish() { }

    next(){
        
    }
}
