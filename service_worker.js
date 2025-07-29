const dems = 950; 
const secondms = 1050 - dems; 
const sleep = (time) => new Promise((r) => setTimeout(r, time));
var isblocking = false;
var issecondblock = false;
var precid = Date.now();
console.log("mdunblock,start " + isblocking + ",," + issecondblock );
console.log("mdunblock,dems " + dems + ",secondms," + secondms  );

async function mdunBlockLite(requestDetails) {
  chrome.declarativeNetRequest.updateEnabledRulesets( {enableRulesetIds: ["ruleset_1"] })
  isblocking = true;
  curcid = requestDetails.timeStamp;
  senddiff = curcid - precid;
  console.log("mdunblock,senddiff " + senddiff );
  await sleep(dems);	
  if (issecondblock == true) {
    await sleep(secondms);	
	console.log("mdunblock,2nd sleeptime " + secondms );
  }
  chrome.declarativeNetRequest.updateEnabledRulesets( {disableRulesetIds: ["ruleset_1"] })
  precid = curcid;
  issecondblock = false;
  isblocking = false;
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
  },
  { urls: [ "*://dungeon.king.mineo.jp/qa-dungeon-api/qa-dungeon-log-insert-api*"] },
 );

