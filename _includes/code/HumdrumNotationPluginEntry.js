//
// Programmer:    Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date: Sun Dec 23 01:47:54 EST 2018
// Last Modified: Sun Dec 23 01:47:57 EST 2018
// Filename:      _includes/code/HumdrumNotationPluginEntry.js
// Syntax:        JavaScript 1.8.5/ECMAScript 5.1
// vim:           ts=3
//
// This file contains the HumdrumNotationPluginEntry class for 
// the Humdrum notation plugin.  This class is the used to store 
// options and elements for each notation example on a webpage.
//


//////////////////////////////
//
// HumdrumNotationPluginEntry::initializer --
//

function HumdrumNotationPluginEntry(baseid, opts) {
	this.baseId = baseid;
	if (opts instanceof Object) {
		this.options = cloneObject(opts);
	} else {
		this.options   = {};   // storage for options (both HNP and Verovio);
	}

	// Primary HTML elements related to entry:
	this.container = null; // container element for notation
	this.humdrum   = null; // storage for Humdrum data
	this.svg       = null; // storage for SVG image
	this.humdrumOutput = null; // storage for Humdrum after filtering to create SVG image
	this.pages     = [];   // storage buffer for SVG of each page (multi-page examples)

	return this;
}



//////////////////////////////
//
// HumdrumNotationPluginEntry::convertFunctionNamesToRealFunctions --
//

HumdrumNotationPluginEntry.prototype.convertFunctionNamesToRealFunctions = function () {
	if (!this.options) {
		console.log("Error: options not defined in entry:", this);
		return;
	}
	if (this.options.postFunction) {
		if (typeof this.options.postFunction === "string") {
			if ({}.toString.call(this.options.postFunction) === '[object Function]') {
				this.options.postFunction = functionName(this.options.postFunction);
			}
		}
	}
}



//////////////////////////////
//
// HumdruNotationPluginEntry::createContainer -- Create a target location
//     for the Humdrum notation content.  First check if there is an element
//     with the given ID, and return that element if it exists.  If it does not
//     exist, then create a div element with the given containerid used as the
//     ID for the div.

HumdrumNotationPluginEntry.prototype.createContainer = function () {
	if (this.container) {
		console.log("Error: container already initialize:", this.container);
	}
	var container = document.querySelector("#" + this.baseId + "-container");
	if (container) {
		// Recycle this container for use with the plugin.  Typically the
		// container is predefined to reserve vertical space for the notation
		// that will be placed inside of it.
		this.container = container;
	} else {
		// the container needs to be created, and it will be placed
		// just above the source script.

		var target = document.querySelector("#" + this.baseId);
		if (!target) {
			console.log("Error: need a target to place container before:", this.baseId);
			return null;
		}
		this.container = document.createElement('div');
		this.container.id = this.baseId + "-container";
		target.parentNode.insertBefore(this.container, target);
	}
	this.container.className = "humdrum-notation-plugin";
	return this.container;
};



//////////////////////////////
//
// HumdrumNotationPluginEntry::copyContentToContainer --
//

HumdrumNotationPluginEntry.prototype.copyContentToContainer = function () {
	if (!this.options) {
		console.log("Error: options required for entry:", this);
		return;
	}
	if (!this.options.source) {
		console.log("Error: Source property required for options:", this.options);
		return;
	}
	{% if page.worker %}
	if (!this.humdrum) {
		console.log("Error: Humdrum container target not initialized:", this);
		return;
	}
	{% endif %}

	var source = document.querySelector("#" + this.options.source);

	if (!source) {
		console.log("Error: No Humdrum source for", this.baseId);
		{% if page.worker %}
		console.log("ID that is empty:", this.options.source);
		{% endif %}
		return;
	}
	if (!this.container) {
		console.log("Error: No container for storing data from ID", this.baseId);
		return;
	}
	var content = source.textContent.trim();

	var initial = content.substr(0, 600);
	// Probably use the real plugin options here later:
	var poptions = {};
	var options;
/*
	if (initial.match(/^\s*</)) {
		// some sort of XML junk, so convert to Humdrum
		var ctype = "unknown";
		if (initial.match(/<mei /)) {
			ctype = "mei";
		} else if (initial.match(/<mei>/)) {
			ctype = "mei";
		} else if (initial.match(/<music>/)) {
			ctype = "mei";
		} else if (initial.match(/<music /)) {
			ctype = "mei";
		} else if (initial.match(/<pages>/)) {
			ctype = "mei";
		} else if (initial.match(/<pages /)) {
			ctype = "mei";
		} else if (initial.match(/<score-partwise>/)) {
			ctype = "musicxml";
		} else if (initial.match(/<score-timewise>/)) {
			ctype = "musicxml";
		} else if (initial.match(/<opus>/)) {
			ctype = "musicxml";
		} else if (initial.match(/<score-partwise /)) {
			ctype = "musicxml";
		} else if (initial.match(/<score-timewise /)) {
			ctype = "musicxml";
		} else if (initial.match(/<opus /)) {
			ctype = "musicxml";
		}
		if (ctype === "musicxml") {
			// convert MusicXML data into Humdrum data
			options = {
				inputFrom: "musicxml-hum"
			};
			{% if page.worker %}
			convertMusicXmlToHumdrum(this.humdrum, content, options, poptions);
			{% else %}
			content = convertMusicXmlToHumdrum(content, options, poptions);
			{% endif %}
		} else if (ctype === "mei") {
			// convert MEI data into Humdrum data
			options = {
				inputFrom: "mei-hum"
			};
			{% if page.worker %}
			convertMeiToHumdrum(this.humdrum, content, options, poptions);
			{% else %}
			content = convertMeiToHumdrum(content, options, poptions);
			{% endif %}
		} else {
			console.log("Warning: given some strange XML data:", content);
		}
*/
	{% if page.worker %}
//	} else {
		this.humdrum.textContent = content;
//	}
	{% else %}
//	}
	if (!this.humdrum) {
		console.log("Error: Humdrum element not initialized:", this);
	}
	this.humdrum.textContent = content;
	this.humdrum.style.display = "block";
	{% endif %}
}



