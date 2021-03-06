/**
 * Created by Joe on 7/26/16.
 */

// lazyload config
(function() {
  'use strict';
  angular
    .module('app')
    .constant('MODULE_CONFIG', [
      {
        name: 'ui.bootstrap',
        module: true,
        serie: true,
        files: [
          // 'libs/angular/angular-bootstrap/ui-bootstrap-tpls.min.js'
          '//cdn.bootcss.com/angular-ui-bootstrap/2.5.0/ui-bootstrap-tpls.js'
        ]
      },
      {
        name: 'mgcrea.ngStrap',
        module: true,
        files: [
          '../assets/angular-motion/dist/angular-motion.min.css',
          '../assets/bootstrap-additions/dist/bootstrap-additions.min.css',
          '../libs/angular/angular-strap/dist/angular-strap.min.js',
          '../libs/angular/angular-strap/dist/angular-strap.tpl.min.js'
        ]
      },
      {
        name: 'plot',
        module: false,
        files: [
          '../libs/jquery/flot/jquery.flot.js',
          '../libs/jquery/flot/jquery.flot.resize.js',
          '../libs/jquery/flot/jquery.flot.pie.js',
          '../libs/jquery/flot.tooltip/js/jquery.flot.tooltip.min.js',
          '../libs/jquery/flot-spline/js/jquery.flot.spline.min.js'
        ]
      },
      {
        name: 'moment',
        module: false,
        files: [
          '../libs/js/moment/min/moment-with-locales.min.js'
        ]
      },
      {
        name: 'toastr',
        module: true,
        files: [
          '../libs/angular/angular-toastr/angular-toastr.tpls.min.js',
          '../libs/angular/angular-toastr/angular-toastr.min.css'
        ]
      },
      {
        name: 'jsencrypt',
        module: false,
        files: [
          '../libs/js/JSEncrypt/jsencrypt.js'
        ]
      },
      {
        name: 'plot',
        module: false,
        files: [
          '../libs/jquery/flot/jquery.flot.js',
          '../libs/jquery/flot/jquery.flot.resize.js',
          '../libs/jquery/flot/jquery.flot.pie.js',
          '../libs/jquery/flot.tooltip/js/jquery.flot.tooltip.min.js',
          '../libs/jquery/flot-spline/js/jquery.flot.spline.min.js'
        ]
      },
      {
        name: 'ui.select',
        module: true,
        files: [
          '../libs/angular/angular-ui-select/dist/select.min.js',
          '../libs/angular/angular-ui-select/dist/select.min.css'
        ]
      }
    ])
    .config(['$ocLazyLoadProvider', 'MODULE_CONFIG', function($ocLazyLoadProvider, MODULE_CONFIG) {
      $ocLazyLoadProvider.config({
        debug: false,
        events: false,
        modules: MODULE_CONFIG
      });
    }]);


})();
