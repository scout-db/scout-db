import * as assert from 'assert';
import { Actions, getEffectsMetadata } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';

import { FormEffects, FORM_KEY } from './form.effects';
import { actionFormUpdate } from './form.actions';
import { createMockScout } from '../../../../test/create-mock-scout';
import { KmcsszApiServiceMock } from '../../../../test/kmcssz-api-service.mock';

const scheduler = new TestScheduler((actual, expected) =>
  assert.deepStrictEqual(actual, expected)
);

describe('FormEffects', () => {
  let kmcsszApiServiceMock: KmcsszApiServiceMock;

  beforeEach(() => {
    kmcsszApiServiceMock = jasmine.createSpyObj('KmcsszApiServiceMock', [
      'upsertScout'
    ]);
  });

  describe('persistForm', () => {
    it('should not dispatch any action', () => {
      const actions = new Actions(EMPTY);
      const effect = new FormEffects(actions, kmcsszApiServiceMock);
      const metadata = getEffectsMetadata(effect);

      expect(metadata.persistForm?.dispatch).toEqual(false);
    });

    it('should call upsertScout on KmcsszApiServiceMock for UPDATE action', () => {
      scheduler.run((helpers) => {
        const { cold } = helpers;
        const form = createMockScout();
        const action = actionFormUpdate({ form });
        const source = cold('a', { a: action });
        const actions = new Actions(source);
        const effect = new FormEffects(actions, kmcsszApiServiceMock);

        effect.persistForm.subscribe(() => {
          expect(kmcsszApiServiceMock.upsertScout).toHaveBeenCalledWith(form);
        });
      });
    });
  });
});
