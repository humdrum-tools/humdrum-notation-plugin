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
	if (document.readyState === "complete" || document.readyState === "loaded" || document.readyState === "interactive") {
     	displayHumdrumNow(opts);
	} else {
		// Wait until the page has finished loading resources.
		document.addEventListener("DOMContentLoaded", function() {
			displayHumdrumNow(opts);
		});
	}
}


function displayHumdrumNow(opts) {
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

	if (!vrvOptions.pageWidth) {
		var style = window.getComputedStyle(container, null);
		var width = parseInt(style.getPropertyValue("width"));
		vrvOptions.pageWidth = width;
		if (vrvOptions.scale) {
			vrvOptions.pageWidth /= (parseInt(vrvOptions.scale)/100.0);
		}
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
// initializeTarget --  Generate contents for the main humdrum-plugin div that is used to
//      hold the verovio options, the input humdrum text and the output verovio SVG image.
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
//             <pre class="humdrum-tet" id="bach-humdrum">[Humdrum contents]</pre>
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

function initializeTarget(target, opts) {
	var output = "";
	hvisible = opts["humdrumVisible"] == "true";

	var vrvOptions = extractVerovioOptions(opts);

	output += "<div class='humdrum-plugin' style='display:none;' id='" + opts.sourceId + "-options'>";
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
	output += "<pre style='display:none;' class='humdrum-text'";
	output += " contenteditable='true' id='";
	output += opts.sourceId + "-humdrum'></pre>\n";
	output += "</div>\n";
	output += "</td>\n";
	
	output += "<td style='border:0;'>\n";
	output += "<div class='verovio-svg'";
	// output += " style='margin-top:-20px;'";
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

	// Default settings:
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
	target.className = "humdrum-plugin";
	source.parentNode.insertBefore(target, source);
	return target;
}



