import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HeaderComponent } from './component/header/header.component';
import { SearchComponent } from './component/bus/search/search.component';
import { BusstopComponent } from './component/bus/busstop/busstop.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './routes/appRouting.module';
import { BusstoplistComponent } from './component/busstoplist/busstoplist.component';
import { SanitizeUrlPipe } from './util/pipe/sanitizeUrl.pipe';
import { BusArrivalComponent } from './component/bus-arrival/bus-arrival.component';
import { LoginComponent } from './component/user/login/login.component';
import { ProfileComponent } from './component/user/profile/profile.component';
import { SignupComponent } from './component/user/signup/signup.component';
import { ArrivalTimePipe } from './util/pipe/toArrivalTime.pipe';
import { ActivationComponent } from './component/user/activation/activation.component';
import { LoaderInterceptor } from './util/functions/HTTP-interceptor';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SearchComponent,
    BusstopComponent,
    BusstoplistComponent,
    SanitizeUrlPipe,
    BusArrivalComponent,
    LoginComponent,
    ProfileComponent,
    SignupComponent,
    ArrivalTimePipe,
    ActivationComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
