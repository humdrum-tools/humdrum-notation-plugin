//
// Programmer:    Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date: Sun Dec  2 08:11:05 EST 2018
// Last Modified: Sun Dec  2 10:42:15 EST 2018
// Filename:      humdrum-plugin.js
// Syntax:        JavaScript 1.8.5/ECMAScript 5.1
// vim:           ts=3
//
//	This script sets up an editiable humdrum text region
//	on a webpage plus a dynamcially calculated SVG image 
//	generated from the humdrum text using verovio. 
//
//	Input parameters for plugin styling:
//		tabsize:            default none (browser default)
//		humdrumMinHeight: the minimum height of the humdrum text box
//		humdrumMaxWidth:  the maximum width of the humdrum text box
//		humdrumMinWidth:  the maximum width of the humdrum text box
//		humdrumVisible:    "false" will hide the humdrum text.
//		callback:           callback when notation changes
//
//	Parameters for verovio:
//	http://www.verovio.org/command-line.xhtml
//
//		adjustPageHeight default 1
//		border           default 50
//		evenNoteSpacing  default 0
//		font             default "Leipzig"
//		inputFormat      default "auto"
//		# page           default 1
//		# header         default 0
//		# footer         default 0
//		pageHeight       default 60000
//		pageWidth        default 1350
//		scale            default 40
//		spacingLinear    default 0.25
//		spacingNonLinear default 0.6
//		spacingStaff     default 3
//		spacingSystem    default 6
//


//////////////////////////////
//
// displayHumdrum -- Main externally usable function which sets up
//   a Humdrum notation display on a webpage.
//

function displayHumdrum(opts) {
	document.addEventListener("DOMContentLoaded", function() {
		if (opts.source && !opts.sourceId) {
			opts.sourceId = opts.source;
		}
		if (opts.sourceID && !opts.sourceId) {
			opts.sourceId = opts.sourceID;
		}
		if (opts["source-id"] && !opts.sourceId) {
			opts.sourceId = opts["source-id"];
		}

		var sourceid = opts["sourceId"];
		if (!sourceid) {
			console.log("Error: Missing Humdrum data source ID");
			return;
		}
		var source = document.querySelector("#" + sourceid);
		if (!source) {
			console.log("Error: Humdrum source location " + sourceid + " cannot be found.");
			return;
		}

		var targetid = opts["targetid"] || opts["target"];
		if (!targetid) {
			targetid = sourceid + "-container";
		}
		var target = document.querySelector("#" + targetid);
		if (!target) {
			target = createTarget(source, targetid);
		}

		initializeTarget(target, opts);
		copyContentToContainer(target, sourceid);
		var toolkit = opts.renderer;
		displaySvg(toolkit, target);
	});
}



//////////////////////////////
//
// displaySvg --
//

function displaySvg(toolkit, container) {
	if (!toolkit) {
		if (typeof vrvToolkit !== "undefined") {
			toolkit = vrvToolkit;
		}
	}
	var containerid = container.id;
	var baseid = containerid.replace(/-container$/, "");
	var source = container.querySelector("#" + baseid + "-humdrum");
	if (!source) {
		console.log("Warning: No content to display");
		exit(1);
	}
	var sourcetext = source.textContent.replace(/^\s+/sm, "");
	var options = container.querySelector("#" + baseid + "-options");
	var vrvOptions = {};
	if (options) {
		vrvOptions = JSON.parse(options.textContent);
	} 

	var target = container.querySelector("#" + baseid + "-svg");
	var svg = toolkit.renderData(sourcetext, vrvOptions);
	target.innerHTML = svg;
}



//////////////////////////////
//
// copyContentToContainer --
//

function copyContentToContainer(target, sourceid) {
	var source = document.querySelector("#" + sourceid);
	if (!source) {
		console.log("Error: No Humdrum source for " + sourceid);
		return;
	}
	var htarget = target.querySelector("#" + sourceid + "-humdrum");
	var content = source.textContent.replace(/^\s+/sm, "");
	htarget.textContent = content;
	htarget.style.display = "block";
}



//////////////////////////////
//
// initializeTarget --  Fill in a table with the given option.
//

function initializeTarget(target, opts) {
	var output = "";
	hvisible = opts["humdrumVisible"] != "false";

	var vrvOptions = extractVerovioOptions(opts);

	output += "<div style='display:none;' id='" + opts.sourceId + "-options'>";
	output += JSON.stringify(vrvOptions);
	output += "</div>\n";

	output += "<table class='humdrum-verovio'";
	output += " style='border:0; border-collapse:collapse;'";
	output += ">\n";
	output += "   <tbody>\n";
	output += "   <tr style='border:0' valign='top'>\n";
	if (hvisible) {
		output += "<td";
		if (opts["humdrumMinWidth"]) {
			output += " style='border:0; min-width: " + opts["humdrumMinWidth"] + ";'";
		} else {
			output += " style='border:0;'";
		}
		output += ">\n";
	} else {
		output += "<td style='border:0; display:none;'>\n";
	}

	output += "<div>\n";
	output += "<pre style='display:none;' class='humdrum'";
	output += " contenteditable='true' id='";
	output += opts.sourceId + "-humdrum'>xxxx</pre>\n";
	output += "</div>\n";
	output += "</td>\n";
	
	output += "<td style='border:0;'>\n";
	output += "<div class='verovio-svg'";
	output += " style='margin-top:-20px;'";
	output += " id='" + opts.sourceId + "-svg'></div>\n";
	output += "</td>\n";
	output += "</tr>\n";
	output += "</tbody>\n";
	output += "</table>\n";

	target.innerHTML = output;
}



//////////////////////////////
//
// extractVerovioOptions --
//

function extractVerovioOptions(opts) {
	var output = {};

	output.adjustPageHeight = 1;
	output.breaks = "auto";
	output.font = "Leipzig";
	output.humType = 1;
	output.noFooter = 1;
	output.noHeader = 1;
	output.scale = 40;
	output.spacingLinear = 0.25;
	output.spacingNonLinear = 0.6;
	output.staffLineWidth = 0.12;
	output.barLineWidth = 0.12;
	output.inputFormat = "auto";

	return output;
}



//////////////////////////////
//
// createTarget -- Create a target location for the Humdrum notation
//    content.  First check if there is an element with the given ID,
//    and return that element if it exists.  If it does not exist, then
//    create a div element with the given targetid used as the ID for the
//    div.
//

function createTarget(source, targetid) {
	if (!source) {
		console.log("Error: need a source to place target before");
		return;
	}
	var target = document.querySelector("#" + targetid);
	if (target) {
		return target;
	}
	target = document.createElement('div');
	target.id = targetid;
	source.parentNode.insertBefore(target, source);
	return target;
}



