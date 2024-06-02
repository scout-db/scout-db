import { FormState } from './form.model';
import { actionFormReset, actionFormUpdate } from './form.actions';
import { Action, createReducer, on } from '@ngrx/store';

import { Scout } from "@kmcssz-org/scoutdb-common";

export const initialState: FormState = {
  form: {} as Scout
};

const reducer = createReducer(
  initialState,
  on(actionFormUpdate, (state, { form }) => ({
    ...state,
    form: { ...form }
  })),
  on(actionFormReset, () => initialState)
);

export function formReducer(state: FormState | undefined, action: Action) {
  return reducer(state, action);
}
