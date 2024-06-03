import { Injectable } from '@angular/core';
import {
  KmcsszApi,
  KmcsszApiConfiguration,
  Scout
} from '@kmcssz-org/scoutdb-common';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class KmcsszApiService {
  private readonly api: KmcsszApi;

  constructor() {
    const basePath = environment.httpApiBaseUrl;
    this.api = new KmcsszApi(new KmcsszApiConfiguration({ basePath }));
  }

  public async upsertScout(scout: Scout): Promise<unknown> {
    const response = await this.api.createScout(scout);
    return response;
  }
}
