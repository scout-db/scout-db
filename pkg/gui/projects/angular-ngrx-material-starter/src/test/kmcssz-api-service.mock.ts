import { Injectable } from '@angular/core';
import { KmcsszApiService } from '../app/shared/kmcssz-api-service';
import { Scout } from '@kmcssz-org/scoutdb-common';

@Injectable({
  providedIn: 'root'
})
export class KmcsszApiServiceMock extends KmcsszApiService {
  constructor() {
    super();
  }

  public async upsertScout(scout: Scout): Promise<unknown> {
    return;
  }
}
