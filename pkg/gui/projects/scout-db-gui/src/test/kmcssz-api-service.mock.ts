import { Injectable } from '@angular/core';
import { KmcsszApiService } from '../app/shared/kmcssz-api-service';
import { Scout } from '@kmcssz-org/scoutdb-common';
import { Store } from '@ngrx/store';
import { Ok, Result } from 'ts-results-es';
import { nanoid } from 'nanoid';

@Injectable({
  providedIn: 'root'
})
export class KmcsszApiServiceMock extends KmcsszApiService {
  constructor(private _store: Store) {
    super(_store);
  }

  public async createScout(scout: Scout): Promise<Result<Scout, Error>> {
    return Ok({ id: nanoid() } as Scout);
  }
}
