import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}
  private localApiUrl = 'http://localhost:8090/api';
  private uatApiUrl = 'https://uat-efiling.gstat.gov.in/qms/api';

  getToken(formdata: any) {
    console.log(formdata);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      clientid: 'l7xx8ea27c74dcc9481b95936a546dd101c9',
      'client-secret': 'afb7fc0086204313b2bb3a95b773379e',
      username: 'NICGSTAT',
      'state-cd': '99',
      // 'Cookie': '7f8f42a7b37e460e676b7aebc57501ab=97eea6592250b780d2359ace866b985c; TS01a46674=0140752c73108344c570459a7b555fb98c469532ad92d1075ae1e047fdfdc1a2c29359e2970963485646c600a7dfcc80f58a043a602200242ff3ae4691c511876ba92a2e4e; TS017e7b56=0140752c733c52df595fdc12d97c508c32e24ce8c092d1075ae1e047fdfdc1a2c29359e2972f320bb5aaf519ff021aea23819299fe'
    });
    // console.log('form data \n' + JSON.stringify(formdata));
    return this.http.post(
      'https://devapi.gst.gov.in/govtapi/v0.2/authenticate',
      formdata,
      {
        headers,
        withCredentials: true, // ✅ Let browser handle cookies
      },
    );
  }

  //general apis

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
