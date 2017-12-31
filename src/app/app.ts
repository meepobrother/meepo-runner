import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RunnerAppService } from './service/app';
import { RunnerOrderService } from './service/order';
import { RunnerPayService } from './service/pay';
import { RunnerUtilService } from './service/util';


import { RunnerOrderComponent } from './runner-order/runner-order';
import { RunnerFormsComponent } from './runner-forms/runner-forms';
import { RunnerMapComponent } from './runner-map/runner-map';
import { RunnerInfoComponent } from './runner-info/runner-info';
import { RunnerHeaderComponent } from './runner-header/runner-header';
import { RunnerTimeComponent } from './runner-time/runner-time';
import { RunnerRuleComponent } from './runner-rule/runner-rule';
import { RunnerMyTasksComponent } from './runner-mytasks/runner-mytasks';
import { RunnerTaskViewComponent } from './runner-task-view/runner-task-view';
import { RunnerSettingComponent } from './runner-setting/runner-setting';
import { RunnnerMoneyComponent } from './runner-money/runner-money';

export const RunnerComponents = [
    RunnerOrderComponent,
    RunnerFormsComponent,
    RunnerMapComponent,
    RunnerInfoComponent,
    RunnerHeaderComponent,
    RunnerTimeComponent,
    RunnerRuleComponent,
    RunnerMyTasksComponent,
    RunnerTaskViewComponent,
    RunnerSettingComponent,
    RunnnerMoneyComponent
];

import { MeepoCoreServiceModule } from 'meepo-core';
import { AxiosModule } from 'meepo-axios';
import { MeepoFormsModule } from 'meepo-forms';
import { UuidModule } from 'meepo-uuid';
import { JssdkModule } from 'meepo-jssdk'; 
import { UaModule } from 'meepo-ua'; 
import { MeepoBmapModule } from 'meepo-bmap'; 
import { MeepoCoreModule } from 'meepo-core'; 
import { PickerModule } from 'meepo-picker'; 
import { XscrollModule } from 'meepo-xscroll'; 


import "rxjs/add/operator/combineLatest";
import "rxjs/add/operator/filter";
import "rxjs/add/operator/map";
import "rxjs/add/operator/do";


@NgModule({
    declarations: [
        ...RunnerComponents
    ],
    imports: [
        CommonModule, MeepoCoreServiceModule, AxiosModule,
        MeepoFormsModule, UuidModule, JssdkModule, UaModule,
        MeepoBmapModule, MeepoCoreModule, PickerModule,
        XscrollModule
    ],
    exports: [
        ...RunnerComponents
    ],
    providers: [
        RunnerAppService,
        RunnerOrderService,
        RunnerPayService,
        RunnerUtilService
    ],
})
export class RunnerModule { }

export { RunnerAppService } from './service/app';
export { RunnerOrderService } from './service/order';
export { RunnerPayService } from './service/pay';
export { RunnerUtilService } from './service/util';

