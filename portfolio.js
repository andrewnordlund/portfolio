let dbug = true;
let payload = {};

function init() {
	let els = {"contents" : null};

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
		let catSect = createHTMLElement("section", {"parentNode" : els["contents"]});
		if (payload[sect]["info"]) {
			let ppH2 = createHTMLElement("h2", {"parentNode": catSect, "textNode":sect});
			let explDiv = createHTMLElement("div", {"parentNode" : catSect, "innerHTML" : payload[sect]["info"]});
		}
		for (let pp in payload[sect]["projects"]) {
			let projSect = createHTMLElement("section", {"parentNode" : catSect});
			let ppH3 = createHTMLElement("h3", {"parentNode" : projSect, "textNode":pp});
			if (payload[sect]["projects"][pp]["link"]) {
				if (payload[sect]["projects"][pp]["link"].length > 0 ) {
					let linkSect = createHTMLElement("sect", {"parentNode" : projSect});
					let linkH = createHTMLElement("h4", {"parentNode" : linkSect, "textNode" : "Links"});
			
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
				let tagSect = createHTMLElement("sect", {"parentNode" : projSect});
				let tagH = createHTMLElement("h4", {"parentNode" : tagSect, "textNode" : "Keywords"});
				let tagOL = createHTMLElement("ol", {"parentNode" : tagSect});
				for (let i = 0; i < payload[sect]["projects"][pp]["tags"].length; i++) {
					let tagLi = createHTMLElement("li", {"parentNode" : tagOL, "class" : "tag", "textNode" : payload[sect]["projects"][pp]["tags"][i]});
				
				}
			}
		}
	}



} // End of init



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
