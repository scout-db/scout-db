import { ScoutRankEnum } from "@kmcssz-org/scoutdb-common";

export const RANK_NAMES = Object.keys(ScoutRankEnum);

export function pickRandomRank(): ScoutRankEnum {
  const minIdx = 0;
  const maxIdx = RANK_NAMES.length - 1;
  const idx = Math.round(Math.random() * (maxIdx - minIdx) + minIdx);
  const randomRank = RANK_NAMES[idx];
  return randomRank as ScoutRankEnum;
}
