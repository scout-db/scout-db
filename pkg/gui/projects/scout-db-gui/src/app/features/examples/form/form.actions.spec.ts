import { actionFormUpdate, actionFormReset } from './form.actions';
import { Scout } from '@kmcssz-org/scoutdb-common';
import { createMockScout } from '../../../../test/create-mock-scout';

describe('Form Actions', () => {
  it('should create ActionFormUpdate action', () => {
    const testForm: Scout = createMockScout();
    const action = actionFormUpdate({
      form: testForm
    });
    expect(action.type).toEqual(actionFormUpdate.type);
    expect(action.form).toEqual(jasmine.objectContaining(testForm));
  });

  it('should create ActionFormReset action', () => {
    const action = actionFormReset();
    expect(action.type).toEqual(actionFormReset.type);
  });
});
