const dems = 950; 
const secondms = 1050 - dems; 
const sleep = (time) => new Promise((r) => setTimeout(r, time));
var isblocking = false;
var issecondblock = false;
var prebeforedt = Date.now();
console.log("mdunblock,start " + isblocking + ",," + issecondblock + ",," + prebeforedt);
console.log("mdunblock,dems " + dems + ",secondms," + secondms  );

async function mdunBlockLite(requestDetails) {
  chrome.declarativeNetRequest.updateEnabledRulesets( {enableRulesetIds: ["ruleset_1"] })
  isblocking = true;
  let pt = Date.now();
  diffpt = pt - prebeforedt;
  let sleeptime = dems - diffpt;  
  console.log("mdunblock,sleeptime " + sleeptime);
  await sleep(sleeptime);	
  if (issecondblock == true) {
	console.log("mdunblock,2nd sleeptime " + secondms);
    await sleep(secondms);	
    sleeptime += secondms;
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

