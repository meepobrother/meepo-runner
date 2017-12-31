import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { RunnerOrderService, RunnerAppService } from '../../src/app/app';
import { Subject } from 'rxjs/Subject';
import { Widget } from '../../src/app/service/order';
import { CoreService } from 'meepo-core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  title = 'app';
  showMyTask: boolean = false;
  showMoney: boolean = false;
  showSetting: boolean = false;
  constructor(
    public order: RunnerOrderService,
    public app: RunnerAppService,
    public core: CoreService,
    public cd: ChangeDetectorRef
  ) {

  }

  ngOnInit() {
    this.app.init();

    this.core.showMenu({
      show: false,
      items: {
        task: {
          show: false,
          cb: () => {
            this.showMyTask = true;
            this.cd.markForCheck();
          }
        },
        money: {
          show: false,
          cb: () => {
            this.showMoney = true;
            this.showMyTask = false;
          }
        },
        setting: {
          show: false,
          cb: () => {
            this.showSetting = true;
          }
        }
      }
    });
  }

  onBack() {
    this.showMyTask = false;
    this.showMoney = false;
    this.showSetting = false;
  }
}
