import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { RunnerModule } from '../../src/app/app';
import { MeepoBmapModule } from 'meepo-bmap';
import { MeepoFormsModule } from 'meepo-forms';
import { MeepoCoreModule } from 'meepo-core';
import { PopoverModule } from 'meepo-popover';
import { SocketModule } from 'meepo-event';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    RunnerModule,
    MeepoBmapModule,
    MeepoFormsModule,
    MeepoCoreModule,
    PopoverModule,
    SocketModule.forRoot({ name: 'root' })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

