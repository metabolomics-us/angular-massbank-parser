import { NgModule } from '@angular/core';
import { MassbankParserLibService } from './massbank-parser-lib.service';
import { LoggerModule, NgxLoggerLevel } from "ngx-logger";
import * as i0 from "@angular/core";
import * as i1 from "ngx-logger";
export class MassbankParserLibModule {
}
MassbankParserLibModule.ɵmod = i0.ɵɵdefineNgModule({ type: MassbankParserLibModule });
MassbankParserLibModule.ɵinj = i0.ɵɵdefineInjector({ factory: function MassbankParserLibModule_Factory(t) { return new (t || MassbankParserLibModule)(); }, providers: [MassbankParserLibService], imports: [[
            LoggerModule.forRoot({
                level: NgxLoggerLevel.DEBUG,
                serverLogLevel: NgxLoggerLevel.OFF
            })
        ]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(MassbankParserLibModule, { imports: [i1.LoggerModule] }); })();
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(MassbankParserLibModule, [{
        type: NgModule,
        args: [{
                imports: [
                    LoggerModule.forRoot({
                        level: NgxLoggerLevel.DEBUG,
                        serverLogLevel: NgxLoggerLevel.OFF
                    })
                ],
                providers: [MassbankParserLibService]
            }]
    }], null, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFzc2JhbmstcGFyc2VyLWxpYi5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiL2hvbWUvbm9sYW4vRGV2ZWxvcG1lbnQvbW9uYS1zZXJ2aWNlcy9hbmd1bGFyLW1hc3NiYW5rLXBhcnNlci9wcm9qZWN0cy9tYXNzYmFuay1wYXJzZXItbGliL3NyYy8iLCJzb3VyY2VzIjpbImxpYi9tYXNzYmFuay1wYXJzZXItbGliLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBQ3pFLE9BQU8sRUFBQyxZQUFZLEVBQUUsY0FBYyxFQUFDLE1BQU0sWUFBWSxDQUFDOzs7QUFZeEQsTUFBTSxPQUFPLHVCQUF1Qjs7MkRBQXZCLHVCQUF1Qjs2SEFBdkIsdUJBQXVCLG1CQUZ2QixDQUFDLHdCQUF3QixDQUFDLFlBTjVCO1lBQ1AsWUFBWSxDQUFDLE9BQU8sQ0FBQztnQkFDbkIsS0FBSyxFQUFFLGNBQWMsQ0FBQyxLQUFLO2dCQUMzQixjQUFjLEVBQUUsY0FBYyxDQUFDLEdBQUc7YUFDbkMsQ0FBQztTQUNIO3dGQUdVLHVCQUF1QjtrREFBdkIsdUJBQXVCO2NBVG5DLFFBQVE7ZUFBQztnQkFDUixPQUFPLEVBQUU7b0JBQ1AsWUFBWSxDQUFDLE9BQU8sQ0FBQzt3QkFDbkIsS0FBSyxFQUFFLGNBQWMsQ0FBQyxLQUFLO3dCQUMzQixjQUFjLEVBQUUsY0FBYyxDQUFDLEdBQUc7cUJBQ25DLENBQUM7aUJBQ0g7Z0JBQ0QsU0FBUyxFQUFFLENBQUMsd0JBQXdCLENBQUM7YUFDdEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTWFzc2JhbmtQYXJzZXJMaWJTZXJ2aWNlIH0gZnJvbSAnLi9tYXNzYmFuay1wYXJzZXItbGliLnNlcnZpY2UnO1xuaW1wb3J0IHtMb2dnZXJNb2R1bGUsIE5neExvZ2dlckxldmVsfSBmcm9tIFwibmd4LWxvZ2dlclwiO1xuXG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtcbiAgICBMb2dnZXJNb2R1bGUuZm9yUm9vdCh7XG4gICAgICBsZXZlbDogTmd4TG9nZ2VyTGV2ZWwuREVCVUcsXG4gICAgICBzZXJ2ZXJMb2dMZXZlbDogTmd4TG9nZ2VyTGV2ZWwuT0ZGXG4gICAgfSlcbiAgXSxcbiAgcHJvdmlkZXJzOiBbTWFzc2JhbmtQYXJzZXJMaWJTZXJ2aWNlXVxufSlcbmV4cG9ydCBjbGFzcyBNYXNzYmFua1BhcnNlckxpYk1vZHVsZSB7IH1cbiJdfQ==