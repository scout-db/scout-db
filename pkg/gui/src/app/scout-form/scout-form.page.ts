import { nanoid } from 'nanoid';

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
  Configuration,
  DefaultApi,
} from '../../../../common/src/generated/openapi/typescript-axios/index';

@Component({
  selector: 'app-scout-form',
  templateUrl: './scout-form.page.html',
  styleUrls: ['./scout-form.page.scss'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  standalone: true,
})
export class ScoutFormPage implements OnInit {
  public scoutForm: FormGroup | undefined;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.scoutForm = this.fb.group({
      first_name: ['', [Validators.required, Validators.maxLength(50)]],
      last_name: ['', [Validators.required, Validators.maxLength(50)]],
      birth_year: [
        null,
        [
          Validators.required,
          Validators.min(1000),
          Validators.max(new Date().getFullYear()),
        ],
      ],
      email_1: [
        '',
        [Validators.required, Validators.email, Validators.maxLength(100)],
      ],
      phone_number_1: ['', [Validators.required, Validators.maxLength(15)]],
      troop_name: ['', [Validators.required, Validators.maxLength(100)]],
      troop_number: [null, [Validators.required]],
      troop_url: ['', [Validators.required, Validators.maxLength(200)]],
      country: ['', [Validators.required, Validators.maxLength(56)]],
      state: ['', [Validators.required, Validators.maxLength(50)]],
      city: ['', [Validators.required, Validators.maxLength(100)]],
      rank: ['', [Validators.required, Validators.maxLength(50)]],
      been_to_jubilee: [null, [Validators.required]],
      jubilee_participant_years_csv: ['', [Validators.maxLength(100)]],
      can_set_fire: [null, [Validators.required]],
      can_carve_wood: [null, [Validators.required]],
      can_train_others: [null, [Validators.required]],
      can_make_sausage: [null, [Validators.required]],
      can_lead_campfire: [null, [Validators.required]],
      can_first_aid: [null, [Validators.required]],
      can_cook: [null, [Validators.required]],
    });

    this.scoutForm.valueChanges.subscribe((next: unknown) => {
      console.log('[FormChange] next=%', next);
      if (!this.scoutForm) {
        return;
      }
      const errors = this.getFormValidationErrors(this.scoutForm);
      console.log('[FormChange] errors=%o', errors);
    });
  }

  async onSubmit() {
    if (!this.scoutForm) {
      throw new Error('onSubmit() this.scoutFrom cannot be falsy.');
    }
    if (this.scoutForm.valid) {
      console.log('Form Submitted', this.scoutForm.value);
      const scoutFormData = this.scoutForm.value;
      const newId = nanoid(12);
      const scout = { ...scoutFormData, id: newId };
      const api = new DefaultApi(new Configuration({}));
      try {
        const res = await api.createScout(scout);
        console.log('Submitted scout data OK', res);
      } catch (ex: unknown) {
        console.error('Failed to save scout data: ', ex);
        throw new Error('We could not save your data.');
      }
    }
  }

  getFormValidationErrors(form: FormGroup): string {
    return Object.keys(form.controls)
      .map((control) => {
        if (!this.scoutForm) {
          throw new Error('this.scoutForm cannot be falsy.');
        }
        const aControl = this.scoutForm.get(control);
        if (!aControl) {
          return [];
        }
        const controlErrors = aControl.errors;
        if (!controlErrors) {
          return [];
        }
        const controlErrorsString = Object.keys(controlErrors)
          .flatMap((keyError) => `${keyError}: ${controlErrors[keyError]}`)
          .join(', ');
        return `${control}: {${controlErrorsString}}`;
      })
      .filter((list) => list.length > 0)
      .join('\n');
  }
}
