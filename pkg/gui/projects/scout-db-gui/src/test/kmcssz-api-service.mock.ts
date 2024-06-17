import { Injectable } from '@angular/core';
import { KmcsszApiService } from '../app/shared/kmcssz-api-service';
import { Scout } from '@kmcssz-org/scoutdb-common';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class KmcsszApiServiceMock extends KmcsszApiService {
  constructor(private _store: Store) {
    super(_store);
  }

  public async upsertScoutV1(scout: Scout): Promise<unknown> {
    return;
  }
}
