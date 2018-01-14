import { Component, OnInit } from '@angular/core';
import { RunnerAppService } from '../service/app';
import { CoreService } from 'meepo-core';
import { SocketService } from 'meepo-event';

export const runnerHeaderRoom = 'runnerHeaderRoom';
export const RUNNER_HEADER_INIT = 'RUNNER_HEADER_INIT';
export const RUNNER_HEADER_CLICK_RIGHT = 'RUNNER_HEADER_CLICK_RIGHT';
export const RUNNER_HEADER_CLICK_LEFT = 'RUNNER_HEADER_CLICK_LEFT';
export const RUNNER_HEADER_CLICK_NAV_ITEM = 'RUNNER_HEADER_CLICK_NAV_ITEM';
export const RUNNER_HEADER_CLICK_HEADER_ITEM = 'RUNNER_HEADER_CLICK_HEADER_ITEM';

@Component({
    selector: 'runner-header',
    templateUrl: './runner-header.html'
})
export class RunnerHeaderComponent implements OnInit {
    headerTitles: any[] = [];
    activeTitle: any = {
        items: []
    };
    constructor(
        public event: SocketService
    ) {
        this.on((res: any) => {
            switch (res.type) {
                case RUNNER_HEADER_INIT:
                    this.headerTitles = res.data;
                    break;
                default:
                    break;
            }
        })
    }

    on(fn: Function) {
        this.event.on(runnerHeaderRoom, fn);
    }

    emit(data: any) {
        this.event.emit(runnerHeaderRoom, data);
    }

    ngOnInit() { }

    switchNotice() {
        this.emit({
            type: RUNNER_HEADER_CLICK_LEFT,
            data: ''
        });
    }

    locationToHome() {
        this.emit({
            type: RUNNER_HEADER_CLICK_RIGHT,
            data: ''
        });
    }

    _onNavItem(item: any) {
        this.emit({
            type: RUNNER_HEADER_CLICK_NAV_ITEM,
            data: ''
        });
    }

    _onHeaderItem(item: any) {
        this.activeTitle = item;
        this.emit({
            type: RUNNER_HEADER_CLICK_HEADER_ITEM,
            data: ''
        });
    }
}