import { formReducer, initialState } from './form.reducer';
import { actionFormReset, actionFormUpdate } from './form.actions';
import { Scout, ScoutRankEnum } from '@kmcssz-org/scoutdb-common';
import { createMockScout } from "../../../../test/create-mock-scout";

describe('FormReducer', () => {

    /* eslint-disable @typescript-eslint/naming-convention */
    const form: Scout = createMockScout();
    /* eslint-enable @typescript-eslint/naming-convention */

  it('should return the default state', () => {
    const action = {} as any;
    const state = formReducer(undefined, action);
    expect(state).toBe(initialState);
  });

  it('should update the form', () => {
    const action = actionFormUpdate({
      form: { ...form, rank: ScoutRankEnum.KOV }
    });
    const state = formReducer(initialState, action);
    expect(state.form.rank).toBe(ScoutRankEnum.KOV);
  });

  it('should reset the form', () => {
    const action = actionFormReset();
    const state = formReducer(undefined, action);
    expect(state).toEqual(initialState);
  });
});
