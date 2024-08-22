import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { StateService } from '../state.service';

interface TheaterDetailsSchema {
  theatername: string;
  time: string;
  seats: string;
  price: string;
  allotseats: string;
  district: string;
  address: string;
  movieTitle: string;
  date: string;
}

@Component({
  selector: 'app-bookticket',
  templateUrl: './bookticket.component.html',
  styleUrls: ['./bookticket.component.css'] // corrected "styleUrl" to "styleUrls"
})
export class BookticketComponent {
  public theatredetails: TheaterDetailsSchema[] = [];
  public rows = Array(7);
  public alphabetArray: string[] = [];
  public selectedSeats: string[] = [];
  public storedselectedSeats: string[] = [];
  public amount:number=0;
  public conformdiv:boolean=false;
  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService,
    private stateserv: StateService
  ) {
    for (let i = 65; i < 65 + 7; i++) { 
      this.alphabetArray.push(String.fromCharCode(i));
    }

    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      console.log('Navigation state:', navigation.extras.state);
      this.theatredetails = navigation.extras.state as TheaterDetailsSchema[];
    } else {
      console.warn('No state passed during navigation');
    }
    this.getbookticketseats()
  }
  onSeatClick(seatId: string): void {
   if(!this.isStoredSeatSelected(seatId)){
    const index = this.selectedSeats.indexOf(seatId);
    if (index > -1) {
      
      this.selectedSeats.splice(index, 1);
    } else {
     
      this.selectedSeats.push(seatId);
    }
   
    this.amount=parseInt(this.theatredetails[0].price)*this.selectedSeats.length;
 
  }
  }

  isSeatSelected(seatId: string): boolean {
    return this.selectedSeats.includes(seatId)== true && this.storedselectedSeats.includes(seatId)==false;
  }
  isStoredSeatSelected(seatId: string): boolean {
    return this.storedselectedSeats.includes(seatId);
  }
  getbookticketseats(){
    this.http.post("http://localhost:5149/Product/getbookingtickets",this.theatredetails[0]).subscribe((res:any)=>{
      this.storedselectedSeats=res.message;
      
    })
    this.amount=parseInt(this.theatredetails[0].price)*this.selectedSeats.length;
  }

payment(){
  if(this.selectedSeats.length==0){
    this.toastr.error('Error', 'Please select the seats', {
      timeOut: 3000, 
      closeButton: true // Enables the close button
    });
  }else{
  this.conformdiv=true;
  }
}
cancelbtn(){
  this.conformdiv=false;
}
  conformbtn(){
   
    this.http.post("http://localhost:5149/Product/bookticket",{details:this.theatredetails[0],setnumbers:this.selectedSeats}).subscribe((res:any)=>{
      if(res.message=="Successfully booked"){
        this.toastr.success('Success', 'Tickets Book Successfully', {
          timeOut: 3000, 
          closeButton: true // Enables the close button
        });
        this.amount=0;
      this.conformdiv=false;
      this.getbookticketseats();
      }else{
       
        this.toastr.error('Error', res.message, {
          timeOut: 3000, 
          closeButton: true // Enables the close button
        });
      }})

  }
}
