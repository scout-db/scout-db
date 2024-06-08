import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  KmcsszApi,
  KmcsszApiConfiguration,
  Scout
} from '@kmcssz-org/scoutdb-common';

import { environment } from '../../environments/environment';
import { actionFormSavedOnBackend } from '../features/examples/form/form.actions';

@Injectable({
  providedIn: 'root'
})
export class KmcsszApiService {
  private readonly api: KmcsszApi;

  constructor(private store: Store<unknown>) {
    const basePath = environment.httpApiBaseUrl;
    this.api = new KmcsszApi(new KmcsszApiConfiguration({ basePath }));
  }

  public async upsertScout(scout: Scout): Promise<Scout> {
    const res = await this.api.createScout(scout);
    this.store.dispatch(actionFormSavedOnBackend());
    return res.data;
  }
}
