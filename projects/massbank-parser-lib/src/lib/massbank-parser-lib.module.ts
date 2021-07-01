import { NgModule } from '@angular/core';
import { MassbankParserLibService } from './massbank-parser-lib.service';
import {LoggerModule, NgxLoggerLevel} from "ngx-logger";


@NgModule({
  imports: [
    LoggerModule.forRoot({
      level: NgxLoggerLevel.DEBUG,
      serverLogLevel: NgxLoggerLevel.OFF
    })
  ],
  providers: [MassbankParserLibService]
})
export class MassbankParserLibModule { }
