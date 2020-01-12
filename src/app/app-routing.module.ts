import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FirstComponent } from './components/first/first.component';
import { AppComponent } from './app.component';


const routes: Routes = [
  { path: '', component:  AppComponent},
  { path: 'first', component:  FirstComponent},
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
