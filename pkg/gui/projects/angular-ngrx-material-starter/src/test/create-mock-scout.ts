import {
  Scout,
  ScoutBeenToJubileeEnum,
  ScoutCanCarveWoodEnum,
  ScoutCanCookEnum,
  ScoutCanFirstAidEnum,
  ScoutCanLeadCampfireEnum,
  ScoutCanMakeSausageEnum,
  ScoutCanSetFireEnum,
  ScoutCanTrainOthersEnum,
  ScoutRankEnum
} from '@kmcssz-org/scoutdb-common';
import { nanoid } from 'nanoid';

export function createMockScout(): Scout {
  /* eslint-disable @typescript-eslint/naming-convention */
  const mock: Scout = {
    email_1: `${nanoid()}-do-not-email@example.com`,
    been_to_jubilee:
      Math.random() > 0.5
        ? ScoutBeenToJubileeEnum.False
        : ScoutBeenToJubileeEnum.True,
    birth_year: 1971,
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
    city: 'Albertirsa',
    country: 'Hungary',
    first_name: Math.E.toExponential(5).toString(),
    last_name: Math.PI.toExponential(5).toString(),
    id: nanoid(),
    phone_number_1: nanoid(),
    rank: ScoutRankEnum.OV,
    state: 'Hungary',
    troop_name: nanoid(),
    troop_number: 1 + Math.ceil(Math.random() * 99),
    troop_url: `https://www.${nanoid()}.example.com`,
    jubilee_participant_years_csv: '2010,2000'
  };

  /* eslint-enable @typescript-eslint/naming-convention */
  return mock;
}
