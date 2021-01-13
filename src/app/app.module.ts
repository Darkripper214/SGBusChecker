import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HeaderComponent } from './component/header/header.component';
import { SearchComponent } from './component/bus/search/search.component';
import { BusstopComponent } from './component/bus/busstop/busstop.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './routes/appRouting.module';
import { BusstoplistComponent } from './component/busstoplist/busstoplist.component';
import { SanitizeUrlPipe } from './util/pipe/sanitizeUrl.pipe';
import { BusArrivalComponent } from './component/bus-arrival/bus-arrival.component';
import { LoginComponent } from './component/user/login/login.component';
import { ProfileComponent } from './component/user/profile/profile.component';
import { SignupComponent } from './component/user/signup/signup.component';
import { ArrivalTimePipe } from './util/pipe/toArrivalTime.pipe';

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
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
