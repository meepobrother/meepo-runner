import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { FormGroup, FormBuilder } from '@angular/forms';


export const runnerMapRoom = 'runnerMapRoom';
export const RUNNER_MAP_FINISH = 'RUNNER_MAP_FINISH';
export const RUNNER_MAP_SET_HEIGHT = 'RUNNER_MAP_SET_HEIGHT';
export const RUNNER_MAP_SET_START = 'RUNNER_MAP_SET_START';
export const RUNNER_MAP_SET_END = 'RUNNER_MAP_SET_END';
export const RUNNER_MAP_TIME_PICKER = 'RUNNER_MAP_TIME_PICKER';
export const RUNNER_MAP_SELECT_ADDRESS = 'RUNNER_MAP_SELECT_ADDRESS';
export const RUNNER_MAP_MY_LOCATION = 'RUNNER_MAP_MY_LOCATION';
export const RUNNER_MAP_INIT = 'RUNNER_MAP_INIT';
export const RUNNER_MAP_SET_START_LOAING = 'RUNNER_MAP_SET_START_LOAING';
export const RUNNER_MAP_SET_END_LOAING = 'RUNNER_MAP_SET_END_LOAING';
export const RUNNER_MAP_VALUE_CHANGES = 'RUNNER_MAP_VALUE_CHANGES';

import { SocketService } from 'meepo-event';
@Component({
    selector: 'runner-map',
    templateUrl: './runner-map.html',
    styleUrls: ['./runner-map.scss']
})
export class RunnerMapComponent {
    startLoading: boolean = true;
    startSetting: any;
    start: any;

    endLoading: boolean = true;
    endSetting: any;
    end: any;

    weightSetting: any;

    form: FormGroup;

    btnTitle: string;
    constructor(
        public event: SocketService,
        public fb: FormBuilder
    ) {
        this.form = this.fb.group({
            start: [''],
            end: [''],
            time: [''],
            weight: ['']
        });
        this.on((res: any) => {
            switch (res.type) {
                case RUNNER_MAP_SET_START:
                    this.form.get('start').setValue(res.data);
                    this.startLoading = false;
                    this.start = res.data;
                    break;
                case RUNNER_MAP_SET_END:
                    this.form.get('end').setValue(res.data);
                    this.endLoading = false;
                    this.end = res.data;
                    break;
                case RUNNER_MAP_SET_START_LOAING:
                    this.startLoading = res.data;
                    break;
                case RUNNER_MAP_SET_END_LOAING:
                    this.endLoading = res.data;
                    break;
                case RUNNER_MAP_INIT:
                    let { setting } = res.data;
                    this.startSetting = setting.start;
                    this.endSetting = setting.end;
                    this.weightSetting = setting.weight;
                    break;
                default:
                    break;
            }
        });

        this.form.valueChanges.subscribe(res => {
            this.emit({
                type: RUNNER_MAP_VALUE_CHANGES,
                data: res
            });
        });
    }

    private on(fn: Function) {
        this.event.on(runnerMapRoom, fn);
    }

    private emit(data: any) {
        this.event.emit(runnerMapRoom, data);
    }

    onStartAddressSelect() {
        this.emit({ type: RUNNER_MAP_SELECT_ADDRESS, data: 'start' });
    }

    onEndAddressSelect() {
        this.emit({ type: RUNNER_MAP_SELECT_ADDRESS, data: 'end' });
    }

    setWeight(e: any) {
        this.emit({ type: RUNNER_MAP_SET_HEIGHT, data: '' });
    }

    onTimePicker(e: any) {
        this.emit({ type: RUNNER_MAP_TIME_PICKER, data: e });
    }

    myLocation(e: any, isStart: boolean = true) {
        this.emit({ type: RUNNER_MAP_MY_LOCATION, data: isStart });
    }

    onPicker(e: any) {
        this.form.get('time').setValue(e);
    }
}