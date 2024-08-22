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
interface moviedetailes{
  title: String,
      ImageLink: String,
      ImageLink2:String,
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
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  public districtsdisplay: boolean = false;
  public locationselect: boolean = true;
  public districts: District[] = [];
  public searchText: string = '';
  public locationname: string = '';
  public loginUsername:String='';
  public slides: any[][] = [];
  public selectedMovieIndex: number | null = null;
  public selectedMovieSubIndex: number | null = null;
  public moviedetaileslist:moviedetailes[]=[];
  @ViewChild('searchTextInput') searchTextInput!: ElementRef;

  constructor(private http: HttpClient,private router:Router,private stateserv:StateService,private toastr: ToastrService) {}
ngOnInit(): void {
    const savedState=this.stateserv.get('homepage');
    const savedUsername=this.stateserv.get('firstpage');
    if(savedUsername){
        this.loginUsername=savedUsername.username;
    }

    if(savedState){
      this.districts = savedState.districts;
      
      this.locationname = savedState.locationname;
      this.moviedetaileslist = savedState.moviedetaileslist;
      this.districtsdisplay = savedState.districtsdisplay;
      this.locationselect = savedState.locationselect;
      this.slides=savedState.slides
    }
    
}
  getAllStates() {
   // alert('click event');
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
    this.http.post<moviedetailes[]>("http://localhost:5149/Product/getmoviedetails", { district: this.locationname }).subscribe(
        (res: moviedetailes[]) => {
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
        },
        (error) => {
           console.error("Error fetching movie details:", error);
           this.moviedetaileslist = []; 
                this.slides = []; 

        }
    );
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

  location(district: string) {
    this.locationname = district;
    this.locationselect = false;
    
    this.getmoviedetailes();
  }
  displaymoviedetailes( e:moviedetailes){
    this.stateserv.set('homepage',{
      districts: this.districts,
      locationname: this.locationname,
      moviedetaileslist: this.moviedetaileslist,
      districtsdisplay: this.districtsdisplay,
      locationselect: this.locationselect,
      slides:this.slides,
    })
    
this.router.navigate(['/movies',e.title],{state:[e]});

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
  }else{

  }
  return slides;
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
}
