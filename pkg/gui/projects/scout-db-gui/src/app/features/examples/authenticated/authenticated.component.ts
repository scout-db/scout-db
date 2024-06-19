/* eslint-disable @typescript-eslint/naming-convention */
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';

import {
  Scout,
  ScoutBeenToJubileeEnum,
  ScoutCanCarveWoodEnum,
  ScoutCanCookEnum,
  ScoutCanFirstAidEnum,
  ScoutCanLeadCampfireEnum,
  ScoutCanMakeSausageEnum,
  ScoutCanSetFireEnum,
  ScoutCanTrainOthersEnum,
  ScoutRankEnum,
  newRex
} from '@kmcssz-org/scoutdb-common';

import { ROUTE_ANIMATIONS_ELEMENTS } from '../../../core/core.module';
import { KmcsszApiService } from '../../../shared/kmcssz-api-service';

@Component({
  selector: 'sdbg-authenticated',
  templateUrl: './authenticated.component.html',
  styleUrls: ['./authenticated.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthenticatedComponent implements OnInit {
  @ViewChild(MatPaginator) public paginator!: MatPaginator;
  @ViewChild(MatSort) public sort!: MatSort;

  public isLoadingResults = true;
  public isRateLimitReached = false;
  public resultsLength = 0;

  public routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  public displayedColumns: string[] = [
    'id',
    'first_name',
    'last_name',
    'birth_year',
    'email_1',
    'phone_number_1',
    'troop_name',
    'troop_number',
    'troop_url',
    'country',
    'state',
    'city',
    'rank',
    'been_to_jubilee',
    'can_set_fire',
    'can_carve_wood',
    'can_train_others',
    'can_make_sausage',
    'can_lead_campfire',
    'can_first_aid',
    'can_cook'
  ];

  public rankList = Object.keys(ScoutRankEnum);

  public rankOptions = this.rankList.map((r) => ({ value: r, viewValue: r }));

  public filterValues = {
    ranks: this.rankOptions.map((x) => x.value),
    free_text_search: '',
    been_to_jubilee: false,
    can_set_fire: false,
    can_carve_wood: false,
    can_train_others: false,
    can_make_sausage: false,
    can_lead_campfire: false,
    can_first_aid: false,
    can_cook: false
  };

  public dataSource: MatTableDataSource<Scout>;

  constructor(
    private apiSvc: KmcsszApiService,
    private cdr: ChangeDetectorRef
  ) {
    const initialData: Scout[] = [];
    this.dataSource = new MatTableDataSource(initialData);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          console.log('starting data fetch...');
          this.isLoadingResults = true;

          return this.apiSvc.getScoutsV1(
            this.paginator.pageIndex + 1,
            this.paginator.pageSize,
            this.sort.active,
            this.sort.direction
          );
        }),
        map((data) => {
          if (data.isErr()) {
            const message = data.error.message;
            console.error('Failed to fetch scout list: ', data.error, message);
            throw newRex('Failed to fetch scout list data:', data.error);
          }
          console.log('data received OK', data);
          this.isLoadingResults = false;
          this.isRateLimitReached = data === null;

          this.resultsLength = data.value.pagination.totalRecords;
          console.log('resultsLength=%o', data.value.pagination.totalRecords);
          this.resetDataSource(data.value.data);
          
          this.cdr.detectChanges();
          
          return data.value.data;
        })
      ).subscribe();
  }

  ngOnInit() {}

  public resetDataSource(data: Scout[]): void {
    this.dataSource = new MatTableDataSource<Scout>(data);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    this.dataSource.filterPredicate = this.dataSource.filterPredicate = (
      row: Scout,
      filter: string
    ): boolean => {
      const q = JSON.parse(filter);
      const fv = this.filterValues;

      const searchTerm = q.free_text_search;
      const matchFreeTextSearch =
        row.first_name.toLowerCase().includes(searchTerm) ||
        row.last_name.toLowerCase().includes(searchTerm) ||
        row.email_1.toLowerCase().includes(searchTerm) ||
        row.troop_name.toLowerCase().includes(searchTerm) ||
        row.country.toLowerCase().includes(searchTerm) ||
        row.state.toLowerCase().includes(searchTerm) ||
        row.city.toLowerCase().includes(searchTerm) ||
        row.rank.toLowerCase().includes(searchTerm);

      const searchTermMatch = searchTerm ? matchFreeTextSearch : true;

      const been_to_jubilee =
        row.been_to_jubilee === ScoutBeenToJubileeEnum.True;
      const can_set_fire = row.can_set_fire === ScoutCanSetFireEnum.True;
      const can_carve_wood = row.can_carve_wood === ScoutCanCarveWoodEnum.True;
      const can_train_others =
        row.can_train_others === ScoutCanTrainOthersEnum.True;
      const can_make_sausage =
        row.can_make_sausage === ScoutCanMakeSausageEnum.True;
      const can_lead_campfire =
        row.can_lead_campfire === ScoutCanLeadCampfireEnum.True;
      const can_first_aid = row.can_first_aid === ScoutCanFirstAidEnum.True;
      const can_cook = row.can_cook === ScoutCanCookEnum.True;

      const boolFlagsMatch =
        (fv.been_to_jubilee ? been_to_jubilee === q.been_to_jubilee : true) &&
        (fv.can_set_fire ? can_set_fire === q.can_set_fire : true) &&
        (fv.can_carve_wood ? can_carve_wood === q.can_carve_wood : true) &&
        (fv.can_train_others
          ? can_train_others === q.can_train_others
          : true) &&
        (fv.can_make_sausage
          ? can_make_sausage === q.can_make_sausage
          : true) &&
        (fv.can_lead_campfire
          ? can_lead_campfire === q.can_lead_campfire
          : true) &&
        (fv.can_first_aid ? can_first_aid === q.can_first_aid : true) &&
        (fv.can_cook ? can_cook === q.can_cook : true);

      const ranksMatch =
        fv.ranks.length > 0 ? fv.ranks.includes(row.rank) : true;

      return boolFlagsMatch && searchTermMatch && ranksMatch;
    };

    this.dataSource.filter = JSON.stringify(this.filterValues);
  }

  applyTextFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filterValues.free_text_search = filterValue.trim().toLowerCase();

    this.dataSource.filter = JSON.stringify(this.filterValues);

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  applyRanksFilter(pickedRanks: string[]) {
    console.log('applyRanksFilter() ', pickedRanks);
    this.filterValues.ranks = pickedRanks;

    this.dataSource.filter = JSON.stringify(this.filterValues);

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  applyBooleanFilter(
    column:
      | 'been_to_jubilee'
      | 'can_set_fire'
      | 'can_carve_wood'
      | 'can_train_others'
      | 'can_make_sausage'
      | 'can_lead_campfire'
      | 'can_first_aid'
      | 'can_cook',
    filterValue: boolean
  ) {
    this.filterValues[column] = filterValue;
    console.log('applyBooleanFilter() ', filterValue);

    this.dataSource.filter = JSON.stringify(this.filterValues);

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
