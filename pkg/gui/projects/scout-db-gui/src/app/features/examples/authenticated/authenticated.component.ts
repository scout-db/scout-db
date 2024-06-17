/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

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
  ScoutRankEnum
} from '@kmcssz-org/scoutdb-common';

import { ROUTE_ANIMATIONS_ELEMENTS } from '../../../core/core.module';
import { createMockScout } from '../../../../test/create-mock-scout';

@Component({
  selector: 'sdbg-authenticated',
  templateUrl: './authenticated.component.html',
  styleUrls: ['./authenticated.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthenticatedComponent implements OnInit {
  @ViewChild(MatPaginator) public paginator!: MatPaginator;
  @ViewChild(MatSort) public sort!: MatSort;

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

  constructor() {
    const scouts: Scout[] = [];
    for (let i = 0; i < 5000; i++) {
      const aScout = createMockScout();
      scouts.push(aScout);
    }

    this.dataSource = new MatTableDataSource(scouts);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit() {
    this.dataSource.filterPredicate = this.dataSource.filterPredicate = (
      data: Scout,
      filter: string
    ): boolean => {
      const q = JSON.parse(filter);
      const fv = this.filterValues;

      const searchTerm = q.free_text_search;
      const matchFreeTextSearch =
        data.first_name.toLowerCase().includes(searchTerm) ||
        data.last_name.toLowerCase().includes(searchTerm) ||
        data.email_1.toLowerCase().includes(searchTerm) ||
        data.troop_name.toLowerCase().includes(searchTerm) ||
        data.country.toLowerCase().includes(searchTerm) ||
        data.state.toLowerCase().includes(searchTerm) ||
        data.city.toLowerCase().includes(searchTerm) ||
        data.rank.toLowerCase().includes(searchTerm);

      const searchTermMatch = searchTerm ? matchFreeTextSearch : true;

      const been_to_jubilee =
        data.been_to_jubilee === ScoutBeenToJubileeEnum.True;
      const can_set_fire = data.can_set_fire === ScoutCanSetFireEnum.True;
      const can_carve_wood = data.can_carve_wood === ScoutCanCarveWoodEnum.True;
      const can_train_others =
        data.can_train_others === ScoutCanTrainOthersEnum.True;
      const can_make_sausage =
        data.can_make_sausage === ScoutCanMakeSausageEnum.True;
      const can_lead_campfire =
        data.can_lead_campfire === ScoutCanLeadCampfireEnum.True;
      const can_first_aid = data.can_first_aid === ScoutCanFirstAidEnum.True;
      const can_cook = data.can_cook === ScoutCanCookEnum.True;

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
        fv.ranks.length > 0 ? fv.ranks.includes(data.rank) : true;

      return boolFlagsMatch && searchTermMatch && ranksMatch;
    };
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

    this.dataSource.filter = JSON.stringify(this.filterValues);

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
