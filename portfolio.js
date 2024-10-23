let dbug = true;
let payload = {};
let els = {
	"contents" : null,
	"summary" : null,
	"ariaLivePolite" : null
};
let summary = {
	"category" : {},
	"tags" : {},
}
let sep = "|";

let filters = {};
let hiding=[];

function init() {

	getFiltersFromURL();

	for (let el in els) {
		els[el] = document.getElementById(el);
		if (!els[el]) {
			console.error(`Couldn't get ${el}.`);
			continue;
		}
	}
	if (dbug) console.log ("Initting");
	// Do Personal projects
	for (let sect in payload) {
		let catSect = createHTMLElement("section", {"parentNode" : els["contents"], "class" : "category", "id" : sect.replace(" ", "-")});
		if (!summary["category"][sect]) {
			summary["category"][sect] = {"projects" : {"count" : 0}};
		}



		if (payload[sect]["info"]) {
			let ppH2 = createHTMLElement("h2", {"parentNode": catSect, "textNode":sect});
			let explDiv = createHTMLElement("div", {"parentNode" : catSect, "innerHTML" : payload[sect]["info"]});
		}
		for (let pp in payload[sect]["projects"]) {
			summary["category"][sect]["projects"]["count"] += 1;
			let projSect = createHTMLElement("section", {"parentNode" : catSect, "class" : "project"});
			let ppH3 = createHTMLElement("h3", {"parentNode" : projSect, "textNode":pp});
			if (payload[sect]["projects"][pp]["link"]) {
				if (payload[sect]["projects"][pp]["link"].length > 0 ) {
					let linkSect = createHTMLElement("sect", {"parentNode" : projSect});
					let linkH = createHTMLElement("h4", {"parentNode" : linkSect, "textNode" : "Links", "class" : "sr-only"});
			
					if (payload[sect]["projects"][pp]["link"].length == 1) {
						let linkP = createHTMLElement("p", {"parentNode" : linkSect});
						let linkA = createHTMLElement("a", {"parentNode" : linkP, "href" : payload[sect]["projects"][pp]["link"][0]["url"], "textNode" : payload[sect]["projects"][pp]["link"][0]["text"]});
					} else if (payload[sect]["projects"][pp]["link"].length > 1) {
						let linkOL = createHTMLElement("ol", {"parentNode" : linkSect});
						for (let i = 0; i < payload[sect]["projects"][pp]["link"].length; i++) {
							let linkLi = createHTMLElement("li", {"parentNode" : linkOL});
							let linkA = createHTMLElement("a", {"parentNode" : linkLi, "href" : payload[sect]["projects"][pp]["link"][i]["url"], "textNode" : payload[sect]["projects"][pp]["link"][i]["text"]});
							
						}
					}
				}
			}
			let ppSect = createHTMLElement("section", {"parentNode" : projSect});
			if (payload[sect]["projects"][pp]["sig"]) {
				let sigH = createHTMLElement("h4", {"parentNode" : ppSect, "textNode": "Significance"});
				let sig = createHTMLElement("div", {"parentNode" : ppSect, "innerHTML" : payload[sect]["projects"][pp]["sig"]});
			}
			if (payload[sect]["projects"][pp]["tags"]) {
				let tagSect = createHTMLElement("section", {"parentNode" : projSect});
				let tagH = createHTMLElement("h4", {"parentNode" : tagSect, "textNode" : "Keywords", "class" : "sr-only"});
				let tagOL = createHTMLElement("ol", {"parentNode" : tagSect, "class" : "tags"});
				for (let i = 0; i < payload[sect]["projects"][pp]["tags"].length; i++) {
					let tag = payload[sect]["projects"][pp]["tags"][i];
					let tagLi = createHTMLElement("li", {"parentNode" : tagOL, "class" : "tag"});
					let tagBtn = createHTMLElement("button", {"parentNode" : tagLi, "textNode" : tag});
					tagBtn.addEventListener("click", toggleTag, false);
					
					if (summary["tags"][tag]) {
						summary["tags"][tag]["count"] += 1;
					} else {
						summary["tags"][tag] = {"count" : 1, "name" : tag, "show" : true}
					}
					projSect.classList.add(tag.replace(" ", "-"));
				}
			}
		}
	}

	if (els["summary"]) {
	
		let summaryOL = createHTMLElement ("ol", {"parentNode" : els["summary"]});
		for (let sect in summary["category"]) {
			let sectLI = createHTMLElement("li", {"parentNode" : summaryOL});
			let sectA = createHTMLElement("a", {"parentNode" : sectLI, "textNode": sect, "href":"#" + sect.replace(" ", "-")});
			let countSpan = createHTMLElement("span", {"parentNode" : sectLI, "textNode" : "(" + summary["category"][sect]["projects"]["count"] + ")"});
		}

		let filterDialog = createHTMLElement("dialog", {"parentNode" : els["summary"], "id" : "filtersDialog"});
		let filterDiv = createHTMLElement("div", {"parentNode" : filterDialog});
		let filterH2 = createHTMLElement("h2", {"parentNode" : filterDiv, "textNode": "Filters"});
		let filterH3 = createHTMLElement("h3", {"parentNode" : filterDiv, "textNode": "Showing"});

		let tagsOL = createHTMLElement("ol", {"parentNode" : filterDiv});
		for (let tag in summary["tags"]) {
			let tagLI = createHTMLElement("li", {"parentNode" : tagsOL});
			let tagChk = createHTMLElement("input", {"parentNode" : tagLI, "type" : "checkbox", "id" :  summary["tags"][tag]["name"] + "Chk", "checked" : (hiding.includes(summary["tags"][tag]["name"]) ? "false" : "true")});
			let tagLbl = createHTMLElement("label", {"parentNode" : tagLI, "for" : summary["tags"][tag]["name"] + "Chk", "textNode" : summary["tags"][tag]["name"] + " (" + summary["tags"][tag]["count"] + ")"});
		}

		let filterBtn = createHTMLElement("button", {"parentNode" : els["summary"], "class" : "filterBtn", "id" : "filterBtn", "textNode" : "Filters", "type" : "button"});
		filterBtn.addEventListener("click", showFilters, false);

	}


} // End of init

