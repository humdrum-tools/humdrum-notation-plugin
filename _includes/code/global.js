//
// Programmer:    Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date: Sun Dec 23 01:47:54 EST 2018
// Last Modified: Sun Dec 23 01:47:57 EST 2018
// Filename:      _includes/code/global.js
// Syntax:        JavaScript 1.8.5/ECMAScript 5.1
// vim:           ts=3
//
// This file contains global functions for the Humdrum notation plugin.
//


{% if page.worker %}
//////////////////////////////
//
// DOMContentLoaded event listener --
//

document.addEventListener("DOMContentLoaded", function() {
	downloadVerovioToolkit("true");
});



//////////////////////////////
//
// downloadVerovioToolkit --
//

function downloadVerovioToolkit(use_worker) {
   vrvWorker = new vrvInterface(use_worker, callbackAfterInitialized);
};

function callbackAfterInitialized() {
	console.log("Initialized verovio worker");
	HNP.ready = 1;
	HNP.displayWaiting();
}

{% endif %}


//////////////////////////////
//
// setErrorScore --
//

function setErrorScore(baseid) {
	document.addEventListener("DOMContentLoaded", function() {
		HNP.setErrorScore(baseid);
	});
}



//////////////////////////////
//
// setHumdrumOption --
//

function setHumdrumOption(baseid, key, value) {
	if (typeof baseid  !== "string" && !(baseid instanceof String)) {
		console.log("Error: ID must be a string, but is", baseid, "which is a", typeof baseid);
		return;
	}
	if (typeof key  !== "string" && !(key instanceof String)) {
		console.log("Error: property must be a string, but is", key, "which is a", typeof baseid);
		return;
	}
	let entry = HNP.entries[baseid];
	if (!entry) {
		console.log("Error: ID does not reference a Humdrum notation script:", baseid);
		return;
	}
	if (!entry.options) {
		console.log("Error: entry", baseid, "does not have any options to change.");
		return;
	}
	entry.options[key] = value;
}



//////////////////////////////
//
// getHumdrumOption --
//

function getHumdrumOption(baseid, key) {
	if (typeof baseid  !== "string" && !(baseid instanceof String)) {
		console.log("Error: ID must be a string, but is", baseid, "which is a", typeof baseid);
		return;
	}
	if (typeof key  !== "string" && !(key instanceof String)) {
		console.log("Error: property must be a string, but is", key, "which is a", typeof baseid);
		return;
	}
	let entry = HNP.entries[baseid];
	if (!entry) {
		console.log("Error: ID does not reference a Humdrum notation script:", baseid);
		return;
	}
	if (!entry.options) {
		console.log("Error: entry", baseid, "does not have any options to change.");
		return;
	}
	return entry.options[key];
}



//////////////////////////////
//
// displayHumdrum -- Main externally usable function which sets up
//   a Humdrum notation display on a webpage (if it does not exist), and then
//   creates an SVG image for the notation.
//

