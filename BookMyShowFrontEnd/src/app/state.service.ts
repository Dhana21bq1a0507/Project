import { Injectable } from '@angular/core';

interface MovieDetails {
  title: string;
  image_link: string;
  trailer_video_link: string;
  hero_name: string;
  heroine_name: string;
  district: string;
}

interface Overlist {
  locationselect: boolean;
  districtsdisplay: boolean;
  locationname: string;
  moviedetaileslist: MovieDetails[];
}

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private state: { [key: string]: any } = {};

  set(key: string, value: any) {
    this.state[key] = value;
  }

  get(key: string) {
    return this.state[key];
  }
}
