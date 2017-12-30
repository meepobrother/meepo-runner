import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
@Component({
    selector: 'runner-time',
    templateUrl: './runner-time.html',
    styleUrls: ['./runner-time.scss']
})

export class RunnerTimeComponent implements OnInit {
    @Input() isCoach: boolean = false;
    @Output() onPicker: EventEmitter<any> = new EventEmitter();
    constructor() { }

    ngOnInit() { }

    doNow() {
        this.isCoach = false;
    }

    doCoach() {
        this.isCoach = true;
    }

    timePicker(e: any) {
        this.onPicker.emit(e);
    }
}