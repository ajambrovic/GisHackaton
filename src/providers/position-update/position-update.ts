import { Injectable } from '@angular/core';
import { Api } from "../providers";
import { HttpHeaders, HttpParams } from "@angular/common/http";

declare var ol: any;
/*
  Generated class for the PositionUpdateProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PositionUpdateProvider {

  constructor(public api: Api) { }


  /**
   * Send a POST request to our update position endpoint
   */
  updatePosition(endpointData: any) {
    var params = new HttpHeaders();

    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'), responseType: 'text'
    };
    const coords = ol.proj.transform([endpointData.coords['longitude'], endpointData.coords['latitude']], 'EPSG:4326', 'EPSG:3857').map(element => {
      return element.toFixed();
    });
    let body = new HttpParams();
    body = body.append('coordinates', coords[0]);
    body = body.append('coordinates', coords[1]);
    body = body.set('objectId', '1');
    body = body.set('crsCode', '3765');

    const seq = this.api.post('user/updateObjectsPosition', body, options).share();

    seq.subscribe((res: any) => {
      // If the API returned a successful response, mark the user as logged in
      if (res) {
        console.log('Updated');
      }
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }
}
