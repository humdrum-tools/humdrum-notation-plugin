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
	var entry = HNP.entries[baseid];
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
	var entry = HNP.entries[baseid];
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
	if (document.readyState === "complete" ||
	    document.readyState === "loaded" ||
	    document.readyState === "interactive") {
     	HNP.displayHumdrumNow(opts);
	} else {
		// Wait until the page has finished loading resources.
		document.addEventListener("DOMContentLoaded", function() {
			HNP.displayHumdrumNow(opts);
		});
	}
}



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
	var url = opts.processedUrl;
	var fallback = opts.urlFallback;
	var request = new XMLHttpRequest();

	request.onload = function() {
		if (this.status == 200) {
			source.innerHTML = this.responseText;
			HNP.displayHumdrumNow(opts);
		} else {
			downloadFallback(source, opts, fallback);
		}
	};
	request.onerror = function() {
		downloadFallback(source, opts, fallback);
	};
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

	var request = new XMLHttpRequest();
	request.onload = function() {
		if (this.status == 200) {
			source.innerHTML = this.responseText;
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
	var entry = HNP.entries[baseid];
	if (!entry) {
		console.log("Error: cannot find data for ID", baseid);
		return;
	}
	var container = entry.container;
	if (!container) {
		console.log("Error: cannot find container for ID", baseid);
		return;
	}
	var pluginOptions = entry.options;
	if (!pluginOptions) {
		console.log("Error: cannot find options for ID", baseid);
		return;
	}
	var scale = pluginOptions.scale;
	var previousWidth = parseInt(pluginOptions._currentPageWidth * scale / 100.0);
	var style = window.getComputedStyle(container, null);
	var currentWidth = parseInt(style.getPropertyValue("width"));
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

function convertMusicXmlToHumdrum(sourcetext, vrvOptions, pluginOptions) {
	var toolkit = pluginOptions.renderer;
	if (typeof vrvToolkit !== "undefined") {
		toolkit = vrvToolkit;
	}
	if (!toolkit) {
		console.log("Error: Cannot find verovio toolkit!");
		return;
	}
	// format = input data type
	vrvOptions.inputFormat = "musicxml-hum";
	var svg = toolkit.renderData(sourcetext, vrvOptions);
	// don't want SVG, but rather Humdrum:
	var humdrum = toolkit.getHumdrum();
	return humdrum;
}



//////////////////////////////
//
// convertMeiToHumdrum --
//

function convertMeiToHumdrum(sourcetext, vrvOptions, pluginOptions) {
	var toolkit = pluginOptions.renderer;
	if (typeof vrvToolkit !== "undefined") {
		toolkit = vrvToolkit;
	}
	if (!toolkit) {
		console.log("Error: Cannot find verovio toolkit!");
		return;
	}
	// format = input data type
	vrvOptions.inputFormat = "mei-hum";
	var svg = toolkit.renderData(sourcetext, vrvOptions);
	// don't want SVG, but rather Humdrum:
	var humdrum = toolkit.getHumdrum();
	console.log("HUMDRUM IS", humdrum);
	return humdrum;
}



//////////////////////////////
//
// getFilters -- Extract filters from the options and format for insertion
//    onto the end of the Humdrum data inpt to verovio.
//

function getFilters(options) {
	var filters = options.filter;
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
	var output = "";
	for (var i=0; i<filters.length; i++) {
		output += "!!!filter: " + filters[i] + "\n";
	}

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
	var args = Array.prototype.slice.call(arguments, 2);
	var namespaces = functionName.split(".");
	var func = namespaces.pop();
	for (var i = 0; i < namespaces.length; i++) {
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
  var ret = fun.toString();
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
		var sid = "";
		sid = tags.id;
		if (!sid) {
			sid = tags.parentNode.id;
		}
		var filename = savename;
		if (!filename) {
			filename = sid.replace(/-svg$/, "") + ".svg";
		}
		var text = tags.outerHTML;
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

	var i;
	if (!tags) {
		// var selector = 'script[type="text/x-humdrum"]';
		var selector = '.humdrum-text[id$="-humdrum"]';
		var items = document.querySelectorAll(selector);
		tags = [];
		for (i=0; i<items.length; i++) {
			var id = items[i].id.replace(/-humdrum$/, "");
			if (!id) {
				continue;
			}
			var ss = "#" + id + "-svg svg";
			var item = document.querySelector(ss);
			if (item) {
				tags.push(item);
			}
		}
	}
	if (tags.constructor !== Array) {
		tags = [tags];
	}

	(function (i) {
		(function j () {
			var tag = tags[i++];
			if (typeof tag  === "string" || tag instanceof String) {
				var s = tag
				if (!tag.match(/-svg$/)) {
					s += "-svg";
				}
				var thing = document.querySelector("#" + s + " svg");
				if (thing) {
					saveHumdrumSvg(thing);
				}
			} else if (tag instanceof Element) {
				(function(elem) {
					saveHumdrumSvg(elem);
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
	})(0);
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
		var stext = savetext.replace(/&lt;/g, "<").replace(/&gt;/g, ">");
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
		var sid = "";
		sid = tags.id;
		if (!sid) {
			sid = tags.parentNode.id;
		}
		var filename = savename;
		if (!filename) {
			filename = sid.replace(/-humdrum$/, "") + ".txt";
		}
		var text = tags.innerHTML.replace(/&lt;/g, "<").replace(/&gt;/g, ">");
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
		var myid = tags.replace(/-humdrum$/, "");
		var myelement = document.querySelector("#" + myid + "-humdrum");
		if (!myelement) {
			myelement = document.querySelector("#" + myid);
		}
		saveHumdrumText(myelement);
		return;
	}

	if (!tags) {
		// If tags is empty, then create a list of all elements that
		// should contain Humdrum content.
		var selector = '.humdrum-text[id$="-humdrum"]';
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

	var i;
	var outputtext = "";
	var humtext = "";
	for (i=0; i<tags.length; i++) {
		if (!tags[i]) {
			continue;
		}
		if (typeof tags[i]  === "string" || tags[i] instanceof String) {
			saveHumdrumText(tags[i]);
			// convert a tag to an element:
			var s = tags[i];
			if (!tags[i].match(/-humdrum$/)) {
				s += "-humdrum";
			}
			var thing = document.querySelector("#" + s);
			if (thing) {
				tags[i] = thing;
			} else {
				continue;
			}
		}
		// Collect the Humdrum file text of the element.
		if (tags[i] instanceof Element) {
			var segmentname = tags[i].id.replace(/-humdrum$/, "");
			if (!segmentname.match(/\.[.]*$/)) {
				segmentname += ".krn";
			}
			humtext = tags[i].innerHTML
					.replace(/^\n+/m, "")
					.replace(/\n+$/m, "")
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
		output[key] = (typeof v === "object") ? cloneObject(v) : v;
	}
	return output;
}



