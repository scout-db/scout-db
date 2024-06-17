import { createAction, props } from '@ngrx/store';
import { Scout } from '@kmcssz-org/scoutdb-common';

export const actionFormUpdate = createAction(
  '[Form] Update',
  props<{ form: Scout }>()
);

export const actionFormUpdateSuccess = createAction('[Form] Update Success');

export const actionFormUpdateFailure = createAction(
  '[Form] Update Failure',
  props<{ message: Readonly<string> }>()
);

export const actionFormReset = createAction('[Form] Reset');
