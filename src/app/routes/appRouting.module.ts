import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BusstopComponent } from '../component/bus/busstop/busstop.component';
import { SearchComponent } from '../component/bus/search/search.component';
import { BusstoplistComponent } from '../component/busstoplist/busstoplist.component';
import { LoginComponent } from '../component/user/login/login.component';
import { ProfileComponent } from '../component/user/profile/profile.component';
import { SignupComponent } from '../component/user/signup/signup.component';
import { AuthGuard } from '../guard/auth.guard';

const routes: Routes = [
  { path: '', component: SearchComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'busstop', component: BusstoplistComponent },
  { path: 'busstop/:id', component: BusstopComponent },
  { path: '**', redirectTo: '/' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
