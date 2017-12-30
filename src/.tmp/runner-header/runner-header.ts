import { Component, OnInit } from '@angular/core';
@Component({
    selector: 'runner-header',
    templateUrl: './runner-header.html'
})
export class RunnerHeaderComponent implements OnInit {
    activeTitle:any ={
        items: []
    };
    headerTitles:any[] = [];
    constructor() { }

    ngOnInit() { }

    switchNotice(){}

    locationToHome(){}
}