import { Component, OnInit, Input, Output } from '@angular/core';

@Component({
    selector: 'runner-task-view',
    templateUrl: './runner-task-view.html',
    styleUrls: [
        './runner-task-view.scss'
    ]
})

export class RunnerTaskViewComponent implements OnInit {
    @Input() type: string;
    @Input() detail: any;
    
    constructor() { }

    ngOnInit() { }
}