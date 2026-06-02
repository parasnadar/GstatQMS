import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}
  // private localApiUrl = 'http://localhost:8090/api';
  // private uatApiUrl = 'https://uat-efiling.gstat.gov.in/qms/api';

  private uatApiUrl = environment.uatApiUrl;

  getCaptcha() {
    const headers = new HttpHeaders({
      'X-APP-ID': 'frontend-web',
      'X-API-KEY': 'xRYWK5SG6APhVCxCXfLaEUhtt0Q0nzeJBfYwg5sWK68',
    });

    return this.http.get(`${this.uatApiUrl}/auth/captcha`, { headers });
  }

  //Reserve Token
  verifyGst(gstNo: string, captcha: string, token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-APP-ID': 'frontend-web',
      'X-API-KEY': 'xRYWK5SG6APhVCxCXfLaEUhtt0Q0nzeJBfYwg5sWK68',
    });

    const payload = {
      gstNo: gstNo,
      captcha: captcha,
      token: token,
    };

    return this.http.post(`${this.uatApiUrl}/gst/verify`, payload, {
      headers,
      observe: 'response',
    });
  }

  getAvailableSlots(date: string) {
    const headers = new HttpHeaders({
      'X-APP-ID': 'frontend-web',
      'X-API-KEY': 'xRYWK5SG6APhVCxCXfLaEUhtt0Q0nzeJBfYwg5sWK68',
    });

    return this.http.get<any>(`${this.uatApiUrl}/slots/${date}`, {
      headers: headers,
      observe: 'response',
      responseType: 'json',
    });
  }

  confirmSlot(
    gstNo: string,
    date: any,
    startTime: any,
    otp: string,
    token: string,
  ): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-APP-ID': 'frontend-web',
      'X-API-KEY': 'xRYWK5SG6APhVCxCXfLaEUhtt0Q0nzeJBfYwg5sWK68',
    });

    const payload = {
      gstNo: gstNo,
      date: date,
      startTime: startTime,
      otp: otp,
      token: token,
    };

    return this.http.post(`${this.uatApiUrl}/slots/book`, payload, {
      headers,

      observe: 'response', // Allows us to see the HTTP 200 status
    });
  }

  //Track status

  searchByGstin(
    gstNo: string,
    captchaToken: string,
    captcha: string,
  ): Observable<any> {
    const headers = new HttpHeaders({
      'X-APP-ID': 'frontend-web',
      'X-API-KEY': 'xRYWK5SG6APhVCxCXfLaEUhtt0Q0nzeJBfYwg5sWK68',
    });

    return this.http.get(`${this.uatApiUrl}/slots/by-user/${gstNo}`, {
      headers: headers,
      params: { token: captchaToken, captcha: captcha },
      observe: 'response',
    });
  }

  searchByTempNo(
    tempNo: string,
    captchaToken: string,
    captcha: string,
  ): Observable<any> {
    const headers = new HttpHeaders({
      'X-APP-ID': 'frontend-web',
      'X-API-KEY': 'xRYWK5SG6APhVCxCXfLaEUhtt0Q0nzeJBfYwg5sWK68',
    });
    return this.http.get(`${this.uatApiUrl}/slots/by-confirm-token/${tempNo}`, {
      headers: headers,
      params: { token: captchaToken, captcha: captcha },
      observe: 'response',
    });
  }
}
