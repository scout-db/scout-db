import { createAction, props } from '@ngrx/store';
import { Scout } from '@kmcssz-org/scoutdb-common';

export const actionFormUpdate = createAction(
  '[Form] Update',
  props<{ form: Scout }>()
);

export const actionFormReset = createAction('[Form] Reset');

export const actionFormSavedOnBackend = createAction('[Form] SavedOnBackend');
