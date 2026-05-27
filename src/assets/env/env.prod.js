(function (window) {
  window['env-prod'] = window['env-prod'] || {};

  // Environment variables
  //window['env-prod']['host-efiling'] = 'https://e-commcourt.gov.in/';
  window['env-prod']['host-efiling'] = 'https://efiling.ecourt-dor.gov.in/';
  // window['env-prod']['host-efiling'] = 'https://uat.ecourt-dor.gov.in/';
  //for live
  // window['env-prod']['host-efiling'] = 'https://efiling.erct.gov.in/';

})(this);


// ng build --base-href=/filingtoken/ --configuration development