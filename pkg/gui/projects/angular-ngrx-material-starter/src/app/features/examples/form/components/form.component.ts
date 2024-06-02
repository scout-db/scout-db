import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Validators, UntypedFormBuilder } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { filter, take, tap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import {
  ROUTE_ANIMATIONS_ELEMENTS,
  NotificationService
} from '../../../../core/core.module';

import { actionFormReset, actionFormUpdate } from '../form.actions';
import { selectFormState } from '../form.selectors';
import { State } from '../../examples.state';

import { Scout } from '@kmcssz-org/scoutdb-common';

@Component({
  selector: 'sdbg-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormComponent implements OnInit {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;

  form = this.fb.group({
    autosave: false,
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    description: [
      '',
      [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(1000)
      ]
    ],
    requestGift: [''],
    birthday: ['', [Validators.required]],
    rating: [0, Validators.required]
  });

  formValueChanges$: Observable<Scout> | undefined;

  constructor(
    private fb: UntypedFormBuilder,
    private store: Store<State>,
    private translate: TranslateService,
    private notificationService: NotificationService
  ) {}

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

  submit() {
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
}
