import { Component, OnInit, Output, EventEmitter, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'runner-mytasks',
    templateUrl: './runner-mytasks.html',
    styleUrls: [
        './runner-mytasks.scss'
    ],
    encapsulation: ViewEncapsulation.None
})
export class RunnerMyTasksComponent implements OnInit {
    tabs: any[] = [
        {
            title: '全部',
            active: true,
            status: 0
        },
        {
            title: '待接单',
            active: false,
            status: 1
        },
        {
            title: '配送中',
            active: false,
            status: 2
        },
        {
            title: '待确认',
            active: false,
            status: 3
        },
        {
            title: '确认送达',
            active: false,
            status: 4
        },
        {
            title: '已撤销',
            active: false,
            status: 6
        }
    ];

    items: any[] = [{}, {}, {}];
    @Output() onBack: EventEmitter<any> = new EventEmitter();
    constructor() { }
    ngOnInit() { }

    onMore(e: any) {
        console.log(e);
    }

    onRefresh(e: any) {
        console.log(e);
    }

    back(){
        this.onBack.emit();
    }
}
