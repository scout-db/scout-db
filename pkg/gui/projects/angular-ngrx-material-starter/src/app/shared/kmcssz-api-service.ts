import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Err, Ok, Result } from 'ts-results-es';
import {
  KmcsszApi,
  KmcsszApiConfiguration,
  Scout,
  newRex,
  hasKey
} from '@kmcssz-org/scoutdb-common';

import { environment } from '../../environments/environment';
import {
  actionFormUpdateFailure,
  actionFormUpdateSuccess
} from '../features/examples/form/form.actions';
import { isAxiosError } from 'axios';

@Injectable({
  providedIn: 'root'
})
export class KmcsszApiService {
  private readonly api: KmcsszApi;

  constructor(private store: Store<unknown>) {
    const basePath = environment.httpApiBaseUrl;
    this.api = new KmcsszApi(new KmcsszApiConfiguration({ basePath }));
  }

  public async createScout(scout: Scout): Promise<Result<Scout, Error>> {
    try {
      const res = await this.api.createScout(scout);
      this.store.dispatch(actionFormUpdateSuccess());
      return Ok(res.data);
    } catch (ex: unknown) {
      if (isAxiosError(ex)) {
        const message = ex.response?.data.message;
        this.store.dispatch(actionFormUpdateFailure({ message }));
      } else {
        console.error('API call to create scout failed: ', ex);
        const message = 'Sorry! Something failed! Contact your administrator!';
        this.store.dispatch(actionFormUpdateFailure({ message }));
      }
      const rex = newRex('API call to create scout failed:', ex);
      return Err(rex);
    }
  }
}
