import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { combineLatest } from 'rxjs';
import { FirstpageComponent } from './firstpage/firstpage.component';
import { HomepageComponent } from './homepage/homepage.component';
import { ParticularMovieComponent } from './particular-movie/particular-movie.component';
import { AdminhomeComponent } from './adminhome/adminhome.component';
import { BookticketComponent } from './bookticket/bookticket.component';

const routes: Routes = [
  {
    path:"homepage",component:HomepageComponent
  },
  {
    path:'',component:FirstpageComponent
  },
  {
    path:'firstpage',component:FirstpageComponent
  },
  {
    path:'movies/:name',component:ParticularMovieComponent
  },
  {
    path:'adminpage',component:AdminhomeComponent
  },
  {
    path:'bookticket',component:BookticketComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
export const routingModule=[FirstpageComponent,HomepageComponent,ParticularMovieComponent,AdminhomeComponent,BookticketComponent]

//   movies/:name