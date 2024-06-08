import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import {
  UntypedFormBuilder,
  FormGroup,
  FormArray,
  FormGroupDirective
} from '@angular/forms';
import { ActionsSubject, Store, select } from '@ngrx/store';
import { ofType } from '@ngrx/effects';
import { take } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { nanoid } from 'nanoid';

import { Scout } from '@kmcssz-org/scoutdb-common';

import {
  ROUTE_ANIMATIONS_ELEMENTS,
  NotificationService
} from '../../../../core/core.module';
import { environment } from '../../../../../environments/environment';

import {
  actionFormReset,
  actionFormSavedOnBackend,
  actionFormUpdate
} from '../form.actions';
import { selectFormState } from '../form.selectors';
import { State } from '../../examples.state';

import {
  SCOUT_FORM_FIELDS,
  createScoutFormGroupConfig
} from '../scout.form-fields';

@Component({
  selector: 'sdbg-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: []
})
export class FormComponent implements OnInit {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  isProductionEnv: boolean = environment.production;
  form: FormGroup;
  fields = SCOUT_FORM_FIELDS;

  formValueChanges$: Observable<Scout> | undefined;

  constructor(
    private fb: UntypedFormBuilder,
    private store: Store<State>,
    private translate: TranslateService,
    private notificationService: NotificationService,
    private actionsListener$: ActionsSubject
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

  async onSubmit(ngForm: FormGroupDirective) {
    if (this.form.valid) {
      await new Promise<void>((resolve, reject) => {
        this.actionsListener$
          .pipe(ofType(actionFormSavedOnBackend), take(1))
          .subscribe((data: any) => {
            console.log('ACTION_LISTENER', data);
            resolve();
          });

        this.save();
      });
      this.reset(ngForm);
      this.notificationService.info('Your data has been saved, thank you!');
    }
  }

  reset(ngForm: FormGroupDirective) {
    ngForm.resetForm();
    this.form.reset();
    this.form.patchValue({ id: nanoid(16) });
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
