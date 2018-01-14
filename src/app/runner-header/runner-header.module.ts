import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SocketModule } from 'meepo-event';
import { runnerHeaderRoom, RunnerHeaderComponent } from './runner-header';

@NgModule({
    imports: [
        SocketModule.forChild({ name: runnerHeaderRoom }),
        CommonModule
    ],
    exports: [
        RunnerHeaderComponent
    ],
    declarations: [
        RunnerHeaderComponent
    ],
    providers: []
})
export class RunnerHeaderModule { }

export {
    runnerHeaderRoom,
    RunnerHeaderComponent,
    RunnerHeaderItem,
    RunnerNavItem,
    RUNNER_HEADER_CLICK_HEADER_ITEM,
    RUNNER_HEADER_CLICK_LEFT,
    RUNNER_HEADER_CLICK_NAV_ITEM,
    RUNNER_HEADER_CLICK_RIGHT,
    RUNNER_HEADER_INIT
} from './runner-header';
