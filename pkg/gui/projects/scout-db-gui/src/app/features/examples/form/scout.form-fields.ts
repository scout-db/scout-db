import { FormControl, Validators } from '@angular/forms';
import { nanoid } from 'nanoid';

/* eslint-disable @typescript-eslint/naming-convention */
export function createScoutFormGroupConfig(): { [key: string]: any } {
  return {
    id: new FormControl({ value: nanoid(16), disabled: false }, Validators.required),
    first_name: ['', Validators.required],
    last_name: ['', Validators.required],
    birth_year: [null, Validators.required],
    email_1: ['', [Validators.required, Validators.email]],
    phone_number_1: ['', Validators.required],
    troop_name: ['', Validators.required],
    troop_number: [null, Validators.required],
    troop_url: ['', Validators.required],
    country: ['', Validators.required],
    state: ['', Validators.required],
    city: ['', Validators.required],
    rank: ['', Validators.required],
    been_to_jubilee: ['', Validators.required],
    can_set_fire: ['', Validators.required],
    can_carve_wood: ['', Validators.required],
    can_train_others: ['', Validators.required],
    can_make_sausage: ['', Validators.required],
    can_lead_campfire: ['', Validators.required],
    can_first_aid: ['', Validators.required],
    can_cook: ['', Validators.required]
  };
}