function displayHumdrum(opts) {
	{% if page.worker %}
	if (HNP.ready) {
	{% else %}
	if (document.readyState === "complete" ||
			document.readyState === "loaded" ||
			document.readyState === "interactive") {
	{% endif %}
     	HNP.displayHumdrumNow(opts);
	} else {
		// Wait until the page has finished loading resources.
		HNP.waiting.push(opts);
		// document.addEventListener("DOMContentLoaded", function() {
		// 	HNP.displayHumdrumNow(opts);
		// });
	}
}

{% if page.worker %}
{% else %}
document.addEventListener("DOMContentLoaded", function() {
	HNP.displayWaiting();
});
{% endif %}


///////////////////////////////
//
// downloadHumdrumUrlData -- Download Humdrum data from a URL and then convert
//     the data into an SVG.
//

function downloadHumdrumUrlData(source, opts) {
	if (!source) {
		return;
	}
	if (!opts.processedUrl) {
		return;
	}
	if (opts.processedUrl.match(/^\s*$/)) {
		return;
	}
	let url = opts.processedUrl;
	let fallback = opts.urlFallback;
	let request = new XMLHttpRequest();

	request.addEventListener("load", function() {
		source.textContent = this.responseText;
		HNP.displayHumdrumNow(opts);
	});
	request.addEventListener("error", function() {
		downloadFallback(source, opts, fallback);
	});
	request.addEventListener("loadstart", function() {
		// display a busy cursor
		document.body.style.cursor = "wait !important";
	});
	request.addEventListener("loadend", function() {
		// display a normal cursor
		document.body.style.cursor = "auto";
	});
	request.open("GET", url);
	request.send();

}



//////////////////////////////
//
// downloadFallback -- Load alternate URL for data. Use embedded data if there is a problem.
//

function downloadFallback(source, opts, url) {
	if (!url) {
		HNP.displayHumdrumNow(opts);
	}

	let request = new XMLHttpRequest();
	request.onload = function() {
		if (this.status == 200) {
			source.textContent = this.responseText;
			HNP.displayHumdrumNow(opts);
		} else {
			HNP.displayHumdrumNow(opts);
		}
	};
	request.onerror = function() {
		HNP.displayHumdrumNow(opts);
	};
	request.open("GET", url);
	request.send();
}



//////////////////////////////
//
// checkParentResize --
//    Note that Safari does not allow shrinking of original element sizes, only 
//    expanding: https://css-tricks.com/almanac/properties/r/resize
//

function checkParentResize(baseid) {
	let entry = HNP.entries[baseid];
	if (!entry) {
		console.log("Error: cannot find data for ID", baseid);
		return;
	}
	let container = entry.container;
	if (!container) {
		console.log("Error: cannot find container for ID", baseid);
		return;
	}
	let pluginOptions = entry.options;
	if (!pluginOptions) {
		console.log("Error: cannot find options for ID", baseid);
		return;
	}
	let scale = pluginOptions.scale;
	let previousWidth = parseInt(pluginOptions._currentPageWidth * scale / 100.0);
	let style = window.getComputedStyle(container, null);
	let currentWidth = parseInt(style.getPropertyValue("width"));
	if (currentWidth == previousWidth) {
		// nothing to do
		return;
	}
	if (Math.abs(currentWidth - previousWidth) < 3)  {
		// Safari required hysteresis
		return;
	}
	// console.log("UPDATING NOTATION DUE TO PARENT RESIZE FOR", baseid);
	// console.log("OLDWIDTH", previousWidth, "NEWWIDTH", currentWidth);
	if (!HNP.MUTEX) {
		// This code is used to stagger redrawing of the updated examples
		// so that they do not all draw at the same time (given a little
		// more responsiveness to the UI).
		HNP.MUTEX = 1;
		displayHumdrum(baseid);
		HNP.MUTEX = 0;
	}
}



//////////////////////////////
//
// convertMusicXmlToHumdrum --
//

{% if page.worker %}
function convertMusicXmlToHumdrum(targetElement, sourcetext, vrvOptions, pluginOptions) {
	// let toolkit = pluginOptions.renderer;
	if (typeof vrvWorker !== "undefined") {
		toolkit = vrvWorker;
	}
{% else %}
function convertMusicXmlToHumdrum(sourcetext, vrvOptions, pluginOptions) {
	let toolkit = pluginOptions.renderer;
	if (typeof vrvToolkit !== "undefined") {
		toolkit = vrvToolkit;
	}
{% endif %}
	if (!toolkit) {
		console.log("Error: Cannot find verovio toolkit!");
		return;
	}
	// inputFrom = input data type
	vrvOptions.inputFrom = "musicxml-hum";

{% if page.worker %}
	vrvWorker.filterData(vrvOptions, sourcetext, "humdrum")
	.then(function(content) {
		targetElement.textContent = content;
		targetElement.style.display = "block";
	});
{% else %}
	toolkit.resetOptions();
	let svg = toolkit.renderData(sourcetext, vrvOptions);
	// don't want SVG, but rather Humdrum:
	let humdrum = toolkit.getHumdrum();
	return humdrum;
{% endif %}
}



//////////////////////////////
//
// getHumdrum -- Return the Humdrum data used to render the last
//    SVG image(s).  This Humdrum data is the potentially
//    filtered input Humdrum data (otherwise the last raw
//    Humdrum input data).
//

{% if page.worker %}
function getHumdrum(pluginOptions) {
	let toolkit = pluginOptions.renderer;
	if (typeof vrvWorker !== "undefined") {
		toolkit = vrvWorker;
	}
{% else %}
function getHumdrum(pluginOptions) {
	let toolkit = pluginOptions.renderer;
	if (typeof vrvToolkit !== "undefined") {
		toolkit = vrvToolkit;
	}
{% endif %}

	if (!toolkit) {
		console.log("Error: Cannot find verovio toolkit!");
		return;
	}

{% if page.worker %}
	vrvWorker.getHumdrum()
	.then(function(content) {
		return content;
	});
{% else %}
	let humdrum = toolkit.getHumdrum();
	return humdrum;
{% endif %}
}



//////////////////////////////
//
// convertMeiToHumdrum --
//

{% if page.worker %}
function convertMeiToHumdrum(targetElement, sourcetext, vrvOptions, pluginOptions) {
	let toolkit = pluginOptions.renderer;
	if (typeof vrvWorker !== "undefined") {
		toolkit = vrvWorker;
	}
{% else %}
function convertMeiToHumdrum(sourcetext, vrvOptions, pluginOptions) {
	let toolkit = pluginOptions.renderer;
	if (typeof vrvToolkit !== "undefined") {
		toolkit = vrvToolkit;
	}
{% endif %}

	if (!toolkit) {
		console.log("Error: Cannot find verovio toolkit!");
		return;
	}
	// inputFrom = input data type
	vrvOptions.inputFrom = "mei-hum";

{% if page.worker %}
	vrvWorker.filterData(vrvOptions, sourcetext, "humdrum")
	.then(function(content) {
		targetElement.textContent = content;
		targetElement.style.display = "block";
	});
{% else %}
	toolkit.resetOptions();
	let svg = toolkit.renderData(sourcetext, vrvOptions);
	// don't want SVG, but rather Humdrum:
	let humdrum = toolkit.getHumdrum();
	console.log("HUMDRUM IS", humdrum);
	return humdrum;
{% endif %}
}



//////////////////////////////
//
// getFilters -- Extract filters from the options and format for insertion
//    onto the end of the Humdrum data inpt to verovio.
//

function getFilters(options) {
	let filters = options.filter;
	if (!filters) {
		filters = options.filters;
	}
	if (!filters) {
		return "";
	}
	if (Object.prototype.toString.call(filters) === "[object String]") {
		filters = [filters];
	} else if (!Array.isArray(filters)) {
		// expected to be a string or array, so giving up
		return "";
	}
	let output = "";
	for (let i=0; i<filters.length; i++) {
		output += "!!!filter: " + filters[i] + "\n";
	}

	return output;
}



//////////////////////////////
//
// processHtml -- Extract PREHTML/POSTHTML content from file and 
//    place into div.PREHTML element and div.POSTHTML element.
//

function processHtml(entry) {
	// console.log("PROCESSHTML ENTRY", entry);
	if (!entry) {
		console.error("Error: No entry in processHtml");
		return;
	}
	if (!entry.humdrumOutput) {
		return;
	}
	let parameters = getHumdrumParameters(entry.humdrumOutput);
	// console.log("EXTRACTED PARAMETERS", parameters);

	if (!parameters) {
		return;
	}

	let preHtml = parameters.PREHTML;
	let postHtml = parameters.POSTHTML;

	let preElement = entry.container.querySelector("div.PREHTML");
	let postElement = entry.container.querySelector("div.POSTHTML");

	if (!preHtml) {
		if (preElement) {
			preElement.style.display = "none";
		}
	}
	if (!postHtml) {
		if (postElement) {
			postElement.style.display = "none";
		}
	}
	if (!preHtml && !postHtml) {
		return;
	}

	// Also deal with paged content: show preHtml only above first page
	// and postHtml only below last page.

	let lang = entry.options.lang || "";
	let langs = lang.split(/[^A-Za-z0-9_-]+/).filter(e => e);
	let preContent = "";
	let postContent = "";
	if (langs.length > 0) {
		for (let i=0; i<langs.length; i++) {
			if (preHtml) {
				preContent = preHtml[`CONTENT-${langs[i]}`];
			} 
			if (typeof preContent !== 'undefined') {
				break;
			}
		}
		for (let i=0; i<langs.length; i++) {
			if (postHtml) {
				postContent = postHtml[`CONTENT-${langs[i]}`];
			} 
			if (typeof postContent !== 'undefined') {
				break;
			}
		}
		if (typeof preContent === 'undefined') {
			if (preHtml) {
				preContent = preHtml.CONTENT;
			}
		}
		if (typeof postContent === 'undefined') {
			if (postHtml) {
				postContent = postHtml.CONTENT;
			}
		}
	} else {
		if (preHtml) {
			preContent = preHtml.CONTENT;
		}
		if (postHtml) {
			postContent = postHtml.CONTENT;
		}
	}

	preContent = applyParameters(text, parameters.PREHTML, parameters._REFS, langs);
	postContent = applyParameters(text, parameters.POSTHTML, parameters._REFS, langs);

	// Get the first content-lang parameter:
	if (typeof preContent === 'undefined') {
		if (preHtml) {
			for (var name in preHtml) {
				if (name.match(/^CONTENT/)) {
					preContent = preHtml[name];
					break;
				}
			}
		}
	}
	if (typeof postContent === 'undefined') {
		if (postHtml) {
			for (var name in postHtml) {
				if (name.match(/^CONTENT/)) {
					postContent = postHtml[name];
					break;
				}
			}
		}
	}

	let preStyle = "";
	let postStyle = "";

	if (preHtml) {
		preStyle = preHtml.STYLE || "";
	}
	if (postHtml) {
		postStyle = postHtml.STYLE || "";
	}

	if (!preContent) {
		if (preElement) {
			preElement.style.display = "none";
		}
	} else if (preElement) {
		preElement.style.display = "block";
		if (preStyle) {
			preElement.style.cssText = preStyle;
		}
		preElement.innerHTML = preContent;
	}

	if (!postContent) {
		if (postElement) {
			postElement.style.display = "none";
		}
	} else if (postElement) {
		postElement.style.display = "block";
		if (postStyle) {
			postElement.style.cssText = postStyle;
		}
		postElement.innerHTML = postContent;
	}
}



//////////////////////////////
//
// applyParameters --
//

function applyParameters(text, refs1, refs2, langs) {
	if (typeof text === "undefined") {
		return;
	}

	if (!langs) {
		langs = [];
	}

	for (let i=0; i<langs.length; i++) {
		let regex = /@\{(.*?)\}/g;
		text = text.replace(regex, function(value0, value1) {
			let output = "";
			console.warn("VALUE0", value0, "VALUE1", value1);
			let key = value1;
			let keyolang;
			let keylang;
	
			if (language) {
				keyolang = `${key}@@${language}`;
				keylang = `${key}@${language}`;
			}
	
			if ((typeof keyolang !== "undefined") && (typeof refs1 !== "undefined") && (typeof refs1[keyolang] !== "undefined")) {
				if (Array.isArray(refs1[keyolang])) {
					output = refs1[keyolang][0];
					return output;
				} else if (typeof refs1[keyolang] === "string") {
					output = refs1[keyolang];
					return output;
				}
			} else if ((typeof keylang !== "undefined") && (typeof refs1 !== "undefined") && (typeof refs1[keylang] !== "undefined")) {
				if (Array.isArray(refs1[keylang])) {
					output = refs1[keylang][0];
					return output;
				} else if (typeof refs1[keylang] === "string") {
					output = refs1[keylang];
					return output;
				}
			} else if ((typeof refs1 !== "undefined") && (typeof refs1[key] !== "undefined")) {
				if (Array.isArray(refs1[key])) {
					output = refs1[key][0];
					return output;
				} else if (typeof refs1[key] === "string") {
					output = refs1[key];
					return output;
				}
			} else if ((typeof keyolang !== "undefined") && (typeof refs2 !== "undefined") && (typeof refs2[keyolang] !== "undefined")) {
				if (Array.isArray(refs2[keyolang])) {
					output = refs2[keyolang][0].value;
					return output;
				} else if (typeof refs2[keyolang].value === "string") {
					output = refs2[keyolang].value;
					return output;
				}
			} else if ((typeof keylang !== "undefined") && (typeof refs2 !== "undefined") && (typeof refs2[keylang] !== "undefined")) {
				if (Array.isArray(refs2[keylang])) {
					output = refs2[keylang][0].value;
					return output;
				} else if (typeof refs2[keylang].value === "string") {
					output = refs2[keylang].value;
					return output;
				}
			} else if ((typeof refs2 !== "undefined") && (typeof refs2[key] !== "undefined")) {
				if (Array.isArray(refs2[key])) {
					output = refs2[key][0].value;
					return output;
				} else if (typeof refs2[key].value === "string") {
					output = refs2[key].value;
					return output;
				}
			}
			return output;

		});
	}

	return text;
}





//////////////////////////////
//
// getHumdrumParameters --
//

function getHumdrumParameters(humdrum) {
	let REFS = {};

	let atonlines = "";
	let lines = humdrum.split(/\r?\n/);
	let atonactive = "";

	for (let i=0; i<lines.length; i++) {
		if (!lines[i].match(/^!!/)) {
			continue;
		}
		let matches = lines[i].match(/^!!!\s*([^:]+)\s*:\s*(.*)\s*/);
		if (matches) {
			let key = matches[1];
			let value = matches[2];
			let item = {
				key: key,
				value: value,
				line: i+1
			};
			if (typeof REFS[key] === "undefined") {
				REFS[key] = item;
			} else if (Array.isArray(REFS[key]) == false) {
				REFS[key] = [ REFS[key], item ];
			} else {
				REFS[key].push(item);
			}
			continue;
		}
		matches = lines[i].match(/^!!(?!!)/);
		if (!matches) {
			continue;
		}
		let newline = lines[i].substr(2);
		if (atonactive) {
			atonlines += newline + "\n";
			let stringg = `^@@END:\\s*${atonactive}\\s*$`;
			let regex = new RegExp(stringg);
			if (newline.match(regex)) {
				atonactive = "";
			}
			continue;
		} else {
			matches = newline.match(/^@@BEGIN:\s*(.*)\s*$/);
			if (matches) {
				atonactive = matches[1];
				atonlines += newline + "\n";
			}
		}
	}

	let output = {};
	if (atonlines) {
		let aton = new ATON;
		try {
			output = aton.parse(atonlines);
		} catch (error) {
			console.error("Error in ATON data:\n", atonlines);
		}
	}
	output._REFS = REFS;

	return output;
}



//////////////////////////////
//
// executeFunctionByName -- Also allow variable names that store functions.
//

function executeFunctionByName(functionName, context /*, args */) {
	if (typeof functionName === "function") {
		return
	}
	let args = Array.prototype.slice.call(arguments, 2);
	let namespaces = functionName.split(".");
	let func = namespaces.pop();
	for (let i = 0; i < namespaces.length; i++) {
		context = context[namespaces[i]];
		if (context && context[func]) {
			break;
		}
	}
	return context[func].apply(context, args);
}



//////////////////////////////
//
// functionName --
//

function functionName(fun) {
  let ret = fun.toString();
  ret = ret.substr('function '.length);
  ret = ret.substr(0, ret.indexOf('('));
  return ret;
}





//////////////////////////////
//
// saveHumdrumSvg -- Save the specified Hudrum SVG images to the hard disk.  The input
// can be any of:
//    * A Humdrum script ID
//    * An array of Humdrum script IDs
//    * Empty (in which case all images will be saved)
//    * An SVG element
//

function saveHumdrumSvg(tags, savename) {
	if ((tags instanceof Element) && (tags.nodeName === "svg")) {
		// Save a single SVG element's contents to the hard disk.
		let sid = "";
		sid = tags.id;
		if (!sid) {
			sid = tags.parentNode.id;
		}
		let filename = savename;
		if (!filename) {
			filename = sid.replace(/-svg$/, "") + ".svg";
		}
		let text = tags.outerHTML.replace(/&nbsp;/g, " ").replace(/&#160;/g, " ");;
		blob = new Blob([text], { type: 'image/svg+xml' }),
		anchor = document.createElement('a');
		anchor.download = filename;
		anchor.href = window.URL.createObjectURL(blob);
		anchor.dataset.downloadurl = ['image/svg+xml', anchor.download, anchor.href].join(':');
		(function (anch, blobby, fn) {
			setTimeout(function() {
				anch.click();
				window.URL.revokeObjectURL(anch.href);
      		blobby = null;
			}, 0)
		})(anchor, blob, filename);
		return;
	}

	if (!tags) {
		// let selector = 'script[type="text/x-humdrum"]';
		let selector = '.humdrum-text[id$="-humdrum"]';
		let items = document.querySelectorAll(selector);
		tags = [];
		for (let i=0; i<items.length; i++) {
			let id = items[i].id.replace(/-humdrum$/, "");
			if (!id) {
				continue;
			}
			let ss = "#" + id + "-svg svg";
			let item = document.querySelector(ss);
			if (item) {
				tags.push(item);
			}
		}
	}
	if (tags.constructor !== Array) {
		tags = [tags];
	}

	(function (i, sname) {
		(function j () {
			let tag = tags[i++];
			if (typeof tag  === "string" || tag instanceof String) {
				let s = tag
				if (!tag.match(/-svg$/)) {
					s += "-svg";
				}
				let thing = document.querySelector("#" + s + " svg");
				if (thing) {
					saveHumdrumSvg(thing, sname);
				}
			} else if (tag instanceof Element) {
				(function(elem) {
					saveHumdrumSvg(elem, sname);
				})(tag);
			}
			if (i < tags.length) {
				// 100 ms delay time is necessary for saving all SVG images to
				// files on the hard disk.  If the time is too small, then some
				// of the files will not be saved.  This could be relate to
				// deleting the temporary <a> element that is used to download
				// the file.  100 ms is allowing 250 small SVG images to all
				// be saved correctly (may need to increase for larger files, or
				// perhaps it is possible to lower the wait time between image
				// saves).  Also this timeout (even if 0) will allow better
				// conrol of the UI vesus the file saving.
				setTimeout(j, 100);
			}
		})();
	})(0, savename);
}



//////////////////////////////
//
// saveHumdrumText -- Save the specified Hudrum text to the hard disk.  The input
// can be any of:
//    * A Humdrum script ID
//    * An array of Humdrum script IDs
//    * Empty (in which case all Humdrum texts will be saved)
//    * If the third parameter is present, then the first parameter will be ignored
//      and the text content of the third parameter will be stored in the filename
//      of the second parameter (with a default of "humdrum.txt").
//

function saveHumdrumText(tags, savename, savetext) {

	if (savetext) {
		// Saving literal text content to a file.
		if (!savename) {
			savename = "humdrum.txt";
		}
		// Unescaping < and >, which may cause problems in certain conditions, but not many:
		let stext = savetext.replace(/&lt;/g, "<").replace(/&gt;/g, ">");
		blob = new Blob([stext], { type: 'text/plain' }),
		anchor = document.createElement('a');
		anchor.download = savename;
		anchor.href = window.URL.createObjectURL(blob);
		anchor.dataset.downloadurl = ['text/plain', anchor.download, anchor.href].join(':');
		(function (anch, blobby) {
			setTimeout(function() {
				anch.click();
				window.URL.revokeObjectURL(anch.href);
      		blobby = null;
			}, 0)
		})(anchor, blob);
		return;
	}

	if ((tags instanceof Element) && (tags.className.match(/humdrum-text/))) {
		// Save the text from a single element.
		let sid = "";
		sid = tags.id;
		if (!sid) {
			sid = tags.parentNode.id;
		}
		let filename = savename;
		if (!filename) {
			filename = sid.replace(/-humdrum$/, "") + ".txt";
		}
		let text = tags.textContent.replace(/&lt;/g, "<").replace(/&gt;/g, ">");
		blob = new Blob([text], { type: 'text/plain' }),
		anchor = document.createElement('a');
		anchor.download = filename;
		anchor.href = window.URL.createObjectURL(blob);
		anchor.dataset.downloadurl = ['text/plain', anchor.download, anchor.href].join(':');
		anchor.click();
		window.URL.revokeObjectURL(anchor.href);
      blob = null;
		return;
	}

	if (typeof tags  === "string" || tags instanceof String) {
		// Convert a Humdrum ID into an element and save contents in that element.
		let myid = tags.replace(/-humdrum$/, "");
		let myelement = document.querySelector("#" + myid + "-humdrum");
		if (!myelement) {
			myelement = document.querySelector("#" + myid);
		}
		saveHumdrumText(myelement);
		return;
	}

	if (!tags) {
		// If tags is empty, then create a list of all elements that
		// should contain Humdrum content.
		let selector = '.humdrum-text[id$="-humdrum"]';
		tags = document.querySelectorAll(selector);
	}
	if (tags.constructor !== NodeList) {
		if (tags.constructor !== Array) {
			// Force tags to be in an array-like structure (not that necessary).
			tags = [tags];
		}
	}
	if (tags.length == 0) {
		// Nothing to do, so give up.
		return;
	}
	if (tags.length == 1) {
		// Just one element on the page with interesting content, so save that
		// to a filename based on the element ID.
		saveHumdrumText(tags[0]);
		return;
	}

	// At this point, there are multiple elements with Humdrum content that should
	// be saved to the hard-disk.  Combine all of the content into a single data
	// stream, and then save (with a default filename of "humdrum.txt").

	let outputtext = "";
	let humtext = "";
	for (let i=0; i<tags.length; i++) {
		if (!tags[i]) {
			continue;
		}
		if (typeof tags[i]  === "string" || tags[i] instanceof String) {
			saveHumdrumText(tags[i]);
			// convert a tag to an element:
			let s = tags[i];
			if (!tags[i].match(/-humdrum$/)) {
				s += "-humdrum";
			}
			let thing = document.querySelector("#" + s);
			if (thing) {
				tags[i] = thing;
			} else {
				continue;
			}
		}
		// Collect the Humdrum file text of the element.
		if (tags[i] instanceof Element) {
			let segmentname = tags[i].id.replace(/-humdrum$/, "");
			if (!segmentname.match(/\.[.]*$/)) {
				segmentname += ".krn";
			}
			humtext = tags[i].textContent.trim()
					// remove any pre-existing SEGMENT marker:
					.replace(/^!!!!SEGMENT\s*:[^\n]*\n/m, "");
			if (humtext.match(/^\s*$/)) {
				// Ignore empty elements.
				continue;
			}
			outputtext += "!!!!SEGMENT: " + segmentname + "\n";
			outputtext += humtext + "\n";
		}
	}
	// save all extracted Humdrum content in a single file:
	saveHumdrumText(null, null, outputtext);
}



//////////////////////////////
//
// cloneObject -- Make a deep copy of an object, preserving arrays.
//

function cloneObject(obj) {
	var output, v, key;
	output = Array.isArray(obj) ? [] : {};
	for (key in obj) {
		v = obj[key];
		if (v instanceof HTMLElement) {
			continue;
		}
		output[key] = (typeof v === "object") ? cloneObject(v) : v;
	}
	return output;
}



