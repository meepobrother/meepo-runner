import { Component, OnInit } from '@angular/core';
import { RunnerAppService } from '../service/app';
import { CoreService } from 'meepo-core';
@Component({
    selector: 'runner-header',
    templateUrl: './runner-header.html'
})
export class RunnerHeaderComponent implements OnInit {
    activeTitle: any = {
        items: []
    };
    headerTitles: any[] = [{
        title: '跑腿'
    }];
    constructor(
        public app: RunnerAppService,
        public core: CoreService
    ) {
        this.app.inited$.subscribe(res => {
            this.activeTitle.items = res;
        });
    }

    ngOnInit() { }

    switchNotice() {
        this.app.showTip();
    }

    locationToHome() {
        this.core.showMenu({ show: true });
    }

    _onNavItem(item: any) {
        this.app.setActive(item);
    }

    _onHeaderItem() {

    }
}