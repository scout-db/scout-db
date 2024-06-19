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
import { SortDirection } from '@angular/material/sort';
import { GetScoutsV1200Response } from '@kmcssz-org/scoutdb-common/build/main/generated/openapi/typescript-axios/api';
import {
  scoutListDataFetchFail,
  scoutListDataFetchOk
} from '../core/auth/auth.actions';

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

  public async getScoutsV1(
    page: number,
    pageSize: number,
    sortBy: string,
    order: SortDirection
  ): Promise<Result<GetScoutsV1200Response, Error>> {
    const sortDir = order ? order : 'asc';
    try {
      const res = await this.api.getScoutsV1(page, pageSize, sortBy, sortDir);
      this.store.dispatch(scoutListDataFetchOk(res.data));
      return Ok(res.data);
    } catch (ex: unknown) {
      if (isAxiosError(ex)) {
        const message = ex.response?.data.message;
        this.store.dispatch(scoutListDataFetchFail({ message }));
      } else {
        console.error('API call to fetch scout list failed: ', ex);
        const message = 'Sorry! Something failed! Contact your administrator!';
        this.store.dispatch(scoutListDataFetchFail({ message }));
      }
      const rex = newRex('API call to fetch scout list failed:', ex);
      return Err(rex);
    }
  }
}
