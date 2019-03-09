//
// Programmer:    Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date: Sun Dec 23 01:47:54 EST 2018
// Last Modified: Sun Dec 23 01:47:57 EST 2018
// Filename:      _includes/code/HumdrumNotationPluginDatabase.js
// Syntax:        JavaScript 1.8.5/ECMAScript 5.1
// vim:           ts=3
//
// This file contains the HumdrumNotationPluginDatabase class for
// the Humdrum notation plugin.  This class is the main database for
// keeping track of options and locations of examples on a webpage.
//


//////////////////////////////
//
// HumdrumNotationPluginDatabase::prepareOptions --
//

HumdrumNotationPluginDatabase.prototype.prepareOptions = function () {
	var list = this.verovioOptions.OPTION;
	for (var i=0; i<list.length; i++) {
		if (list[i].CLI_ONLY) {
			continue;
		}
		this.verovioOptions[list[i].NAME] = list[i];
	}
};



HumdrumNotationPluginDatabase.prototype.verovioOptions = {% include verovio-options.json %};



//////////////////////////////
//
// HumdrumNotationPluginDatabase::initializer --
//

function HumdrumNotationPluginDatabase() {
	this.entries = {};  // Hash of notation ids and their related information.
	this.mutex = 0;
	this.waiting = [];  // Notation entries to process after verovio has loaded.
	HumdrumNotationPluginDatabase.prototype.prepareOptions();
	return this;
}


var HNP = new HumdrumNotationPluginDatabase();



///////////////////////////////////////////////////////////////////////////


function getContainer(baseid) {
	var entry = HNP.entries[baseid];
	if (!entry) {
		return null;
	}
	return entry.container;
}

///////////////////////////////////////////////////////////////////////////

//////////////////////////////
//
// HumdrumNotationPluginDatabase::displayWaiting --
//

HumdrumNotationPluginDatabase.prototype.displayWaiting = function () {
	// maybe check to see if document is ready (otherwise maybe infinite loop).
	for (var i=0; i<this.waiting.length; i++) {
		(function(j, obj) {
			setTimeout(function() {
				console.log("PREPARING", obj);
				this.displayHumdrumNow(obj);
				console.log("\tDONE");
			}, j*250);
		}(i, this.waiting[i]));
	}
	this.waiting = [];
}



//////////////////////////////
//
// HumdrumNotationPluginDatabase::setErrorScore --
//

HumdrumNotationPluginDatabase.prototype.setErrorScore = function (baseid) {
	var element = document.querySelector("#" + baseid);
	if (!element) {
		console.log("Warning: Cannot find error score for ID", baseid);
		return;
	}
	var text = element.textContent.trim();
	this.errorScore = text;
	return this;
}



//////////////////////////////
//
// HumdrumNotationPluginDatabase::createEntry --
//

HumdrumNotationPluginDatabase.prototype.createEntry = function (baseid, options) {
	if (typeof baseid !== "string" && !(baseid instanceof String)) {
		console.log("Error: baseid must be a string, but it is:", baseid);
		return null;
	}
	if (!(options instanceof Object)) {
		console.log("Error: options must be an object:", options);
		return null;
	}
	if (!baseid) {
		console.log("Error: baseid cannot be empty");
		return null;
	}
	var entry = this.entries[baseid];
	if (entry) {
		console.log("Error: entry already exists:", entry);
		return entry;
	}
	var entry = new HumdrumNotationPluginEntry(baseid, options);
	this.entries[baseid] = entry;
	entry.convertFunctionNamesToRealFunctions();
	entry.createContainer();
	entry.initializeContainer();
	return entry;
};



//////////////////////////////
//
// HumdrumNotationPluginDatabase::displayHumdrumNow -- Don't wait, presumably since
//     the page has finished loading.
//

