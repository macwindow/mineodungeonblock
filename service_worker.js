//ブロック時間中はキー入力を受け付けない

const sleep = (time) => new Promise((r) => setTimeout(r, time)); //timeはミリ秒
var isblocking = false;
var presendt = Date.now();
var prebeforedt = Date.now();
var issecondblock = false;
console.log("mdunB2,start " + isblocking + ",," + issecondblock + ",," + prebeforedt);

function beforeRequestDiff(requestDetails) {
	prebeforedt = requestDetails.timeStamp;
}
function secondBlock(requestDetails) {
	if (isblocking == true ) {
			issecondblock = true;
	}
}

// 980でも大丈夫そうEdge だが 20250724_19:55 
// 960なら完全に大丈夫
async function mdunBlockLite(requestDetails) {
	//let cid = requestDetails.timeStamp;
	const dems = 960; //歩きでブロックされないmsec
	if (isblocking == false) {
		chrome.declarativeNetRequest.updateEnabledRulesets( {enableRulesetIds: ["ruleset_1"] })
	 	isblocking = true;
		let pt = Date.now();
		diffpt = pt - prebeforedt;
		let sleeptime = dems - diffpt;  // beforeRequestからdemsミリ秒ブロックする)
		await sleep(sleeptime);	
		if (issecondblock == true) {
			console.log("mdunB2,★★★★★★secondBlock");
			// dems終わったあとに 追加
			await sleep(100);	
			sleeptime += 100;
		}
		chrome.declarativeNetRequest.updateEnabledRulesets( {disableRulesetIds: ["ruleset_1"] })
		isblocking = false;
		issecondblock = false;

		cid = requestDetails.timeStamp;
		let ct = Date.now();
		// prebeforedt = pt - diffpt;
		//diff = ct - prebeforedt;
		diff = ct - ( pt - diffpt);
		diffcid = cid - presendt;
		presendt = cid;
		//console.log("mdunB2,★after,isblock,,cid " + cid + ",," + isblocking + ",," + issecondblock + ",," + ct);
		console.log("mdunB2,★after,isblock,,cid " + cid );
		console.log("mdunB2,sleep time " + cid + ",," + sleeptime);
		console.log("mdunB2,diff cid(sendinterval)," + diffcid);
		console.log("mdunB2,diff ct (ct-prereq)," + diff);
	}
}

chrome.webRequest.onBeforeSendHeaders.addListener(
   function(details) {
	//console.log("mdunB2,onBeforeSendHeaders,,notblock▼▼▼ addListener");
 	//mdunBlock(details);
	mdunBlockLite(details)
   },
  	{ urls: [ "*://dungeon.king.mineo.jp/qa-dungeon-api/qa-dungeon-log-insert-api*"] },
 );

chrome.webRequest.onBeforeRequest.addListener(
   function(details) {
	console.log("mdunB2,○○○○onBefore addListener");
	//secondBlock(details);
	//beforeRequestDiff(details)
	if (isblocking == true ) {
			issecondblock = true;
	}
	prebeforedt = details.timeStamp;
   },
  	{ urls: [ "*://dungeon.king.mineo.jp/qa-dungeon-api/qa-dungeon-log-insert-api*"] },
 );

