'use strict';

describe('Beers E2E Tests:', function () {
  describe('Test Beers page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/beers');
      expect(element.all(by.repeater('beer in beers')).count()).toEqual(0);
    });
  });
});
