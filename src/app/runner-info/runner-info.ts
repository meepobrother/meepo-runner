import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'runner-info',
    templateUrl: './runner-info.html'
})
export class RunnerInfoComponent implements OnInit {
    showOrderDetail: boolean = false;
    constructor() { }

    ngOnInit() { }

    switchShowOrderDetail(){}
}

