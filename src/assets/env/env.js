(function (window) {
  window['env'] = window['env'] || {};

  // Environment variables

  // if (window.location.hostname == 'localhost') {
  //  window['env']['host-efiling'] = 'http://localhost:8080/';

  // } else {
    // window['env']['host-efiling'] = 'https://e-commcourt.gov.in/';
    window['env']['host-efiling'] = 'https://uat.ecourt-dor.gov.in/';
    // window['env']['host-efiling'] = 'https://efiling.ecourt-dor.gov.in/';
    // window['env']['host-efiling'] = 'http://efiling-service:8080/';

    // for live
    // window['env-prod']['host-efiling'] = 'https://efiling.erct.gov.in/';

  // }

})(this); 