export const SCOUT_FORM_FIELDS = [
  {
    name: 'id',
    label: 'sdbg.examples.form.id.label',
    type: 'text',
    error: 'sdbg.examples.form.id.error',
    isReadonly: true
  },
  {
    name: 'first_name',
    label: 'sdbg.examples.form.first_name.label',
    type: 'text',
    error: 'sdbg.examples.form.first_name.error',
    isReadonly: false
  },
  {
    name: 'last_name',
    label: 'sdbg.examples.form.last_name.label',
    type: 'text',
    error: 'sdbg.examples.form.last_name.error',
    isReadonly: false
  },
  {
    name: 'birth_year',
    label: 'sdbg.examples.form.birth_year.label',
    type: 'number',
    error: 'sdbg.examples.form.birth_year.error',
    isReadonly: false
  },
  {
    name: 'email_1',
    label: 'sdbg.examples.form.email_1.label',
    type: 'email',
    error: 'sdbg.examples.form.email_1.error',
    isReadonly: false
  },
  {
    name: 'phone_number_1',
    label: 'sdbg.examples.form.phone_number_1.label',
    type: 'text',
    error: 'sdbg.examples.form.phone_number_1.error',
    isReadonly: false
  },
  {
    name: 'troop_name',
    label: 'sdbg.examples.form.troop_name.label',
    type: 'text',
    error: 'sdbg.examples.form.troop_name.error',
    isReadonly: false
  },
  {
    name: 'troop_number',
    label: 'sdbg.examples.form.troop_number.label',
    type: 'number',
    error: 'sdbg.examples.form.troop_number.error',
    isReadonly: false
  },
  {
    name: 'troop_url',
    label: 'sdbg.examples.form.troop_url.label',
    type: 'url',
    error: 'sdbg.examples.form.troop_url.error',
    isReadonly: false
  },
  {
    name: 'country',
    label: 'sdbg.examples.form.country.label',
    type: 'text',
    error: 'sdbg.examples.form.country.error',
    isReadonly: false
  },
  {
    name: 'state',
    label: 'sdbg.examples.form.state.label',
    type: 'text',
    error: 'sdbg.examples.form.state.error',
    isReadonly: false
  },
  {
    name: 'city',
    label: 'sdbg.examples.form.city.label',
    type: 'text',
    error: 'sdbg.examples.form.city.error',
    isReadonly: false
  },
  {
    name: 'rank',
    label: 'sdbg.examples.form.rank.label',
    type: 'select',
    options: [
      { value: 'KOV', viewValue: 'KOV - Kiscserkész Őrs Vezető' },
      { value: 'OV', viewValue: 'OV - Őrs Vezető' },
      { value: 'KST', viewValue: 'KST - Kiscserkész Segéd Tiszt' },
      { value: 'ST', viewValue: 'ST - Segéd Tiszt' },
      { value: 'T', viewValue: 'T - Tiszt' }
    ],
    error: 'sdbg.examples.form.rank.error',
    isReadonly: false
  },
  {
    name: 'been_to_jubilee',
    label: 'sdbg.examples.form.been_to_jubilee.label',
    type: 'select',
    options: [
      { value: 'TRUE', viewValue: 'sdbg.examples.form.checkbox.true' },
      { value: 'FALSE', viewValue: 'sdbg.examples.form.checkbox.false' }
    ],
    error: 'sdbg.examples.form.been_to_jubilee.error',
    isReadonly: false
  },
  {
    name: 'can_set_fire',
    label: 'sdbg.examples.form.can_set_fire.label',
    type: 'select',
    options: [
      { value: 'TRUE', viewValue: 'sdbg.examples.form.checkbox.true' },
      { value: 'FALSE', viewValue: 'sdbg.examples.form.checkbox.false' }
    ],
    error: 'sdbg.examples.form.can_set_fire.error',
    isReadonly: false
  },
  {
    name: 'can_carve_wood',
    label: 'sdbg.examples.form.can_carve_wood.label',
    type: 'select',
    options: [
      { value: 'TRUE', viewValue: 'sdbg.examples.form.checkbox.true' },
      { value: 'FALSE', viewValue: 'sdbg.examples.form.checkbox.false' }
    ],
    error: 'sdbg.examples.form.can_carve_wood.error',
    isReadonly: false
  },
  {
    name: 'can_train_others',
    label: 'sdbg.examples.form.can_train_others.label',
    type: 'select',
    options: [
      { value: 'TRUE', viewValue: 'sdbg.examples.form.checkbox.true' },
      { value: 'FALSE', viewValue: 'sdbg.examples.form.checkbox.false' }
    ],
    error: 'sdbg.examples.form.can_train_others.error',
    isReadonly: false
  },
  {
    name: 'can_make_sausage',
    label: 'sdbg.examples.form.can_make_sausage.label',
    type: 'select',
    options: [
      { value: 'TRUE', viewValue: 'sdbg.examples.form.checkbox.true' },
      { value: 'FALSE', viewValue: 'sdbg.examples.form.checkbox.false' }
    ],
    error: 'sdbg.examples.form.can_make_sausage.error',
    isReadonly: false
  },
  {
    name: 'can_lead_campfire',
    label: 'sdbg.examples.form.can_lead_campfire.label',
    type: 'select',
    options: [
      { value: 'TRUE', viewValue: 'sdbg.examples.form.checkbox.true' },
      { value: 'FALSE', viewValue: 'sdbg.examples.form.checkbox.false' }
    ],
    error: 'sdbg.examples.form.can_lead_campfire.error',
    isReadonly: false
  },
  {
    name: 'can_first_aid',
    label: 'sdbg.examples.form.can_first_aid.label',
    type: 'select',
    options: [
      { value: 'TRUE', viewValue: 'sdbg.examples.form.checkbox.true' },
      { value: 'FALSE', viewValue: 'sdbg.examples.form.checkbox.false' }
    ],
    error: 'sdbg.examples.form.can_first_aid.error',
    isReadonly: false
  },
  {
    name: 'can_cook',
    label: 'sdbg.examples.form.can_cook.label',
    type: 'select',
    options: [
      { value: 'TRUE', viewValue: 'sdbg.examples.form.checkbox.true' },
      { value: 'FALSE', viewValue: 'sdbg.examples.form.checkbox.false' }
    ],
    error: 'sdbg.examples.form.can_cook.error',
    isReadonly: false
  }
];
/* eslint-enable @typescript-eslint/naming-convention */
