import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { UntypedFormBuilder, FormGroup, FormArray } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { take } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { Scout } from '@kmcssz-org/scoutdb-common';

import {
  ROUTE_ANIMATIONS_ELEMENTS,
  NotificationService
} from '../../../../core/core.module';

import { actionFormReset, actionFormUpdate } from '../form.actions';
import { selectFormState } from '../form.selectors';
import { State } from '../../examples.state';

import { KmcsszApiService } from '../../../../shared/kmcssz-api-service';
import {
  SCOUT_FORM_FIELDS,
  createScoutFormGroupConfig
} from '../scout.form-fields';

@Component({
  selector: 'sdbg-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [KmcsszApiService]
})
export class FormComponent implements OnInit {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;

  form: FormGroup;
  fields = SCOUT_FORM_FIELDS;

  formValueChanges$: Observable<Scout> | undefined;

  constructor(
    private readonly api: KmcsszApiService,
    private fb: UntypedFormBuilder,
    private store: Store<State>,
    private translate: TranslateService,
    private notificationService: NotificationService
  ) {
    const cfg = createScoutFormGroupConfig();
    this.form = this.fb.group(cfg);
  }

  ngOnInit() {
    this.store
      .pipe(select(selectFormState), take(1))
      .subscribe((form) => this.form.patchValue(form.form));
  }

  update(form: Scout) {
    this.store.dispatch(actionFormUpdate({ form }));
  }

  save() {
    this.store.dispatch(actionFormUpdate({ form: this.form.value }));
  }

  onSubmit() {
    if (this.form.valid) {
      this.save();
      this.notificationService.info(
        (this.form.value.requestGift
          ? this.translate.instant('sdbg.examples.form.text4')
          : this.translate.instant('sdbg.examples.form.text5')) +
          ' : ' +
          this.translate.instant('sdbg.examples.form.text6')
      );
    }
  }

  reset() {
    this.form.reset();
    this.form.clearValidators();
    this.form.clearAsyncValidators();
    this.store.dispatch(actionFormReset());
  }

  getAllErrors(form: FormGroup | FormArray): { [key: string]: any } | null {
    let hasError = false;
    const result = Object.keys(form.controls).reduce(
      (acc, key) => {
        const control = form.get(key);
        const errors =
          control instanceof FormGroup || control instanceof FormArray
            ? this.getAllErrors(control)
            : control?.errors;
        if (errors) {
          acc[key] = errors;
          hasError = true;
        }
        return acc;
      },
      {} as { [key: string]: any }
    );
    return hasError ? result : null;
  }
}
