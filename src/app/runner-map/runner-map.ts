import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { FormGroup, FormBuilder } from '@angular/forms';


export const runnerMapRoom = 'runnerMapRoom';
export const RUNNER_MAP_FINISH = 'RUNNER_MAP_FINISH';
export const RUNNER_MAP_SET_HEIGHT = 'RUNNER_MAP_SET_HEIGHT';
export const RUNNER_MAP_SET_START = 'RUNNER_MAP_SET_START';
export const RUNNER_MAP_SET_END = 'RUNNER_MAP_SET_END';
export const RUNNER_MAP_TIME_PICKER = 'RUNNER_MAP_TIME_PICKER';
export const RUNNER_MAP_SELECT_START_ADDRESS = 'RUNNER_MAP_SELECT_START_ADDRESS';
export const RUNNER_MAP_SELECT_END_ADDRESS = 'RUNNER_MAP_SELECT_END_ADDRESS';
export const RUNNER_MAP_MY_LOCATION = 'RUNNER_MAP_MY_LOCATION';

import { SocketService } from 'meepo-event';
@Component({
    selector: 'runner-map',
    templateUrl: './runner-map.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
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
            start: [{}],
            end: [{}],
            time: [{}],
            weight: ['']
        });
        this.on((res: any) => {
            switch (res.type) {
                case RUNNER_MAP_SET_START:
                    this.form.get('start').setValue(res.data);
                    break;
                case RUNNER_MAP_SET_END:
                    this.form.get('end').setValue(res.data);
                    break;
                default:
                    break;
            }
        })
    }

    private on(fn: Function) {
        this.event.on(runnerMapRoom, fn);
    }

    private emit(data: any) {
        this.event.emit(runnerMapRoom, data);
    }

    onStartAddressSelect() {
        this.emit({ type: RUNNER_MAP_SELECT_START_ADDRESS, data: '' });
    }

    onEndAddressSelect() {
        this.emit({ type: RUNNER_MAP_SELECT_END_ADDRESS, data: '' });
    }

    finish() {
        this.emit({ type: RUNNER_MAP_FINISH, data: '' });
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
}