import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'runner-setting',
    templateUrl: './runner-setting.html',
    styleUrls: [
        './runner-setting.scss'
    ]
})

export class RunnerSettingComponent implements OnInit {
    @Output() onBack: EventEmitter<any> = new EventEmitter();

    constructor() { }

    ngOnInit() { }

    onMore(e: any) {
        console.log(e);
    }

    onRefresh(e: any) {
        console.log(e);
    }

    back() {
        this.onBack.emit();
    }
}