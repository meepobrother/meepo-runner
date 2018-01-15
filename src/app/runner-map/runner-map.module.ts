import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RunnerMapComponent, runnerMapRoom } from './runner-map';
import { SocketModule } from 'meepo-event';
import { PickerModule } from 'meepo-picker';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        SocketModule.forRoot({name: runnerMapRoom}),
        PickerModule,
        ReactiveFormsModule
    ],
    exports: [
        RunnerMapComponent,
    ],
    declarations: [
        RunnerMapComponent,
    ],
    providers: [],
})
export class RunnerMapModule { }