function toggleTag (e) {
	let tag = e.target.textContent.replace(" ", "-");
	console.log ("Toggling tag " + tag + ".");
	let url = new URL(document.location);
	let params = url.searchParams;
	let newURL = url.toString().replace(/#.*$/, "");
	let hiding = [];
	if (params.get("show")) {
		hiding = params.get("show").split(sep);
		let spot = hiding.indexOf(tag);
		if (spot == -1) {
			hiding.push(tag);
			setLiveMessage ("Showing only " + hiding.join(", "));
			hide (hiding);
		} else {
			hiding.splice(spot, 1);
			if (hiding.length == 0) {
				setLiveMessage ("Showing all.");
			} else {
				setLiveMessage ("Showing only " + hiding.join(", "));
			}
		}
		//newURL = newURL.replace(/\?.*$/, "");
	
	} else {
		hiding.push(tag);
		hide (hiding);
		setLiveMessage ("Showing only " + hiding.join(", "));
		//newURL = newURL.replace(/\?.*$/, "");
		//newURL += "?show=" + e.target.textContent.replace(" ", "-");
	}
	newURL = (hiding.length > 0 ? "?show=" + hiding.join(sep) : newURL.replace(/\?.*$/, ""));
	history.pushState({}, document.title, newURL);

} // End of toggleTag

function hide (hiding) {
	let selector = "section.project:not(." + hiding.join(", .") + ")";
	console.log ("Getting " + selector + ".");
	let others = document.querySelectorAll(selector);
	console.log ("Got " + others.length + ".");
	for (let i = 0; i < others.length; i++) {
		others[i].classList.add("hide");
	}
} // End of hide

function show (showing) {

} // End of show

function showFilters (e) {
  let filtersDialog = null;
  filtersDialog = document.getElementById("filtersDialog");
  if (filtersDialog) filtersDialog.showModal();
} // End of showFilters


function getFiltersFromURL() {
	let url = new URL(document.location);
	let params = url.searchParams;
//	let hiding = [];
	if (params.get("show")) {
		hiding = params.get("show").split(sep);
	}
} // End of getFiltersFromURL


function createHTMLElement (type, attribs) {
	let newEl = document.createElement(type);
	let fdbug = (arguments.length == 3 && arguments[2] != null && arguments[2] != false ? true : false);
	for (let k in attribs) {
		if (fdbug) console.log("Dealing with attrib " + k + ".");
		if (k == "parentNode") {
			if (fdbug) console.log("Dealing with parentnode.");
			let parentNode = getHTMLElement(attribs[k], dbug);

			try {
				if (attribs.hasOwnProperty("insertBefore")) {
					var beforeEl = getHTMLElement(attribs["insertBefore"], dbug);
					parentNode.insertBefore(newEl, beforeEl);
				} else if (attribs.hasOwnProperty("insertAfter")) {
					var afterEl = getHTMLElement(attribs["insertAfter"], dbug);
					parentNode.insertBefore(newEl, afterEl.nextSibling);
				} else {
					parentNode.appendChild(newEl);
				}
			}
			catch (er) {
				console.error("Error appending newEl to parentNode: " + er.message + ".");
			}
		} else if (k == "textNode" || k == "nodeText") {
			if (fdbug) console.log("Dealing with textnode " + attribs[k] + ".");
			if (typeof (attribs[k]) == "string") {
				if (fdbug) console.log("As string...");
				newEl.appendChild(document.createTextNode(attribs[k]));
			} else if (attribs[k] instanceof HTMLElement) {
				if (fdbug) console.log("As HTML element...");
				newEl.appendChild(attribs[k]);
			} else {
				if (fdbug) console.log("As something else...");
				newEl.appendChild(document.createTextNode(attribs[k].toString()));
			}
		} else if (k == "innerHTML") {
			if (fdbug) console.log ("Dealing with innerHTML " + attribs[k] + ".");
			newEl.innerHTML = attribs[k];
		} else if (k.match(/^insert(Before|After)$/)) {
				// Do nothing.
		} else {
			newEl.setAttribute(k, attribs[k]);
		}
	}
	return newEl;
} // End of createHTMLElement

function getHTMLElement (el) {
	let rv = null;
	let fdbug = (((arguments.length == 2 && arguments[1] != null && arguments[1] != undefined && arguments[1] !== false) || dbug == true) ? true : false); 
	//var iwin = window;
	if (el instanceof HTMLElement) { // || el instanceof iwin.HTMLElement) {
		rv = el;
	} else if (el instanceof String || typeof(el) === "string") {
		try {
			if (fdbug) console.log ("Trying to getHTMLElement " + el + ".");
			rv = document.getElementById(el);
		} catch (er) {
			console.error("Error getting HTML Element #" + el + ".  Apparently that's not on this page.");
		}
	}
	return rv;
} // End of getHTMLElement


function removeChildren (el) {
	var dbug = (arguments.length == 2 && arguments[1] != null && arguments[1] != false ? true : false);
	while (el.firstChild) {	
		el.removeChild(el.firstChild);
	}
} // End of removeChildren

function setLiveMessage (msg) {
	els["ariaLivePolite"].textContent = msg;
	setTimeout (function () {els["ariaLivePolite"].textContent = "";}, 5000);
} // End of setLiveMessage

async function getDataFile () {
	let response = await fetch("portfolio.json");
	if (response.ok) { // if HTTP-status is 200-299
		payload = await response.json();
		if (dbug) console.log ("Got json: "  + JSON.stringify(payload) + ".");
	} else {
		console.error ("HTTP-Error: " + response.status);
	}
	console.log ("About to init");
	init();
} // End of getDataFile

if (dbug) console.log ("Finished loading portfolio.js.");
document.addEventListener('DOMContentLoaded', getDataFile, false);

