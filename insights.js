"use strict";
(function() {

function loadScript(url, callback){
  let script = document.createElement("script");
  script.type = "text/javascript";

  if (script.readyState){  //IE
    script.onreadystatechange = function(){
      if (script.readyState == "loaded" ||
        script.readyState == "complete"){
        script.onreadystatechange = null;
        callback();
      }
    };
  }
  else {  //Others
    script.onload = function(){
      callback();
    };
  }

  script.src = url;
  document.getElementsByTagName("body")[0].appendChild(script);
}

function getHostNameFromUrl(url) {
  // <summary>Parses the domain/host from a given url.</summary>
  let a = document.createElement("a");
  a.href = url;
  // Handle chrome which will default to domain where script is called from if invalid
  return url.indexOf(a.hostname) != -1 ? a.hostname : '';
}

function loadReferrer() {
  let dateTime = Date.now();
  let timestamp = Math.floor(dateTime / 1000);
  let referrerInfo = localStorage.getItem('referrerInfo');
  if (referrerInfo) {
    referrerInfo = JSON.parse(referrerInfo);
  }

  // use 30mins time to check if this is same session.
  if (referrerInfo && typeof referrerInfo.timestamp !== 'undefined' && timestamp - referrerInfo.timestamp < 1800) {
    // check if campaign exists
    let url = window.location.href;
    let referrer = '';
    if (typeof document.referrer !== 'undefined') {
      referrer = document.referrer;
    }
    inbound.referrer.parse(url, referrer, function(err, visitInfo){
      if (typeof visitInfo.campaign !== 'undefined' && typeof referrerInfo.campaign === 'undefined') {
        referrerInfo.campaign = visitInfo.campaign;
      }
      referrerInfo.timestamp = timestamp;
      localStorage.setItem('referrerInfo', JSON.stringify(referrerInfo));
      trackVisit(referrerInfo);
    });
  }
  // someone visit this site over 30mins, it's a new visit anyway
  else {
    localStorage.removeItem('referrerInfo');
    let url = window.location.href;
    let referrer = '';
    if (typeof document.referrer !== 'undefined') {
      referrer = document.referrer;
    }
    inbound.referrer.parse(url, referrer, function (err, visitInfo) {
      visitInfo.landing = location.href.replace(location.origin, '');
      visitInfo.timestamp = timestamp;
      // set to localStorage because we need to make sure same browser with different tab has same referrer result.
      localStorage.setItem('referrerInfo', JSON.stringify(visitInfo));
      trackVisit(visitInfo);
    });
  }

  // remove unused params
  let queue_id = location.search.match(/civimail_x_q=(\d+)/);
  let url_id = location.search.match(/civimail_x_u=(\d+)/);
  if (queue_id && url_id) {
    if (typeof URLSearchParams === 'function') {
      let searchParams = new URLSearchParams(window.location.search);
      searchParams.delete("civimail_x_q");
      searchParams.delete("civimail_x_u");
      let newQuery = '';
      if (searchParams.toString() === '') {
        newQuery = '';
      }
      else {
        newQuery = '?'+searchParams.toString();
      }
      let newUrl = window.location.origin+window.location.pathname+newQuery;
      window.history.replaceState({}, null, newUrl);
    }
  }
}

function trackVisit(visitInfo) {
  let object = {};
  if (location.href.match(/civicrm\/event\/(register|info)/)) {
    object['page_type'] = 'civicrm_event';
  }
  else if (location.href.match(/civicrm\/contribute\/transact/)) {
    object['page_type'] = 'civicrm_contribution_page';
  }
  else if (location.href.match(/civicrm\/profile\/create/)) {
    object['page_type'] = 'civicrm_uf_group';
  }
  let page_id = location.search.match(/id=(\d+)/);
  if (page_id) {
    object['page_id'] = page_id[1];
  }
  if (!object['page_type'] || !object['page_id']) {
    return;
  }

  // prepare
  object['landing'] = visitInfo.landing ? visitInfo.landing : '';
  object['referrer_type'] = visitInfo.referrer.type;
  object['referrer_network'] = '';
  object['referrer_url'] = '';
  // detect if from civimail mailing list
  let queue_id = location.search.match(/civimail_x_q=(\d+)/);
  let url_id = location.search.match(/civimail_x_u=(\d+)/);
  if (queue_id && url_id) {
    object['referrer_type'] = 'email';
    object['referrer_network'] = 'civimail';
    object['referrer_url'] = 'external/url.php?qid='+queue_id[1]+'&u='+url_id[1];
    if (typeof URLSearchParams === 'function') {
      let searchParams = new URLSearchParams(window.location.search);
      searchParams.delete("civimail_x_q");
      searchParams.delete("civimail_x_u");
      let newQuery = '?'+searchParams.toString();
      let newUrl = window.location.origin+window.location.pathname+newQuery;
      window.history.replaceState({}, null, newUrl);
    }
  }
  switch(object['referrer_type']){
    case 'ad':
      object['referrer_network'] = visitInfo.referrer.network;
      break;
    case 'direct':
      object['referrer_network'] = '';
      break;
    case 'email':
      if (typeof visitInfo.referrer.client !== 'undefined' && visitInfo.referrer.client !== 'unknown') {
        object['referrer_network'] = visitInfo.referrer.client;
      }
      break;
    case 'internal':
      object['referrer_network'] = '';
      break;
    case 'link':
      object['referrer_network'] = getHostNameFromUrl(visitInfo.referrer.from);
      if (typeof visitInfo.referrer.from !== 'undefined') {
        object['referrer_url'] = visitInfo.referrer.from;
      }
      break;
    case 'local':
      object['referrer_network'] = visitInfo.referrer.site;
      break;
    case 'search':
      object['referrer_network'] = visitInfo.referrer.engine;
      break;
    case 'social':
      object['referrer_network'] = visitInfo.referrer.network;
      break;
    default:
      object['referrer_type'] = 'unknown';
      object['referrer_network'] = '';
      break;
  }
  if (typeof visitInfo.campaign !== 'undefined') {
    for(let utmKey in visitInfo.campaign) {
      object[utmKey] = visitInfo.campaign[utmKey];
    }
  }
  if (typeof navigator.doNotTrack === 'string' && navigator.doNotTrack == '1') {
    object['referrer_type'] = 'unknown';
    object['referrer_network'] = '';
    object['referrer_url'] = '';
  }

  const url = '/civicrm/ajax/track';
  const data = 'data='+encodeURIComponent(JSON.stringify(object));
  fetch(url, {
    method: "POST",
    headers: {
      'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    body: data
  });
}

;
if (typeof document.currentScript === 'object' && typeof document.currentScript.src === 'string') {
  let inboundSrc = document.currentScript.src;
  inboundSrc = inboundSrc.replace('insights.js', 'inbound.js');
  loadScript(inboundSrc, function(){ loadReferrer(); });
}
else if (typeof Drupal !== 'undefined' && typeof Drupal.settings !== 'undefined') {
  let inboundSrc = Drupal.settings.civicrm.resourceBase+'js/inbound.js';
  loadScript(inboundSrc, function(){ loadReferrer(); });
}
else if (typeof drupalSettings !== 'undefined') {
  let inboundSrc = drupalSettings.civicrm.resourceBase+'js/inbound.js';
  loadScript(inboundSrc, function(){ loadReferrer(); });
}

})();