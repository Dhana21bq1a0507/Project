import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { MatTabsModule } from '@angular/material/tabs';
import { AppRoutingModule,routingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FirstpageComponent } from './firstpage/firstpage.component';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { HomepageComponent } from './homepage/homepage.component';
import { SearchPipe } from './search.pipe';
import { FormsModule } from '@angular/forms';
import { ParticularMovieComponent } from './particular-movie/particular-movie.component';
import { StateService } from './state.service';
import { BookticketComponent } from './bookticket/bookticket.component';
import { AdminhomeComponent } from './adminhome/adminhome.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    routingModule,
    AppComponent,
    FirstpageComponent,
    HomepageComponent,
    SearchPipe,
    ParticularMovieComponent,
    BookticketComponent,
    AdminhomeComponent,
    
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
   FormsModule,
       MatTabsModule,
      ToastrModule.forRoot(),
      BrowserAnimationsModule,
  ],
  providers: [
    provideClientHydration(),
    provideHttpClient(withFetch()),
    StateService,
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
