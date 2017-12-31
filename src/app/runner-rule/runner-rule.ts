import { Component, OnInit, ChangeDetectorRef, ViewEncapsulation ,ChangeDetectionStrategy} from '@angular/core';
import { RunnerAppService } from '../service/app';
@Component({
    selector: 'runner-rule',
    templateUrl: './runner-rule.html',
    styleUrls: [
        './runner-rule.scss'
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RunnerRuleComponent implements OnInit {
    showNotice: boolean = false;
    ruleContent: string = '';
    constructor(
        public app: RunnerAppService,
        public cd: ChangeDetectorRef
    ) {
        this.app.tip$.subscribe(res => {
            this.showNotice = res;
            this.cd.markForCheck();
        });
        this.app.setting$.subscribe(res => {
            let { rule } = res;
            this.ruleContent = rule.content;
            this.cd.markForCheck();
        });
    }

    ngOnInit() { }

    switchNotice() {
        this.app.hideTip();
    }
}