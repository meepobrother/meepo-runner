import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'runner-money',
    templateUrl: './runner-money.html'
})

export class RunnnerMoneyComponent implements OnInit {
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