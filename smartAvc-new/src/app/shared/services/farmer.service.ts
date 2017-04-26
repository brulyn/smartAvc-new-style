import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Farmer } from '../models/farmer';

@Injectable()

export class FarmerService {

    private farmersUrl: string = 'http://localhost:5000/api/farmers';
    constructor(private http: Http) {

    }

    /**
     * Grab all Farmers
     *  */
    getFarmers(): Observable<Farmer[]> {
        return this.http.get(this.farmersUrl)
            .map(res => res.json());
    }


    /**
     * Grab a single user
     * 
     */

    /**
     * Create a farmer
     */


    /**
     * Update a farmer
     */


    /**
     * Delete a farmer
     */


    /**
     * Handle any errors from the API
     */
    private handleError(err) {
        let errorMessage: string;

        if (err instanceof Response) {
            let body = err.json() || '';
            let error = body.error || JSON.stringify(body);
            errorMessage = `${err.status} - ${err.statusText} || } '' ${error}`;
        } else {
            errorMessage = err.message ? err.message : err.toString();
        }

        return Observable.throw(errorMessage);

        //return Observable.throw( err.json() || 'Server error.');
    }
}