//////////////////////////////
//
// HumdrumNotationPluginEntry::initializeContainer --  Generate contents for
//      the main humdrum-plugin div that is used to hold the verovio options,
//      the input humdrum text and the output verovio SVG image.
//
// The main container is a div element with an ID that matches the ID of the
// source Humdrum data script followed by an optional variant tag and then
// the string "-container".
//
// Inside the main target div there are two elements of interest:
//    (1) a div element with an similar ID that ends in "-options" rather
//        than "-container".
//    (2) a table element that contains the potentially visible Humdrum text
//        that create the SVG image in one cell, and another cell that contains
//        the SVG rendering of the Humdrum data.
//
//        The Humdrum data is stored within a pre element (may be changed later)
//        that has an ID in the form of the container div, but with "-humdrum" as
//        the extension for the ID.
//
//        The SVG image is stored in a div that has an ID that is similar to the
//        containing element, but has "-svg" as an extension rather than "-container".
//
// How the humdrum and svg containers are stored in the table will be dependend on how
// the layout of the two elements are set, with the Humdrum data either above, below,
// to the left or two the right of the SVG image.
//
// So a typical organization of the resulting code from this function might be:
//
// <div class="humdrum-plugin" id="bach-container">
//    <div id="bach-options">[Options for rendering with verovio]</div>
//    <table class="humdrum-verovio">
//       <tbody>
//       <tr>
//          <td>
//          <div>
//             <script type="text/x-humdrum" class="humdrum-notation-plugin" id="bach-humdrum">[Humdrum contents]</text>
//          </div>
//          </td>
//          <td>
//             <div class="verovio-svg" id="bach-svg">[SVG image of music notation]</div>
//          </td>
//       </tr>
//       </tbody>
//    </table>
// </div>
//
// Also notice the class names which can be used for styling the notation or humdrum text:
//    humdrum-plugin  == The main div container for the musical example.
//    humdrum-verovio == The class name of the table that contains the humdrum and rendered svg.
//    humdrum-text    == The potentially visible Humdrum text for the example.
//    verovio-svg     == The div container that holes the verovio-generated SVG image.
//

HumdrumNotationPluginEntry.prototype.initializeContainer = function () {
	if (!this.container) {
		console.log("Error: Container must first be created:", this);
		return;
	}

	var output = "";
	var hvisible = false;
	if ((this.options["humdrumVisible"] === "true") || 
	    (this.options["humdrumVisible"] === true) || 
	    (this.options["humdrumVisible"] === 1)) {
		hvisible = true;
	}

	output += "<div style='display:none' class='PREHTML'></div>\n";
	output += "<table class='humdrum-verovio'";
	output += " style='border:0; border-collapse:collapse;'";
	output += ">\n";
	output += "   <tbody>\n";
	output += "   <tr style='border:0' valign='top'>\n";
	if (hvisible) {
		output += "<td";
		if (this.options["humdrumMinWidth"]) {
			output += " style='border:0; min-width: " + this.options["humdrumMinWidth"] + ";'";
		} else {
			output += " style='border:0;'";
		}
		output += ">\n";
	} else {
		output += "<td style='border:0; display:none;'>\n";
	}

	output += "<div>\n";
	output += "<script type='text/x-humdrum' style='display:none;' class='humdrum-text'";
	output += " contenteditable='true' id='";
	output += this.baseId + "-humdrum'></script>\n";
	output += "</div>\n";
	output += "</td>\n";

	output += "<td style='border:0;'>\n";
	output += "<div class='verovio-svg'";
	output += " id='" + this.baseId + "-svg'></div>\n";
	output += "</td>\n";
	output += "</tr>\n";
	output += "</tbody>\n";
	output += "</table>\n";
	output += "<div style='display:none' class='POSTHTML'></div>\n";

	var oldcontent = this.container.innerHTML;
	this.container.innerHTML = output;

	this.humdrum = this.container.querySelector("#" + this.baseId + "-humdrum");
	this.svg = this.container.querySelector("#" + this.baseId + "-svg");
	// Move any previous content to the svg container.  This may contain
	// a pre-image that needs to be preserved a little longer so that the
	// final SVG image can be calculated.
	this.svg.innerHTML = oldcontent;
}


