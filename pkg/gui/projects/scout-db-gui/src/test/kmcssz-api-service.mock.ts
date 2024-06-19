import { Injectable } from '@angular/core';
import { KmcsszApiService } from '../app/shared/kmcssz-api-service';
import { Scout } from '@kmcssz-org/scoutdb-common';
import { Store } from '@ngrx/store';
import { Ok, Result } from 'ts-results-es';
import { nanoid } from 'nanoid';
import { GetScoutsV1200Response } from '@kmcssz-org/scoutdb-common';

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

  public async getScoutsV1(
    page: number,
    pageSize: number,
    sortBy: string,
    order: string
  ): Promise<Result<GetScoutsV1200Response, Error>> {
    return Ok({
      data: [],
      sorting: {
        sortDirection: 'asc',
        sortFieldName: 'city'
      },
      pagination: {
        currentPage: 1,
        pageSize: 10,
        totalPages: 0,
        totalRecords: 0
      }
    } as GetScoutsV1200Response);
  }
}