HumdrumNotationPluginDatabase.prototype.displayHumdrumNow = function (opts) {
	if (opts instanceof Element) {
		// Currently not allowed, but maybe allow the container element, and then
		// extract the options from the container (from the *-options element).
		return;
	}

	var entry = null;

	if (typeof opts === "string" || opts instanceof String) {
		// This is a base ID for a Humdrum example to display.
		entry = this.entries[opts];
		if (!entry) {
			console.log("Error: trying to create notation for an uninitialized ID");
			return;
		}
	} else if (opts instanceof Object) {
		var id = opts.target;
		if (!id) {
			id = opts.source;
		}
		if (!id) {
			console.log("Error: source ID for Humdrum element required in options");
			return;
		}
		entry = this.entries[id];
		if (!entry) {
			entry = this.createEntry(id, opts);
		}
		// copy input options into existing entry's option (in case of updates in
		// options).  This is only adding options, but there should probably be a way
		// of removing unwanted options as well...
		for (property in opts) {
			entry.options[property] = opts[property];
		}
	}

	if (!entry) {
		console.log("Error: cannot create notation for", opts);
	}

	var sourceid = entry.options["source"];
	if (!sourceid) {
		console.log("Error: Missing Humdrum data source ID:", sourceid, "in options", opts);
		return;
	}
	var source = document.querySelector("#" + sourceid);
	if (!source) {
		console.log("Error: Humdrum source location " +
				sourceid + " cannot be found.");
		return;
	}

	if (entry.options.hasOwnProperty("uri")) {
console.log("GOT HERE AAA");
		this.downloadUriAndDisplay(entry.baseId);
	} else if (entry.options.hasOwnProperty("url")) {
console.log("GOT HERE BBB");
		this.downloadUrlAndDisplay(entry.baseId);
	} else {
		entry.copyContentToContainer();
		HNP.displayHumdrumSvg(entry.baseId);
	}
};



//////////////////////////////
//
// HumdrumNotationPluginDatabase::downloadUriAndDisplay --
//

