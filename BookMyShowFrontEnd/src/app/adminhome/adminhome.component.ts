import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { StateService } from '../state.service';
import { ToastrService } from 'ngx-toastr';
interface State {
  state_id: number;
  state_name: string;
}

interface District {
  district_id: number;
  district_name: string;
}
interface theaterdetailsSchema{
  theatername:String,
  time:String,
  seats:String,
  price:String,
  allotseats:String,
  district:String,
  address:String,
  movieTitle:String,
   date:String;
}
interface MovieDetails {
  title: String,
  imagelink: String,
  imagelink2:String,
  trailervideolink: String,
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

interface StatesResponse {
  states: State[];
}

interface DistrictsResponse {
  districts: District[];
}

@Component({
  selector: 'app-adminhome',
  templateUrl: './adminhome.component.html',
  styleUrls: ['./adminhome.component.css']
})
export class AdminhomeComponent implements OnInit {
  public districtsdisplay: boolean = false;
  public locationselect: boolean = true;
  public newmovie: boolean = false;
  public showtheatrediv:boolean=false;
  public addtheater: boolean = false;
  public selectedMovieIndex: number | null = null;
  public selectedMovieSubIndex: number | null = null;
  slides: any[][] = [];
  public districts: District[] = [];
  public searchText: string = '';
  public locationname: string = '';
  public moviedetaileslist: MovieDetails[] = [];
  public alltheatredetails: theaterdetailsSchema[] = [];
  public selectedMovieTitle: string = '';
  public conformdiv:boolean=false;
  public theaterdetails:any={
    theatername:String,
    time:String,
    seats:String,
    price:String,
    allotseats:String,
    district:String,
    address:String,
    movietitle:String,
    date:String,
  }
  public addmoviedetailes:any={
    title: String,
    imagelink: String,
    imagelink2:String,
    trailervideolink: String,
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
  @ViewChild('searchTextInput') searchTextInput!: ElementRef;

  constructor(private http: HttpClient, private router: Router, private stateserv: StateService,private toastr: ToastrService) {}

  ngOnInit(): void {
    const savedState = this.stateserv.get('adminhome');
    if (savedState) {
      this.districts = savedState.districts;
      this.searchText = savedState.searchText;
      this.locationname = savedState.locationname;
      this.moviedetaileslist = savedState.moviedetaileslist;
      this.districtsdisplay = savedState.districtsdisplay;
      this.locationselect = savedState.locationselect;
    }
  }

  getAllStates() {
    this.http.get<StatesResponse>("https://cdn-api.co-vin.in/api/v2/admin/location/states").subscribe((res: StatesResponse) => {
      const states = res.states;
      states.forEach((state: State) => {
        this.getDistricts(state.state_id).subscribe((districtRes: DistrictsResponse) => {
          this.districts.push(...districtRes.districts);
          this.districts.sort((a, b) => a.district_name.localeCompare(b.district_name));
        });
      });
      this.districtsdisplay = true;
    });
  }

  getmoviedetailes(): void {
   
    this.http.post<MovieDetails[]>("http://localhost:5149/Product/getmoviedetails", { district: this.locationname }).subscribe((res: MovieDetails[]) => {
     
      this.moviedetaileslist = res;
      if (this.moviedetaileslist && this.moviedetaileslist.length > 0) {
       
           this.slides = this.getSlides();
       } else {
        this.toastr.warning('Warning', 'No movies found in the specified district', {
          timeOut: 3000, 
          closeButton: true // Enables the close button
        });
           this.moviedetaileslist = []; 
           this.slides = []; 
       }
       
    });
  }

  getDistricts(stateId: number): Observable<DistrictsResponse> {
    return this.http.get<DistrictsResponse>(`https://cdn-api.co-vin.in/api/v2/admin/location/districts/${stateId}`);
  }

  hideDetails() {
    this.districtsdisplay = false;
  }

  onSearchChange() {
    this.searchText = this.searchTextInput.nativeElement.value.toLowerCase();
  }
  removeshowdetails(){
    this.showtheatrediv=false;
  }
  location(district: string) {
    this.locationname = district;
    this.locationselect = false;
    this.getmoviedetailes();
  }
  showTheatre(e:string): void {
  
    this.selectedMovieIndex = null;
    this.selectedMovieSubIndex = null;
  this.showtheatrediv=true;
  this.selectedMovieTitle = e;
  this.http.post<theaterdetailsSchema[]>("http://localhost:5149/Product/gettheatredetails", { movietitle:e}).subscribe((res: theaterdetailsSchema[]) => {
    if(res.length>0){
      
    this.alltheatredetails= res;
    }else{
      this.alltheatredetails=[];
    }
  
  });
 
  }


  displaylocationfield() {
    this.locationselect = true;
  }

  get filteredDistricts() {
    if (!this.searchText) {
      return this.districts;
    }
    return this.districts.filter(district => 
      district.district_name.toLowerCase().includes(this.searchText)
    );
  }

  toggleOption(slideIndex: number, itemIndex: number): void {
    if (this.selectedMovieIndex === slideIndex && this.selectedMovieSubIndex === itemIndex) {
      this.selectedMovieIndex = null;
      this.selectedMovieSubIndex = null;
    } else {
      this.selectedMovieIndex = slideIndex;
      this.selectedMovieSubIndex = itemIndex;
    }
  }

  deleteMovie(slideIndex: number, itemIndex: number,e:string): void {
    this.selectedMovieIndex = null;
    this.selectedMovieSubIndex = null;
    this.conformdiv=true;
  this.selectedMovieTitle=e;
    }
    cancelbtn(){
this.conformdiv=false;
    }
  
    conformbtn(){
      this.conformdiv=false;
      this.http.post("http://localhost:5149/Product/deletemovie",{movietitle:this.selectedMovieTitle}).subscribe((res:any)=>{
        if(res.message=="Successfully Deleted"){
        

            this.toastr.success('Success', 'Movie deleted successfully', {
              timeOut: 3000, 
              closeButton: true // Enables the close button
            });
          
          this.getmoviedetailes();
        }else{
          this.toastr.error('Error', 'Movie not  deleted ', {
            timeOut: 3000, 
            closeButton: true // Enables the close button
          });
        
        }})
    }
    deletetheater(e: String,event?:Event): void {
      if (event) {
        event.preventDefault(); // Prevent default navigation, if needed
    }
      this.selectedMovieIndex = null;
      this.selectedMovieSubIndex = null;
      
      this.http.post("http://localhost:5149/Product/deletetheatre", 
      { 
          theatername: e, 
          movietitle: this.selectedMovieTitle,
          location: this.locationname 
      })
      .subscribe({
          next: (res: any) => {
          
              if (res.message === "Successfully Deleted") {

                  this.toastr.success('Success', 'Theater deleted successfully', {
                      timeOut: 3000, 
                      closeButton: true
                  });
                  this.showTheatre(this.selectedMovieTitle);
               
              } else {
                this.toastr.error('Error', 'Theater not  deleted', {
                  timeOut: 3000, 
                  closeButton: true
              });
              }
          },
          error: (error: any) => {
              console.error('Error:', error);
              this.toastr.error('Error', 'Failed to delete theater', {
                  timeOut: 3000, 
                  closeButton: true
              });
          },
          complete: () => {
              console.log('Delete theater request completed');
          }
      });
  }
  
  
  removecross(){
    this.selectedMovieIndex = null;
    this.selectedMovieSubIndex = null;
  }
  removeaddteatermovie(){
    this.addtheater=false;
  }
  addMovie(movieTitle:string): void {
    this.selectedMovieIndex = null;
    this.selectedMovieSubIndex = null;
    this.addtheater=true;
    this.selectedMovieTitle = movieTitle;
   
  }

  getSlides(): any[][] {
    const slides: any[][] = [];
    const itemsPerSlide = 4;
    let totalItems = this.moviedetaileslist.length;
    let k = 0;
    if(this.moviedetaileslist.length>0){ 
     if(this.moviedetaileslist.length<=4){
      const slide = [];
      for (let j = 0; j < this.moviedetaileslist.length; j++) {
        slide.push(this.moviedetaileslist[j]);
      }
      slides.push(slide);
      return slides;
     }
    while (totalItems - itemsPerSlide >= 0) {
      const slide = [];
      for (let j = k; j < k + itemsPerSlide; j++) {
        slide.push(this.moviedetaileslist[j]);
      }
      slides.push(slide);
      k += itemsPerSlide;
      totalItems -= itemsPerSlide;
    }
    if (totalItems > 0) {
      const slide = [];
      for (let j = (k+totalItems-itemsPerSlide); j < this.moviedetaileslist.length; j++) {
        slide.push(this.moviedetaileslist[j]);
      }
      slides.push(slide);
    }
        
  return slides;
    }
    return slides;
}
  addnewmovie(){
this.newmovie=true
  }
  removeaddmovie(){
    this.newmovie=false;
  }
  addmoviebtn(title:String,link:String,link2:String,trailer:String,hero:String,heroine:String,herolink:String,heroinelink:String,director:String,directorlink:String,producer:String,producerlink:String,music:String,musiclink:String){
    this.addmoviedetailes.title=title;
    this.addmoviedetailes.imagelink=link;
    this.addmoviedetailes.imagelink2=link2;
    this.addmoviedetailes.trailervideolink=trailer;
    this.addmoviedetailes.heroname=hero;
    this.addmoviedetailes.heroinename=heroine;
    this.addmoviedetailes.district=this.locationname;
    this.addmoviedetailes.herolink=herolink;
    this.addmoviedetailes.heroinelink=heroinelink
    this.addmoviedetailes.directorname=director;
    this.addmoviedetailes.directorlink=directorlink;
    this.addmoviedetailes.producername=producerlink;
    this.addmoviedetailes.producerlink=producerlink;
    this.addmoviedetailes.musicname=music;
    this.addmoviedetailes.musiclink=musiclink;
    this.http.post("http://localhost:5149/Product/addnewmovie",this.addmoviedetailes).subscribe((res:any)=>{
      if(res.message=="Successfully Added"){
       
        this.newmovie=false
        this.getmoviedetailes();
        // this.toastr.success('Successfully Added');
        this.toastr.success('Success', 'Movie Added successfully', {
          timeOut: 3000, 
          closeButton: true // Enables the close button
        });
      
      }else{
        //this.toastr.error(res.message);
        this.toastr.error('Error', 'Movie not Added', {
          timeOut: 3000, 
          closeButton: true // Enables the close button
        });
      }})
     
  }
  addTheaterbtn(theater:String,address:String,time:String,seats:String,price:String,date:String){
    this.theaterdetails.theatername=theater;
    this.theaterdetails.time=time;
    this.theaterdetails.seats=seats;
    this.theaterdetails.price=price;
    this.theaterdetails.district=this.locationname;
    this.theaterdetails.allotseats="";
    this.theaterdetails.address=address;
    this.theaterdetails.date=date
    this.theaterdetails.movietitle = this.selectedMovieTitle; 
    this.http.post("http://localhost:5149/Product/addtheater",this.theaterdetails).subscribe((res:any)=>{
      if(res.message=="Successfully Added"){
        this.addtheater=false;
        this.toastr.success('Success', 'Booksuccessfully', {
          timeOut: 3000, 
          closeButton: true // Enables the close button
        });
      
      }else{
       
        this.toastr.error('Error', 'Theater not added ', {
          timeOut: 3000, 
          closeButton: true // Enables the close button
        });
      }})

  }
}
