import { Validators } from '@angular/forms';
import { nanoid } from 'nanoid';

/* eslint-disable @typescript-eslint/naming-convention */
export function createScoutFormGroupConfig(): { [key: string]: any } {
  return {
    id: [nanoid(16), Validators.required],
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
    label: 'ID',
    type: 'text',
    error: 'ID is required',
    isReadonly: true
  },
  {
    name: 'first_name',
    label: 'First Name',
    type: 'text',
    error: 'First Name is required',
    isReadonly: false
  },
  {
    name: 'last_name',
    label: 'Last Name',
    type: 'text',
    error: 'Last Name is required',
    isReadonly: false
  },
  {
    name: 'birth_year',
    label: 'Birth Year',
    type: 'number',
    error: 'Birth Year is required',
    isReadonly: false
  },
  {
    name: 'email_1',
    label: 'Email',
    type: 'email',
    error: 'Email is required',
    isReadonly: false
  },
  {
    name: 'phone_number_1',
    label: 'Phone Number',
    type: 'text',
    error: 'Phone Number is required',
    isReadonly: false
  },
  {
    name: 'troop_name',
    label: 'Troop Name',
    type: 'text',
    error: 'Troop Name is required',
    isReadonly: false
  },
  {
    name: 'troop_number',
    label: 'Troop Number',
    type: 'number',
    error: 'Troop Number is required',
    isReadonly: false
  },
  {
    name: 'troop_url',
    label: 'Troop URL',
    type: 'url',
    error: 'Troop URL is required',
    isReadonly: false
  },
  {
    name: 'country',
    label: 'Country',
    type: 'text',
    error: 'Country is required',
    isReadonly: false
  },
  {
    name: 'state',
    label: 'State',
    type: 'text',
    error: 'State is required',
    isReadonly: false
  },
  {
    name: 'city',
    label: 'City',
    type: 'text',
    error: 'City is required',
    isReadonly: false
  },
  {
    name: 'rank',
    label: 'Rank',
    type: 'select',
    options: [
      { value: 'KOV', viewValue: 'KOV - Kiscserkész Őrs Vezető' },
      { value: 'OV', viewValue: 'OV - Őrs Vezető' },
      { value: 'KST', viewValue: 'KST - Kiscserkész Segéd Tiszt' },
      { value: 'ST', viewValue: 'ST - Segéd Tiszt' },
      { value: 'T', viewValue: 'T - Tiszt' }
    ],
    error: 'Rank is required',
    isReadonly: false
  },
  {
    name: 'been_to_jubilee',
    label: 'Been to Jubilee',
    type: 'select',
    options: [
      { value: 'TRUE', viewValue: 'TRUE' },
      { value: 'FALSE', viewValue: 'FALSE' }
    ],
    error: 'This field is required',
    isReadonly: false
  },
  {
    name: 'can_set_fire',
    label: 'Can Set Fire',
    type: 'select',
    options: [
      { value: 'TRUE', viewValue: 'TRUE' },
      { value: 'FALSE', viewValue: 'FALSE' }
    ],
    error: 'This field is required',
    isReadonly: false
  },
  {
    name: 'can_carve_wood',
    label: 'Can Carve Wood',
    type: 'select',
    options: [
      { value: 'TRUE', viewValue: 'TRUE' },
      { value: 'FALSE', viewValue: 'FALSE' }
    ],
    error: 'This field is required',
    isReadonly: false
  },
  {
    name: 'can_train_others',
    label: 'Can Train Others',
    type: 'select',
    options: [
      { value: 'TRUE', viewValue: 'TRUE' },
      { value: 'FALSE', viewValue: 'FALSE' }
    ],
    error: 'This field is required',
    isReadonly: false
  },
  {
    name: 'can_make_sausage',
    label: 'Can Make Sausage',
    type: 'select',
    options: [
      { value: 'TRUE', viewValue: 'TRUE' },
      { value: 'FALSE', viewValue: 'FALSE' }
    ],
    error: 'This field is required',
    isReadonly: false
  },
  {
    name: 'can_lead_campfire',
    label: 'Can Lead Campfire',
    type: 'select',
    options: [
      { value: 'TRUE', viewValue: 'TRUE' },
      { value: 'FALSE', viewValue: 'FALSE' }
    ],
    error: 'This field is required',
    isReadonly: false
  },
  {
    name: 'can_first_aid',
    label: 'Can Perform First Aid',
    type: 'select',
    options: [
      { value: 'TRUE', viewValue: 'TRUE' },
      { value: 'FALSE', viewValue: 'FALSE' }
    ],
    error: 'This field is required',
    isReadonly: false
  },
  {
    name: 'can_cook',
    label: 'Can Cook',
    type: 'select',
    options: [
      { value: 'TRUE', viewValue: 'TRUE' },
      { value: 'FALSE', viewValue: 'FALSE' }
    ],
    error: 'This field is required',
    isReadonly: false
  }
];
/* eslint-enable @typescript-eslint/naming-convention */
