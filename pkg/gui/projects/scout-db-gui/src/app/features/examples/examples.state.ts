import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import { AppState } from '../../core/core.module';

import { formReducer } from './form/form.reducer';
import { FormState } from './form/form.model';

export const FEATURE_NAME = 'examples';
export const selectExamples =
  createFeatureSelector<ExamplesState>(FEATURE_NAME);
export const reducers: ActionReducerMap<ExamplesState> = {
  form: formReducer
};

export interface ExamplesState {
  form: FormState;
}

export interface State extends AppState {
  examples: ExamplesState;
}
