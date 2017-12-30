
import {
    Component, OnInit,
    ChangeDetectionStrategy, ChangeDetectorRef,
    ViewEncapsulation
} from '@angular/core';
import { RunnerOrderService, Widget } from '../service/order';
import { RunnerAppService } from '../service/app';

import { Subject } from 'rxjs/Subject';

@Component({
    selector: 'runner-order',
    templateUrl: 'runner-order.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class RunnerOrderComponent implements OnInit {
    constructor(
        public order: RunnerOrderService,
        public cd: ChangeDetectorRef,
        public app: RunnerAppService
    ) {
        this.app.total$.subscribe(res => {
            this.cd.detectChanges();
        });
    }

    ngOnInit() {

    }
}
