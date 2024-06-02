import { createMockScout } from './create-mock-scout';

describe('createMockScout', () => {
  it('generates scouts with unique IDs', () => {
    const testSetSize = 1000;
    const setOfIds = new Set();
    for (let i = 0; i < testSetSize; i++) {
      const scout = createMockScout();
      setOfIds.add(scout.id);
    }
    expect(setOfIds.size).toEqual(testSetSize);
  });
});
