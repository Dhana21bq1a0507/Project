import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { StateService } from '../state.service'
import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-firstpage',
  templateUrl: './firstpage.component.html',
  styleUrls: ['./firstpage.component.css']
})
export class FirstpageComponent {
  public signin: number = 0;
  public signup: number = 0;
  userdetail: any = {
    email: String,
    password: String,
  };
  insertuserdetail: any = {
    username: String,
    email: String,
    password: String,
  };

  constructor(private http: HttpClient, private router: Router,private stateserv:StateService,private toastr:ToastrService) { }

  signinbtn() {
    this.signin = 1;
    this.signup = 0;
  }

  removesignin() {
    this.signin = 0;
  }

  signupbtn() {
    this.signup = 1;
    this.signin = 0;
  }

  removesignup() {
    this.signup = 0;
  }

  login(email: String, password: String) {
    //alert('Login method called'); // Debug statement
    this.userdetail.username="";
    this.userdetail.email = email;
    this.userdetail.password = password;
    if(email==""){
      this.toastr.warning('Error', 'Please Enter email', {
        timeOut: 5000, 
        closeButton: true,
      });
    }else if(password==""){
      this.toastr.warning('Error', 'Please Enter password', {
        timeOut: 5000, 
        closeButton: true // Enables the close button
      });
    }else{
    this.http.post("http://localhost:5149/Product/login", this.userdetail).subscribe((res: any) => {
   
      if (res.message == "Successfully Login") {
       // alert(res.username);
        this.stateserv.set('firstpage',{username:res.username})
        
        this.toastr.success('Success', 'Successfully Login', {
          timeOut: 5000, 
          closeButton: true // Enables the close button
        });
        this.router.navigate(['/homepage']);
      } else {
        this.toastr.error('Error', 'Invalid Details', {
          timeOut: 5000, 
          closeButton: true // Enables the close button
        });
        
      }
    });
  }
}

adminlogin(email: String, password: String) {
  //console.log('Admin Login method called'); // Debug statement
  this.userdetail.username="";
  this.userdetail.email = email;
  this.userdetail.password = password;
  
  if(email==""){
    this.toastr.warning('Error', 'Please Enter email', {
      timeOut: 5000, 
      closeButton: true,
    });
  }else if(password==""){
    this.toastr.warning('Error', 'Please Enter password', {
      timeOut: 5000, 
      closeButton: true // Enables the close button
    });
  }else{
  this.http.post("http://localhost:5149/Product/adminlogin", this.userdetail).subscribe((res: any) => {
   // alert(res.message)
    if (res.message == "Successfully Login") {
      this.toastr.success('Success', 'Successfully Login', {
        timeOut: 5000, 
        closeButton: true // Enables the close button
      });
      this.router.navigate(['/adminpage']);
    } else {
      this.toastr.error('Error', 'Invalid Details', {
        timeOut: 5000, 
        closeButton: true // Enables the close button
      });
     
    }
  });
}
}

register(username: String, email: String, password: String) {
  this.insertuserdetail.username = username;
  this.insertuserdetail.email = email;
  this.insertuserdetail.password = password;
  if(username==""){
    this.toastr.warning('Error', 'Please Enter username', {
      timeOut: 5000, 
      closeButton: true,
    });
  }else if(email==""){
    this.toastr.warning('Error', 'Please Enter email', {
      timeOut: 5000, 
      closeButton: true // Enables the close button
    });
  }
  else if(password==""){
    this.toastr.warning('Error', 'Please Enter password', {
      timeOut: 5000, 
      closeButton: true // Enables the close button
    });
  }
  else{
  this.http.post("http://localhost:5149/Product/register", this.insertuserdetail).subscribe((res: any) => {
    alert(res.message);
    if (res.message == "Successfully Registered") {
      this.toastr.success('Success', 'Successfully Register', {
        timeOut: 5000, 
        closeButton: true // Enables the close button
      });
      this.router.navigate(['/homepage']);
    } else {
      this.toastr.error('Error', 'User already exists! please Login', {
        timeOut: 5000, 
        closeButton: true // Enables the close button
      });
    }
  });
}
}
login123() {
  alert('User Login method called');
}

adminlogin123() {
  alert('Admin Login method called');
}
}
