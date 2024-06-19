import { GetScoutsV1200Response } from '@kmcssz-org/scoutdb-common/build/main/generated/openapi/typescript-axios/api';
import { createAction, props } from '@ngrx/store';

export const authLogin = createAction('[Auth] Login');
export const authLogout = createAction('[Auth] Logout');

export const scoutListDataFetchOk = createAction(
  '[ScoutList] dataFetchOk',
  props<GetScoutsV1200Response>()
);

export const scoutListDataFetchFail = createAction(
  '[ScoutList] dataFetchFail',
  props<{ message: string }>()
);
