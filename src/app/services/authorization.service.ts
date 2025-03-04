import { Injectable } from '@angular/core';
import { AccessTokenResponse } from '../../api/api-client';

export type PayLoad = AccessTokenResponse & { loggedDate: Date }

@Injectable({
  providedIn: 'root',
})
export class AuthorizationService {

  get isAuthenticated(): boolean {
    return this.getPayLoad() !== null
  }

  logout(): void {
    this.setPayLoad(null);
  }

  getPayLoad(): PayLoad | null {
    const item = localStorage.getItem("token");
    if (!item) {
      return null;
    }

    return JSON.parse(item) as PayLoad;
  }

  setNewPayLoad(token: AccessTokenResponse): void {
    this.setPayLoad({...token, loggedDate: new Date()} as PayLoad)
  }

  setPayLoad(payLoad: PayLoad | null): void {
    if (payLoad == null) {
      localStorage.removeItem("token")
    } else {
      localStorage.setItem("token", JSON.stringify(payLoad))
    }
  }
}
