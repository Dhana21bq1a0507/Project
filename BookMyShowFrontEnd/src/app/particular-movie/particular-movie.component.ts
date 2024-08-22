import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { StateService } from '../state.service';
interface MovieDetails {
  title: String,
  imagelink: String,
  imagelink2:string,
  trailervideolink: string,
  heroname: String,
  heroinename: String,
  district: String,
  herolink:String,
heroinelink:String,
directorname:String,
directorlink:String,
producername:String,
producerlink:String,
musicname:String,
musiclink:String,
}
interface theaterdetailsSchema{
  theatername:String,
  time:String,
  seats:string,
  price:String,
  allotseats:string,
  district:String,
  address:String,
  movieTitle:String,
   date:String;
}
@Component({
  selector: 'app-particular-movie',
  templateUrl: './particular-movie.component.html',
  styleUrls: ['./particular-movie.component.css']
})
export class ParticularMovieComponent {
  public movielist: MovieDetails[] = [];
  public sanitizedTrailerLink: SafeResourceUrl | null = null;
    public alltheatredetails: theaterdetailsSchema[] = [];
public showthreatrediv:boolean=false;
public conformdiv:boolean=false;
public loginUsername:String="";
public booktheatredetails:theaterdetailsSchema[]=[];
  constructor(private http: HttpClient, private router: Router, private sanitizer: DomSanitizer,private toastr:ToastrService,private stateserv:StateService,) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      console.log('Navigation state:', navigation.extras.state);
      this.movielist = navigation.extras.state as MovieDetails[];
      if (this.movielist.length > 0) {
        this.sanitizeTrailerLink(this.movielist[0].trailervideolink);
      }
    } else {
      console.warn('No state passed during navigation');
    }
  }

  ngOnInit(): void {
    const savedState=this.stateserv.get('particular-movie');
    const savedUsername=this.stateserv.get('firstpage');
    if(savedUsername){
        this.loginUsername=savedUsername.username;
    }
   // alert(this.loginUsername);
    if(savedState){
      this.movielist=savedState.movielist,
      this.sanitizedTrailerLink=savedState.sanitizedTrailerLink,
      this.alltheatredetails=savedState.alltheatredetails,
      this.showthreatrediv=savedState.showthreatrediv,
      this.booktheatredetails=savedState.booktheatredetails
      this.showtheatre();
    }
  }
showtheatre(){
 this.showthreatrediv=true;
  //this.conformdiv=true;
  this.http.post<theaterdetailsSchema[]>("http://localhost:5149/Product/gettheatredetails", {  movietitle:this.movielist[0].title}).subscribe((res: theaterdetailsSchema[]) => {
    this.alltheatredetails= res;
  
  });
}
bookticketbtn(e:theaterdetailsSchema){
this.booktheatredetails[0]=e;
//this.conformdiv=true;
//this.showthreatrediv=false;
this.stateserv.set('particular-movie',{
  movielist:this.movielist,
  sanitizedTrailerLink:this.sanitizedTrailerLink,
  alltheatredetails:this.alltheatredetails,
  showthreatrediv:this.showthreatrediv,
  booktheatredetails:this.booktheatredetails
})
this.router.navigate(['/bookticket'],{state:[e]});
return false;
//alert(this.conformdiv+""+this.showthreatrediv);
}
removeconfirmticket(){
  this.conformdiv=false;
  this.showthreatrediv=true;
}


conformbtn(noOfSeats: string) { // Use the primitive `string` type
  // Convert the input values to numbers
  const allottedSeats = parseInt(this.booktheatredetails[0].allotseats, 10);
  const totalSeats = parseInt(this.booktheatredetails[0].seats, 10);
  const seatsToBook = parseInt(noOfSeats, 10);
  if (allottedSeats + seatsToBook <= totalSeats) {
    const s=allottedSeats+seatsToBook;
    this.booktheatredetails[0].allotseats=s.toString();
    this.http.post("http://localhost:5149/Product/updateallotseats",this.booktheatredetails[0]).subscribe((res: any) => {
      if (res.message == "Successfully updated") {
        this.toastr.success('Success', 'Booking confirmed', {
          timeOut: 5000, 
          closeButton: true
        });
        this.removeconfirmticket();
        this.showtheatre();
      }
    });
    
  } else {
    this.toastr.error('Error', 'Not enough seats available', {
      timeOut: 5000, 
      closeButton: true
    });
  }
}


removeshowdetails(){
  this.showthreatrediv=false;
}

  sanitizeTrailerLink(trailerLink: string): void {
    this.sanitizedTrailerLink = this.sanitizer.bypassSecurityTrustResourceUrl(trailerLink);
  }

  getBackgroundStyles(imageUrl: string): any {
    return {
      'background-image': `linear-gradient(to right, black 0%, rgba(0, 0, 0, 0) 100%), url('${imageUrl}')`,
      'background-size': 'cover',
    'background-position': 'center center',
    'height': '48rem',
    'width': '100%',
    'background-repeat': 'no-repeat'
    };
  }
}
