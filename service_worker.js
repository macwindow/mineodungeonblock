const sleep = (time) => new Promise((r) => setTimeout(r, time));
var isblocking = false;
var issecondblock = false;
var prebeforedt = Date.now();
console.log("mdunblockMV3,start " + isblocking + ",," + issecondblock + ",," + prebeforedt);

async function mdunBlockLite(requestDetails) {
  const dems = 960; 
  chrome.declarativeNetRequest.updateEnabledRulesets( {enableRulesetIds: ["ruleset_1"] })
  isblocking = true;
  let pt = Date.now();
  diffpt = pt - prebeforedt;
  let sleeptime = dems - diffpt;  
  await sleep(sleeptime);	
  if (issecondblock == true) {
    await sleep(100);	
    sleeptime += 100;
  }
  chrome.declarativeNetRequest.updateEnabledRulesets( {disableRulesetIds: ["ruleset_1"] })
  isblocking = false;
  issecondblock = false;
}

chrome.webRequest.onBeforeSendHeaders.addListener(
  function(details) {
    mdunBlockLite(details)
  },
  { urls: [ "*://dungeon.king.mineo.jp/qa-dungeon-api/qa-dungeon-log-insert-api*"] },
 );

chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    if (isblocking == true ) {
      issecondblock = true;
    }
    prebeforedt = details.timeStamp;
  },
  { urls: [ "*://dungeon.king.mineo.jp/qa-dungeon-api/qa-dungeon-log-insert-api*"] },
 );

