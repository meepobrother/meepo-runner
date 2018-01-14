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


export interface RunnerNavItem {
    title: string;
    active: boolean;
}
export interface RunnerHeaderItem {
    items?: RunnerNavItem[]
}

@Component({
    selector: 'runner-header',
    templateUrl: './runner-header.html'
})
export class RunnerHeaderComponent implements OnInit {
    headerItems: RunnerHeaderItem[] = [];
    headerItem: RunnerHeaderItem = {
        items: []
    };
    constructor(
        public event: SocketService
    ) {
        this.headerItems = [];
        this.on((res: any) => {
            switch (res.type) {
                case RUNNER_HEADER_INIT:
                    this.headerItems = res.data;
                    break;
                default:
                    break;
            }
        });
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
        this.headerItem.items.map(item => {
            item.active = false;
        });
        item.active = true;
        this.emit({
            type: RUNNER_HEADER_CLICK_NAV_ITEM,
            data: item
        });
    }

    _onHeaderItem(item: any) {
        this.headerItem = item;
        this.emit({
            type: RUNNER_HEADER_CLICK_HEADER_ITEM,
            data: item
        });
    }
}