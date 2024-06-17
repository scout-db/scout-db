import { nanoid } from 'nanoid';

import {
  Scout,
  ScoutBeenToJubileeEnum,
  ScoutCanCarveWoodEnum,
  ScoutCanCookEnum,
  ScoutCanFirstAidEnum,
  ScoutCanLeadCampfireEnum,
  ScoutCanMakeSausageEnum,
  ScoutCanSetFireEnum,
  ScoutCanTrainOthersEnum
} from '@kmcssz-org/scoutdb-common';

import { pickRandomEnglishName } from './pick-random-english-name';
import { pickRandomRank } from './pick-random-rank';

export function createMockScout(): Scout {
  /* eslint-disable @typescript-eslint/naming-convention */
  const first_name = pickRandomEnglishName();
  const last_name = pickRandomEnglishName();
  const mock: Scout = {
    email_1: `${first_name}.${last_name}@do.not.email.example.com`,
    been_to_jubilee:
      Math.random() > 0.5
        ? ScoutBeenToJubileeEnum.False
        : ScoutBeenToJubileeEnum.True,
    birth_year: 1960 + Math.ceil(Math.random() * 50),
    can_carve_wood:
      Math.random() > 0.5
        ? ScoutCanCarveWoodEnum.False
        : ScoutCanCarveWoodEnum.True,
    can_cook:
      Math.random() > 0.5 ? ScoutCanCookEnum.False : ScoutCanCookEnum.True,
    can_first_aid:
      Math.random() > 0.5
        ? ScoutCanFirstAidEnum.False
        : ScoutCanFirstAidEnum.True,
    can_lead_campfire:
      Math.random() > 0.5
        ? ScoutCanLeadCampfireEnum.False
        : ScoutCanLeadCampfireEnum.True,
    can_make_sausage:
      Math.random() > 0.5
        ? ScoutCanMakeSausageEnum.False
        : ScoutCanMakeSausageEnum.True,
    can_set_fire:
      Math.random() > 0.5
        ? ScoutCanSetFireEnum.False
        : ScoutCanSetFireEnum.True,
    can_train_others:
      Math.random() > 0.5
        ? ScoutCanTrainOthersEnum.False
        : ScoutCanTrainOthersEnum.True,
    city: pickRandomEnglishName().concat('Town'),
    country: 'Hungary',
    first_name,
    last_name,
    id: nanoid(16),
    phone_number_1: nanoid(8).toLocaleLowerCase(),
    rank: pickRandomRank(),
    state: 'Hungary',
    troop_name: nanoid(),
    troop_number: 1 + Math.ceil(Math.random() * 99),
    troop_url: `https://www.${nanoid()}.example.com`
  };

  /* eslint-enable @typescript-eslint/naming-convention */
  return mock;
}
