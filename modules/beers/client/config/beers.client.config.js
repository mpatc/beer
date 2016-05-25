(function () {
  'use strict';

  angular
    .module('beers')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Beers',
      state: 'beers',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'beers', {
      title: 'List Beers',
      state: 'beers.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'beers', {
      title: 'Create Beer',
      state: 'beers.create',
      roles: ['user']
    });
  }
})();
