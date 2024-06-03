import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatSelectHarness } from '@angular/material/select/testing';

import { RankLongName, Scout } from '@kmcssz-org/scoutdb-common';

import { NotificationService } from '../../../../core/core.module';
import { SharedModule } from '../../../../shared/shared.module';
import { createMockScout } from '../../../../../test/create-mock-scout';

import { FormComponent } from './form.component';
import { selectFormState } from '../form.selectors';

describe('FormComponent', () => {
  let store: MockStore;
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let dispatchSpy: jasmine.Spy;
  let loader: HarnessLoader;

  const getInput = (fieldName: string) =>
    loader.getHarness(
      MatInputHarness.with({ selector: `[name="${fieldName}"]` })
    );

  const getSelect = (fieldName: string) =>
    loader.getHarness(
      MatSelectHarness.with({
        selector: `[name="${fieldName}"]`
      })
    );

  const selectOptionStartsWith = (
    msh: MatSelectHarness,
    prefix: string
  ): Promise<void> => {
    const regExp = new RegExp(`${prefix}.*`);
    return msh.clickOptions({ text: regExp });
  };

  const getSaveButton = () =>
    loader.getHarness(
      MatButtonHarness.with({ text: 'sdbg.examples.form.save' })
    );

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [SharedModule, NoopAnimationsModule, TranslateModule.forRoot()],
      declarations: [FormComponent],
      providers: [provideMockStore(), NotificationService]
    });

    store = TestBed.inject(MockStore);
    store.overrideSelector(selectFormState, { form: {} as Scout });
    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);

    dispatchSpy = spyOn(store, 'dispatch');
  });

  it('should save form', async () => {
    const scout = createMockScout();
    const saveButton = await getSaveButton();

    const firstNameInput = await getInput('first_name');
    const idInput = await getInput('id');
    const lastNameInput = await getInput('last_name');
    const birthYearInput = await getInput('birth_year');
    const emailInput = await getInput('email_1');
    const phoneNumberInput = await getInput('phone_number_1');
    const troopNameInput = await getInput('troop_name');
    const troopNumberInput = await getInput('troop_number');
    const troopUrlInput = await getInput('troop_url');
    const countryInput = await getInput('country');
    const stateInput = await getInput('state');
    const cityInput = await getInput('city');
    const rankSelect = await getSelect('rank');
    const beenToJubileeSelect = await getSelect('been_to_jubilee');
    const canSetFireSelect = await getSelect('can_set_fire');
    const canCarveWoodSelect = await getSelect('can_carve_wood');
    const canTrainOthersSelect = await getSelect('can_train_others');
    const canMakeSausageSelect = await getSelect('can_make_sausage');
    const canLeadCampfireSelect = await getSelect('can_lead_campfire');
    const canFirstAidSelect = await getSelect('can_first_aid');
    const canCookSelect = await getSelect('can_cook');

    await idInput.setValue(scout.id);
    await firstNameInput.setValue(scout.first_name);
    await lastNameInput.setValue(scout.last_name);
    await birthYearInput.setValue(scout.birth_year.toString(10));
    await emailInput.setValue(scout.email_1);
    await phoneNumberInput.setValue(scout.phone_number_1);
    await troopNameInput.setValue(scout.troop_name);
    await troopNumberInput.setValue(scout.troop_number.toString(10));
    await troopUrlInput.setValue(scout.troop_url);
    await countryInput.setValue(scout.country);
    await stateInput.setValue(scout.state);
    await cityInput.setValue(scout.city);

    const rankLongName = RankLongName[scout.rank];
    await rankSelect.clickOptions({ text: rankLongName });

    await beenToJubileeSelect.clickOptions({ text: scout.been_to_jubilee });
    await canSetFireSelect.clickOptions({ text: scout.can_set_fire });
    await canCarveWoodSelect.clickOptions({ text: scout.can_carve_wood });
    await canTrainOthersSelect.clickOptions({
      text: scout.can_train_others
    });
    await canMakeSausageSelect.clickOptions({
      text: scout.can_make_sausage
    });
    await canLeadCampfireSelect.clickOptions({
      text: scout.can_lead_campfire
    });
    await canFirstAidSelect.clickOptions({ text: scout.can_first_aid });
    await canCookSelect.clickOptions({ text: scout.can_cook });
    delete scout.jubilee_participant_years_csv;

    await saveButton.click();

    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy.calls.mostRecent().args[0].type).toBe('[Form] Update');
    expect(dispatchSpy.calls.mostRecent().args[0].form).toEqual(scout);
  });
});