HumdrumNotationPluginDatabase.prototype.downloadUriAndDisplay = function (baseid) {
	var entry = this.entries[baseid];
	if (!entry) {
		console.log("Error: Cannot find entry for URI download:", baseid);
		return;
	}

	if (entry.options.uri) {
		entry.options.processedUri = entry.options.uri;
		delete entry.options.uri;
	} else {
		console.log("Warning: No URL to download data from, presuming already downloaded", entry);
		displayHumdrumNow(entry.baseId);
		return;
	}

	var uri = entry.options.processedUri;
console.log("URI IS CURRENTLY", uri);
	var url = "";
	if (uri.match(/^(g|gh|github):\/\//i)) {
		url = this.makeUrlGithub(uri);
console.log("URI IS NOW", uri);
	} else if (uri.match(/^(h|hum|humdrum):\/\//i)) {
		url = this.makeUrlHumdrum(uri);
	} else if (uri.match(/^(j|jrp):\/\//i)) {
		url = this.makeUrlJrp(uri);
	}
	if (url) {
		entry.options.url = url;
		this.downloadUrlAndDisplay(baseid);
	}
}



//////////////////////////////
//
// HumdrumNotationPluginDatabase::downloadUrlAndDisplay --
//

HumdrumNotationPluginDatabase.prototype.downloadUrlAndDisplay = function (baseid) {
	var entry = this.entries[baseid];
	if (!entry) {
		console.log("Error: Cannot find entry for URL download:", baseid);
		return;
	}

	if (entry.options.url) {
		entry.options.processedUrl = entry.options.url;
		delete entry.options.url;
	} else {
		console.log("Warning: No URL to download data from, presuming already downloaded", entry);
		displayHumdrumNow(entry.baseId);
		return;
	}

	var source = document.querySelector("#" + baseid);
	if (!source) {
		console.log("Error: no element for ID", baseid);
		return;
	}

	// download from url, otherwise try urlFallback:
	downloadHumdrumUrlData(source, entry.options);

};



//////////////////////////////
//
// HumdrumNotationPluginDatabase::getEmbeddedOptions --
//

HumdrumNotationPluginDatabase.prototype.getEmbeddedOptions = function (humdrumfile) {
	var lines = humdrumfile.match(/[^\r\n]+/g);
	var output = {};
	for (var i=0; i<lines.length; i++) {
		if (!lines[i].match(/^!!!/)) {
			continue;
		}
		var matches = lines[i].match(/^!!!hnp-option\s*:\s*([^\s:]+)\s*:\s*(.*)\s*$/);
		if (matches) {
			var option = matches[1];
			var value = matches[2];
			output[option] = value;
		}
	}
	return output;
};



//////////////////////////////
//
// HumdrumNotationPluginDatabase::displayHumdrumSvg -- Add default settings to
//     options and then render and show the Humdrum data as an SVG image on the page.
//

HumdrumNotationPluginDatabase.prototype.displayHumdrumSvg = function (baseid) {
	var entry = this.entries[baseid];
	if (!entry) {
		console.log("Error: Notation entry is not defined for ID:", baseid);
		return;
	}

	if (!entry.toolkit) {
		// search for the verovio toolkit if not explicitly specified
		if (typeof vrvToolkit !== "undefined") {
			entry.toolkit = vrvToolkit;
		}
	}
	var toolkit = entry.toolkit;
	var sourcetext = entry.humdrum.textContent.trim();
	if (sourcetext.match(/^\s*$/)) {
		if (entry.options.errorScore) {
			var errorscore = document.querySelector("#" + entry.options.errorScore);
			if (errorscore) {
				sourcetext = errorscore.textContent.trim();
			} else {
				console.log("Error: No humdrum content in", entry.humdrum);
				console.log("For ID", baseid, "ENTRY:", entry);
				return;
			}
		} else if (this.errorScore) {
			sourcetext = this.errorScore;
			console.log("Error: No humdrum content in", entry.humdrum);
			console.log("For ID", baseid, "ENTRY:", entry);
		}

	}
 
	// Cannot display an empty score, since this will cause verovio to display the 
	// previously prepared score.
	if (sourcetext.match(/^\s*$/)) {
		console.log("Error: No humdrum content in", entry.humdrum);
		console.log("For ID", baseid, "ENTRY:", entry);
		return;
	}

	var preventRendering = false;
	if (entry.options.suppressSvg) {
		preventRendering = true;
		// Maybe set entry.options.suppressSvg to false here.

		entry.container.style.display = "none";
		entry.options._processedSuppressSvg = entry.options.suppressSvg;
		delete entry.options.suppressSvg;
		entry.container.style.display = "none";
		return;
	} else {
		entry.container.style.display = "block";
	}

	var pluginOptions = this.getEmbeddedOptions(sourcetext);
	for (var property in entry.options) {
		if (!entry.options.hasOwnProperty(property)) {
			// not a real property of object
			continue;
		}
		pluginOptions[property] = entry.options[property];
	}

	var vrvOptions = this.extractVerovioOptions(baseid, pluginOptions);
	vrvOptions = this.insertDefaultOptions(baseid, vrvOptions);

	sourcetext += "\n" + getFilters(pluginOptions);

	if (pluginOptions.appendText) {
		var text = pluginOptions.appendText;
		if (Array.isArray(text)) {
			for (var i=0; i<text.length; i++) {
				if (typeof text[i] === "string" || text[i] instanceof String) {
					sourcetext += "\n" + text.trim()
				}
			}
		} else if (typeof text === "string" || text instanceof String) {
			sourcetext += "\n" + text.trim()
		}
	}

	var svg = toolkit.renderData(sourcetext, vrvOptions);

	entry.svg.innerHTML = svg;
	if (pluginOptions.postFunction) {
		// Need to run a function after the image has been created or redrawn
		try {
			pluginOptions.postFunction(baseid);
		} catch (error) {
			executeFunctionByName(pluginOptions.postFunction, window, [baseid]);
		}
		pluginOptions._processedPostFunction = pluginOptions.postFunction;
		delete pluginOptions.postFunction;
	}
	pluginOptions._currentPageWidth = vrvOptions.pageWidth;

	// Update stored options
	var autoresize = pluginOptions.autoResize === "true" ||
	                 pluginOptions.autoResize === true ||
	                 pluginOptions.autoResize === 1;

	if (autoresize && !pluginOptions._autoResizeInitialize) {
		// need to inialize a resize callback for this image.
		pluginOptions._autoResizeInitialize = true;
		var aridelement = entry.container.parentNode;

		if (aridelement) {
			try {
				var ro = new ResizeObserver(function(event) {
					(function(bid) {
						displayHumdrum(bid);
					})(baseid);
				});
				ro.observe(aridelement);
			} catch (error) {
				// ResizeObserver is not present for this browser, use setInterval instead.
				var refreshRate = 250; // milliseconds
				setInterval(function() {
					(function(bid) {
						checkParentResize(bid);
					})(baseid)
				}, refreshRate);
			}
		} else {
			window.addEventListener("resize", function(event) {
				(function(bid) {
					displayHumdrum(bid);
				})(baseid);
			});
		}
	}
};



//////////////////////////////
//
// HumdrumNotationPluginEntry::insertDefaultOptions --
//

HumdrumNotationPluginDatabase.prototype.insertDefaultOptions = function (baseid, vrvOptions) {
	var entry = this.entries[baseid];
	if (!entry) {
		console.log("Error: need an entry for baseid:", baseid);
		return vrvOptions;
	}
	if (entry.options.header === "true" ||
       entry.options.header === true ||
       entry.options.header === 1) {
		vrvOptions.noHeader = 0;
	}

	if (!vrvOptions.hasOwnProperty("scale")) {
		// scale must be set before automatic pageWidth calculations
		vrvOptions.scale = 40;
	}

	if (!vrvOptions.pageWidth) {
		// set the width of the notation automatically to the width of the parent element
		var style = window.getComputedStyle(entry.container, null);
		var width = parseInt(style.getPropertyValue("width"));
		vrvOptions.pageWidth = width;
		if (vrvOptions.scale) {
			vrvOptions.pageWidth /= (parseInt(vrvOptions.scale)/100.0);
		}
	}

	if (!vrvOptions.hasOwnProperty("pageHeight")) {
		vrvOptions.pageHeight = 60000;
	}
	if (entry.options.incipit === "true" ||
       entry.options.incipit === 1 ||
		 entry.options.incipit === true) {
		vrvOptions.pageHeight = 100;
	}

	if (!vrvOptions.hasOwnProperty("staffLineWidth")) {
		vrvOptions.staffLineWidth = 0.12;
	}
	if (!vrvOptions.hasOwnProperty("barLineWidth")) {
		vrvOptions.barLineWidth = 0.12;
	}
	if (!vrvOptions.hasOwnProperty("inputFormat")) {
		vrvOptions.inputFormat = "auto";
	}
	if (!vrvOptions.hasOwnProperty("format")) {
		vrvOptions.inputFormat = "auto";
	}

	// Need to superimpose default options since verovio will keep old
	// options persistent from previously generated examples.
	if (this.verovioOptions) {
		for (var i=0; i<this.verovioOptions.OPTION.length; i++) {
			var option = this.verovioOptions.OPTION[i];
			var name = option.NAME;
			if (option.CLI_ONLY === "true" ||
			    option.CLI_ONLY === true ||
				 option.CLI_ONLY === 1) {
				continue;
			}
			if (vrvOptions.hasOwnProperty(name)) {
				// Option is already set, so do not give a default.
				// Probably check if it is in valid range here, though.
				continue;
			}
			// Ignore previously dealt-with options:
			if (name === "scale")          { continue; }
			if (name === "pageWidth")      { continue; }
			if (name === "pageHeight")     { continue; }
			if (name === "staffLineWidth") { continue; }
			if (name === "barLineWidth")   { continue; }
			if (name === "inputFormat")    { continue; }

			// Fill in default values for parameters that are not set:
			if ((option.ARG === "integer") && (typeof option.DEF !== 'undefined')) {
				vrvOptions[name] = parseInt(option.DEF);
			} else if ((option.ARG === "float") && (typeof option.DEF !== 'undefined')) {
				vrvOptions[name] = parseFloat(option.DEF);
			}
			// Maybe add string and boolean options here.

		}
	}

	// Deal with default options for boolean and string cases:
	if (!vrvOptions.hasOwnProperty("adjustPageHeight")) {
		vrvOptions.adjustPageHeight = 1;
	}
	if (!vrvOptions.hasOwnProperty("breaks")) {
		vrvOptions.breaks = "auto";
	}
	if (!vrvOptions.hasOwnProperty("font")) {
		vrvOptions.font = "Leipzig";
	}
	if (!vrvOptions.hasOwnProperty("humType")) {
		vrvOptions.humType = 1;
	}
	if (!vrvOptions.hasOwnProperty("noFooter")) {
		vrvOptions.noFooter = 1;
	}
	if (!vrvOptions.hasOwnProperty("noHeader")) {
		vrvOptions.noHeader = 1;
	}

	return vrvOptions;
};



//////////////////////////////
//
// HumdrumNotationPluginDatabase::extractVerovioOptions -- Extract all of the verovio options
//   from the Humdrum plugin options object.
//

HumdrumNotationPluginDatabase.prototype.extractVerovioOptions = function (baseid, opts) {
	var entry = this.entries[baseid];
	if (!entry) {
		console.log("Error: Need entry for creating verovio options:", baseid);
		return;
	}

	var output = {};

	if (!opts) {
		opts = entry.options;
	}

	if (opts.scale) {
		var scale = parseFloat(opts.scale);
		if (scale < 0.0) {
			scale = -scale;
		}
		if (scale <= 1.0) {
			scale = 100.0 * scale;
		}
		output.scale = scale;
	}

	for (var property in opts) {
		if (property === "scale") {
			// scale option handled above
			continue;
		}
		if (typeof this.verovioOptions[property] === 'undefined') {
			// not a verovio option
			continue;
		}
		// Do error-checking of prameters here.
		output[property] = opts[property];
	}

	return output;
}



//////////////////////////////
//
// HumdrumNotationPluginDatabase::makeUrlGithub --
//

HumdrumNotationPluginDatabase.prototype.makeUrlGithub = function (uri, opts) {
	var url = "";
	var matches = uri.match(/^(g|gh|github):\/\/([^\/]+)\/([^\/]+)\/(.*)\s*$/);
	if (matches) {
		var account = matches[2];
		var repo    = matches[3];
		var file    = matches[4];
		var variant;
		if (opts && opts.commitHash && (typeof opts.commitHash === "string" || text instanceof String)) {
			variant = opts.commitHash;
		} else {
			variant = "master";
		}
		url = "https://raw.githubusercontent.com/" + account + "/" + repo + "/" + variant + "/" + file;
	}
	return url;
};



///////////////////////////////
//
// HumdrumNotationPluginDatabase::MakeUrlHumdrum -- Convert a (kernScores) Humdrum URI into a URL.
//

HumdrumNotationPluginDatabase.prototype.MakeUrlHumdrum = function (uri, opts) {
	var url = "";
	var matches = uri.match(/^(h|hum|humdrum):\/\/(.*)\s*$/);
	if (matches) {
		url = "http://kern.humdrum.org/data?s=" + matches[2];
	}
	return url;
}



///////////////////////////////
//
// HumdrumNotationPluginDatabase::MakeUrlJrp -- Convert a (kernScores) JRP URI into a URL.
//

HumdrumNotationPluginDatabase.prototype.MakeUrlJrp = function (uri, opts) {
	var url = "";
	var composerid;
	var jrpid;
	var filename;
	var composerid;
	var matches = uri.match(/^(j|jrp):\/\/([a-z]{3})(\d{4}[a-z]*)-?(.*)$\s*$/i);
	if (matches) {
		composerid = matches[2].toLowerCase();
		composerid = composerid.charAt(0).toUpperCase() + composerid.substr(1);
		jrpid = composerid + matches[3].toLowerCase();
		filename = matches[4];
		if (filename) {
			jrpid += "-" + filename;
		}
		url = "http://jrp.ccarh.org/cgi-bin/jrp?a=humdrum&f=" + jrpid;
	}
	return url;
}



