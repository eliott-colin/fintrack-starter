const { todayMinus } = require('./seed.js');

describe('mocks temporels', () => {
  const realDateNow = Date.now;
  beforeAll(() => {
    Date.now = jest.fn(() => 1700000000000);
  });

  afterAll(() => {
    Date.now = realDateNow;
  });

  it('todayMinus retourne bien la date attendue', () => {
    const timestamp = todayMinus(0);
    expect(timestamp).toBe(new Date(1700000000000).toISOString());
  });
});
