//
// Programmer:    Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date: Sun Dec  2 08:11:05 EST 2018
// Last Modified: Thu Dec 20 21:47:57 EST 2018
// Filename:      humdrum-notation-plugin.js
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
//		format           default "auto"
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

var MUTEX = 0;

VEROVIO_OPTIONS =
{
   "OPTION": [
      {
         "NAME": "help",
         "ABBR": "?",
         "INFO": "Display help message",
         "ARG": "none",
         "CLI_ONLY": "true"
      },
      {
         "NAME": "allPages",
         "ABBR": "a",
         "INFO": "Output all pages",
         "ARG": "none",
         "CLI_ONLY": "true?"
      },
      {
         "NAME": "format",
         "ABBR": "f",
         "INFO": "Select input format",
         "ARG": "string",
         "DEF": "mei",
         "ALT": [
            "auto",
            "darms",
            "pae",
            "xml",
            "humdrum",
            "humdrum-xml"
         ],
         "CLI_ONLY": "true?"
      },
      {
         "NAME": "outfile",
         "ABBR": "o",
         "INFO": "Output file name (use \"-\" for standard output)",
         "ARG": "string",
         "CLI_ONLY": "true"
      },
      {
         "NAME": "page",
         "ABBR": "p",
         "INFO": "Select the page to engrave",
         "ARG": "integer",
         "DEF": "1",
         "MIN": "1",
         "CLI_ONLY": "true"
      },
      {
         "NAME": "resources",
         "ABBR": "r",
         "INFO": "Path to SVG resources",
         "ARG": "string",
         "DEF": "/usr/local/share/verovio",
         "CLI_ONLY": "true"
      },
      {
         "NAME": "scale",
         "ABBR": "s",
         "INFO": "Scale percent",
         "ARG": "integer",
         "DEF": "100",
         "MIN": "1"
      },
      {
         "NAME": "type",
         "ABBR": "t",
         "INFO": "Select output format",
         "ARG": "string",
         "DEF": "svg",
         "ALT": [
            "mei",
            "midi"
         ]
      },
      {
         "NAME": "version",
         "ABBR": "v",
         "INFO": "Display the version number",
         "ARG": "none",
         "CLI_ONLY": "true"
      },
      {
         "NAME": "xmlIdSeed",
         "ABBR": "x",
         "INFO": "See the random number generator for XML IDs",
         "ARG": "integer"
      },
      {
         "NAME": "adjustPageHeight",
         "CAT": "input and page layout options",
         "INFO": "Crop the page height to the height of the content",
         "ARG": "none"
      },
      {
         "NAME": "Breaks",
         "CAT": "input and page layout options",
         "INFO": "Define page and system breaks layout",
         "ARG": "string",
         "DEF": "auto",
         "ALT": "encoded"
      },
      {
         "NAME": "evenNoteSpacing",
         "CAT": "input and page layout options",
         "INFO": "Specify the linear spacing factor",
         "ARG": "none"
      },
      {
         "NAME": "humType",
         "CAT": "input and page layout options",
         "INFO": "Include type attributes when importing from Humdrum",
         "ARG": "none"
      },
      {
         "NAME": "landscape",
         "CAT": "input and page layout options",
         "INFO": "The landscape paper orientation flag",
         "ARG": "none"
      },
      {
         "NAME": "mensuralToMeasure",
         "CAT": "input and page layout options",
         "INFO": "Convert mensural sections to measure-based MEI",
         "ARG": "none"
      },
      {
         "NAME": "mmOutput",
         "CAT": "input and page layout options",
         "INFO": "Specify that the output in the SVG is given in mm (default is px)",
         "ARG": "none"
      },
      {
         "NAME": "noFooter",
         "CAT": "input and page layout options",
         "INFO": "Do not add any footer",
         "ARG": "none"
      },
      {
         "NAME": "noHeader",
         "CAT": "input and page layout options",
         "INFO": "Do not add any header",
         "ARG": "none"
      },
      {
         "NAME": "noJustification",
         "CAT": "input and page layout options",
         "INFO": "Do not justify the system",
         "ARG": "none"
      },
      {
         "NAME": "pageHeight",
         "CAT": "input and page layout options",
         "INFO": "The page height",
         "ARG": "integer",
         "DEF": "2970",
         "MIN": "100",
         "MAX": "60000"
      },
      {
         "NAME": "pageMarginBottom",
         "CAT": "input and page layout options",
         "INFO": "The page bottom margin",
         "ARG": "integer",
         "DEF": "50",
         "MIN": "0",
         "MAX": "500"
      },
      {
         "NAME": "pageMarginLeft",
         "CAT": "input and page layout options",
         "INFO": "The page left margin (default: 50;",
         "ARG": "integer",
         "MIN": "0",
         "MAX": "500"
      },
      {
         "NAME": "pageMarginRight",
         "CAT": "input and page layout options",
         "INFO": "The page right margin",
         "ARG": "integer",
         "DEF": "50",
         "MIN": "0",
         "MAX": "500"
      },
      {
         "NAME": "pageMarginTop",
         "CAT": "input and page layout options",
         "INFO": "The page top margin",
         "ARG": "integer",
         "DEF": "50",
         "MIN": "0",
         "MAX": "500"
      },
      {
         "NAME": "pageWidth",
         "CAT": "input and page layout options",
         "INFO": "The page width",
         "ARG": "integer",
         "DEF": "2100",
         "MIN": "100",
         "MAX": "60000"
      },
      {
         "NAME": "unit",
         "CAT": "input and page layout options",
         "INFO": "The MEI unit (1/2 of the distance between the staff lines)",
         "ARG": "integer",
         "DEF": "9",
         "MIN": "6",
         "MAX": "20"
      },
      {
         "NAME": "barLineWidth",
         "CAT": "general layout",
         "ARG": "float",
         "INFO": "The width of a barline in MEI units",
         "DEF": "0.30",
         "MIN": "0.10",
         "MAX": "0.80"
      },
      {
         "NAME": "beamMaxSlope",
         "ARG": "integer",
         "INFO": "The maximum beam slope",
         "CAT": "general layout",
         "DEF": "10",
         "MIN": "1",
         "MAX": "20"
      },
      {
         "NAME": "beamMinSlope",
         "ARG": "integer",
         "INFO": "The minimum beam slope",
         "CAT": "general layout",
         "DEF": "0",
         "MIN": "0",
         "MAX": "0"
      },
      {
         "NAME": "font",
         "ARG": "string",
         "INFO": "Set the music font",
         "CAT": "general layout",
         "DEF": "Leipzig"
      },
      {
         "NAME": "graceFactor",
         "CAT": "general layout",
         "ARG": "float",
         "INFO": "The grace size ratio numerator",
         "DEF": "0.75",
         "MIN": "0.50",
         "MAX": "1.00"
      },
      {
         "NAME": "graceRhythmAlign",
         "ARG": "none",
         "INFO": "Align grace notes rhythmically with all staves",
         "CAT": "general layout"
      },
      {
         "NAME": "graceRightAlign",
         "ARG": "none",
         "INFO": "Align the right position of a grace group with all staves",
         "CAT": "general layout"
      },
      {
         "NAME": "hairpinSize",
         "CAT": "general layout",
         "ARG": "float",
         "INFO": "The haripin size in MEI units",
         "DEF": "3.00",
         "MIN": "1.00",
         "MAX": "8.00"
      },
      {
         "NAME": "leftPosition",
         "CAT": "general layout",
         "ARG": "float",
         "INFO": "The left position",
         "DEF": "0.80",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "lyricHyphenWidth",
         "CAT": "general layout",
         "ARG": "float",
         "INFO": "The lyric hyphen and dash width",
         "DEF": "0.20",
         "MIN": "0.10",
         "MAX": "0.50"
      },
      {
         "NAME": "lyricSize",
         "CAT": "general layout",
         "ARG": "float",
         "INFO": "The lyrics size in MEI units",
         "DEF": "4.50",
         "MIN": "2.00",
         "MAX": "8.00"
      },
      {
         "NAME": "lyricTopMinMargin",
         "CAT": "general layout",
         "ARG": "float",
         "INFO": "The minmal margin above the lyrics in MEI units",
         "DEF": "3.00",
         "MIN": "3.00",
         "MAX": "8.00"
      },
      {
         "NAME": "minMeasureWidth",
         "ARG": "integer",
         "INFO": "The minimal measure width in MEI units",
         "CAT": "general layout",
         "DEF": "15",
         "MIN": "1",
         "MAX": "30"
      },
      {
         "NAME": "measureNumber",
         "ARG": "string",
         "INFO": "The measure numbering rule (unused)",
         "CAT": "general layout",
         "DEF": "system",
         "ALT": "interval"
      },
      {
         "NAME": "slurControlPointsr",
         "ARG": "integer",
         "INFO": "Slur control points - higher value means more curved at the end",
         "CAT": "general layout",
         "DEF": "5",
         "MIN": "1",
         "MAX": "10"
      },
      {
         "NAME": "slurCurveFactor",
         "ARG": "integer",
         "INFO": "Slur curve factor - high value means rounder slurs",
         "CAT": "general layout",
         "DEF": "10",
         "MIN": "1",
         "MAX": "100"
      },
      {
         "NAME": "slurHeightFactor",
         "ARG": "integer",
         "INFO": "Slur height factor -  high value means flatter slurs",
         "CAT": "general layout",
         "DEF": "5",
         "MIN": "1",
         "MAX": "100"
      },
      {
         "NAME": "slurMinHeight",
         "CAT": "general layout",
         "ARG": "float",
         "INFO": "The minimum slur height in MEI units",
         "DEF": "1.20",
         "MIN": "0.30",
         "MAX": "2.00"
      },
      {
         "NAME": "slurMaxHeight",
         "CAT": "general layout",
         "ARG": "float",
         "INFO": "The maximum slur height in MEI units",
         "DEF": "3.00",
         "MIN": "2.00",
         "MAX": "6.00"
      },
      {
         "NAME": "slurMaxSlope",
         "ARG": "integer",
         "INFO": "The maximum slur slope in degrees",
         "CAT": "general layout",
         "DEF": "20",
         "MIN": "0",
         "MAX": "45"
      },
      {
         "NAME": "slurThickness",
         "CAT": "general layout",
         "ARG": "float",
         "INFO": "The slur thickness in MEI units",
         "DEF": "0.60",
         "MIN": "0.20",
         "MAX": "1.20"
      },
      {
         "NAME": "spacingLinear",
         "CAT": "general layout",
         "ARG": "float",
         "INFO": "Specify the linear spacing factor",
         "DEF": "0.25",
         "MIN": "0.00",
         "MAX": "1.00"
      },
      {
         "NAME": "spacingNonLinear",
         "CAT": "general layout",
         "ARG": "float",
         "INFO": "Specify the non-linear spacing factor",
         "DEF": "0.60",
         "MIN": "0.00",
         "MAX": "1.00"
      },
      {
         "NAME": "spacingStaff",
         "ARG": "integer",
         "INFO": "The staff minimal spacing in MEI units",
         "CAT": "general layout",
         "DEF": "8",
         "MIN": "0",
         "MAX": "24"
      },
      {
         "NAME": "spacingSystem",
         "ARG": "integer",
         "INFO": "The system minimal spacing in MEI units",
         "CAT": "general layout",
         "DEF": "3",
         "MIN": "0",
         "MAX": "12"
      },
      {
         "NAME": "staffLineWidth",
         "CAT": "general layout",
         "ARG": "float",
         "INFO": "The staff line width in unit",
         "DEF": "0.15",
         "MIN": "0.10",
         "MAX": "0.30"
      },
      {
         "NAME": "stemWidth",
         "CAT": "general layout",
         "ARG": "float",
         "INFO": "The stem width",
         "DEF": "0.20",
         "MIN": "0.10",
         "MAX": "0.50"
      },
      {
         "NAME": "tieThickness",
         "CAT": "general layout",
         "ARG": "float",
         "INFO": "The tie thickness in MEI units",
         "DEF": "0.50",
         "MIN": "0.20",
         "MAX": "1.00"
      },
      {
         "NAME": "appXPathQuery",
         "CAT": "element selectors",
         "ARG": "string",
         "INFO": "Set the xPath query for selecting <app> child elements. By default the <lem> or the first <rdg> is selected.",
         "EXAM": "@./rdg[contains(@source, 'source-id')]",
         "REPEAT": "true"
      },
      {
         "NAME": "choiceXPathQuery",
         "CAT": "element selectors",
         "ARG": "string",
         "INFO": "Set the xPath query for selecting <choice> child elements. By default the first child is selected.",
         "EXAM": "@./orig",
         "REPEAT": "true"
      },
      {
         "NAME": "mdivXPathQuery",
         "CAT": "element selectors",
         "ARG": "string",
         "INFO": "Set the xPath query for selecting the <mdiv> to be rendered; only one <mdiv> can be rendered.",
         "DEF": "",
         "REPEAT": "true"
      },
      {
         "NAME": "substXPathQuery",
         "CAT": "element selectors",
         "ARG": "string",
         "INFO": "Set the xPath query for selecting <subst> child elements.  By default the first child is selected.",
         "EXAM": "@./del",
         "REPEAT": "true"
      },
      {
         "NAME": "defaultBottomMargin",
         "CAT": "element margins",
         "ARG": "float",
         "INFO": "The default bottom margin",
         "DEF": "0.50",
         "MIN": "0.00",
         "MAX": "5.00"
      },
      {
         "NAME": "defaultLeftMargin",
         "CAT": "element margins",
         "ARG": "float",
         "INFO": "The default left margin",
         "DEF": "0.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "defaultRightMargin",
         "CAT": "element margins",
         "ARG": "float",
         "INFO": "The default right margin",
         "DEF": "0.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "defaultTopMargin",
         "CAT": "element margins",
         "ARG": "float",
         "INFO": "The default top margin",
         "DEF": "0.50",
         "MIN": "0.00",
         "MAX": "6.00"
      },
      {
         "NAME": "leftMarginAccid",
         "CAT": "element margins",
         "ARG": "float",
         "INFO": "The margin for accid in MEI units",
         "DEF": "1.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "leftMarginBarLine",
         "CAT": "element margins",
         "ARG": "float",
         "INFO": "The margin for barLine in MEI units",
         "DEF": "0.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "leftMarginBeatRpt",
         "CAT": "element margins",
         "ARG": "float",
         "INFO": "The margin for beatRpt in MEI units",
         "DEF": "2.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "leftMarginChord",
         "CAT": "element margins",
         "ARG": "float",
         "INFO": "The margin for chord in MEI units",
         "DEF": "1.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "leftMarginClef",
         "CAT": "element margins",
         "ARG": "float",
         "INFO": "The margin for clef in MEI units",
         "DEF": "1.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "leftMarginKeySig",
         "CAT": "element margins",
         "ARG": "float",
         "INFO": "The margin for keySig in MEI units",
         "DEF": "1.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "leftMarginLeftBarLine",
         "CAT": "element margins",
         "ARG": "float",
         "INFO": "The margin for left barLine in MEI units",
         "DEF": "1.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "leftMarginMensur",
         "CAT": "element margins",
         "ARG": "float",
         "INFO": "The margin for mensur in MEI units",
         "DEF": "1.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "leftMarginMeterSig",
         "CAT": "element margins",
         "ARG": "float",
         "INFO": "The margin for meterSig in MEI units",
         "DEF": "1.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "leftMarginMRest",
         "CAT": "element margins",
         "ARG": "float",
         "INFO": "The margin for mRest in MEI units",
         "DEF": "0.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "leftMarginMRpt2",
         "CAT": "element margins",
         "ARG": "float",
         "INFO": "The margin for mRpt2 in MEI units",
         "DEF": "0.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "leftMarginMultiRest",
         "CAT": "element margins",
         "ARG": "float",
         "INFO": "The margin for multiRest in MEI units",
         "DEF": "0.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "leftMarginMultiRpt",
         "CAT": "element margins",
         "ARG": "float",
         "INFO": "The margin for multiRpt in MEI units",
         "DEF": "0.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "leftMarginNote",
         "CAT": "element margins",
         "ARG": "float",
         "INFO": "The margin for note in MEI units",
         "DEF": "1.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "leftMarginRest",
         "CAT": "element margins",
         "ARG": "float",
         "INFO": "The margin for rest in MEI units",
         "DEF": "1.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "leftMarginRightBarLine",
         "CAT": "element margins",
         "ARG": "float",
         "INFO": "The margin for right barLine in MEI units",
         "DEF": "1.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "rightMarginAccid",
         "CAT": "element margins",
         "ARG": "float",
         "INFO": "The right margin for accid in MEI units",
         "DEF": "0.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "rightMarginBarLine",
         "CAT": "element margins",
         "ARG": "float",
         "INFO": "The right margin for barLine in MEI units",
         "DEF": "0.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "rightMarginBeatRpt",
         "CAT": "element margins",
         "ARG": "float",
         "INFO": "The right margin for beatRpt in MEI units",
         "DEF": "0.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "rightMarginChord",
         "CAT": "element margins",
         "ARG": "float",
         "INFO": "The right margin for chord in MEI units",
         "DEF": "0.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "rightMarginClef",
         "CAT": "element margins",
         "ARG": "float",
         "INFO": "The right margin for clef in MEI units",
         "DEF": "1.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "rightMarginKeySig",
         "CAT": "element margins",
         "ARG": "float",
         "INFO": "The right margin for keySig in MEI units",
         "DEF": "1.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "rightMarginLeftBarLine",
         "CAT": "element margins",
         "ARG": "float",
         "INFO": "The right margin for left barLine in MEI units",
         "DEF": "1.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "rightMarginMensur",
         "CAT": "element margins",
         "ARG": "float",
         "INFO": "The right margin for mensur in MEI units",
         "DEF": "1.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "rightMarginMeterSig",
         "CAT": "element margins",
         "ARG": "float",
         "INFO": "The right margin for meterSig in MEI units",
         "DEF": "1.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "rightMarginMRest",
         "CAT": "element margins",
         "ARG": "float",
         "INFO": "The right margin for mRest in MEI units",
         "DEF": "0.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "rightMarginMRpt2",
         "CAT": "element margins",
         "ARG": "float",
         "INFO": "The right margin for mRpt2 in MEI units",
         "DEF": "0.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "rightMarginMultiRest",
         "CAT": "element margins",
         "ARG": "float",
         "INFO": "The right margin for multiRest in MEI units",
         "DEF": "0.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "rightMarginMultiRpt",
         "CAT": "element margins",
         "ARG": "float",
         "INFO": "The right margin for multiRpt in MEI units",
         "DEF": "0.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "rightMarginNote",
         "CAT": "element margins",
         "ARG": "float",
         "INFO": "The right margin for note in MEI units",
         "DEF": "0.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "rightMarginRest",
         "CAT": "element margins",
         "ARG": "float",
         "INFO": "The right margin for rest in MEI units",
         "DEF": "0.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "rightMarginRightBarLine",
         "CAT": "element margins",
         "ARG": "float",
         "INFO": "The right margin for right barLine in MEI units",
         "DEF": "0.00",
         "MIN": "0.00",
         "MAX": "2.00"
      }
   ]
};

function prepareHumdrumOptions() {
	var list = VEROVIO_OPTIONS.OPTION;
	for (var i=0; i<list.length; i++) {
		if (list[i].CLI_ONLY) {
			continue;
		}
		VEROVIO_OPTIONS[list[i].NAME] = list[i];
	}
}
prepareHumdrumOptions();



//////////////////////////////
//
// displayHumdrum -- Main externally usable function which sets up
//   a Humdrum notation display on a webpage.
//

function displayHumdrum(opts) {
	if (document.readyState === "complete" || document.readyState === "loaded"
			|| document.readyState === "interactive") {
     	displayHumdrumNow(opts);
	} else {
		// Wait until the page has finished loading resources.
		document.addEventListener("DOMContentLoaded", function() {
			displayHumdrumNow(opts);
		});
	}
}



//////////////////////////////
//
// displayHumdrumNow -- Don't wait, presumably since the page has finished loading.
//

function displayHumdrumNow(opts) {
	if (typeof opts  === "string" || opts instanceof String) {
		// This is the base ID for a Humdrum example to display.
		// Extract the options from any existing container for the
		// example and call this function with them.
		var mycontainer = document.querySelector("#" + opts + "-container");
		if (!mycontainer) {
			return;
		}
		var myoptions = document.querySelector("#" + opts + "-options");
		if (!myoptions) {
			return;
		}
		var optionobj = JSON.parse(myoptions.innerHTML);
		displayHumdrumNow(optionobj);
		return;
	}

	if (opts instanceof Element) {
		// Currently not allowed, but maybe allow the container element, and then
		// extract the options from the container (from the *-options element).
		return;
	}

	var sourceid = opts["source"];
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

	var targetid = opts["target"];
	if (!targetid) {
		targetid = sourceid;
	}


	var containerid = "";
	var container;
	if (opts.hasOwnProperty("url")) {
		// console.log("DOWNLOADING URL", opts.url);
		// download data from URL, and then display downloaded contents.
		opts.processedUrl = opts.url;
		delete opts.url;
		downloadHumdrumUrlData(source, JSON.parse(JSON.stringify(opts)));
	} else {
		containerid = targetid + "-container";
		var container = document.querySelector("#" + containerid);
		var preventRendering = false;
		if (!container) {
			if (opts.suppressSvg) {
				preventRendering = true;
			}
			var target = document.querySelector("#" + targetid);
			if (!target) {
				console.log("Error: Cannot find target", "#" + target);
				return;
			}
			container = createContainer(target, containerid);
		}
		initializeContainer(container, opts);
		copyContentToContainer(container, sourceid);
		if (!preventRendering) {
			var toolkit = opts.renderer;
			displaySvg(toolkit, container);
		} else {
			container.style.display = "none";
		}
	}
}



///////////////////////////////
//
// downloadHumdrumUrlData -- Download Humdrum data from a URL and then convert the data into an SVG.
//

function downloadHumdrumUrlData(source, opts) {
	if (!source) {
		return;
	}
	if (opts.processedUrl.match(/^\s*$/)) {
		return;
	}
	var url = opts.processedUrl;
	var request = new XMLHttpRequest();
	request.onload = function() {
		source.innerHTML = this.responseText;
		displayHumdrumNow(opts);
	};
	request.open("GET", url);
	request.send();
}



//////////////////////////////
//
// displaySvg -- Add default settings to options and then render and
//     show the Humdrum data as an SVG image on the page.
//

function displaySvg(toolkit, container) {
	if (!toolkit) {
		// search for the verovio toolkit if not explicitly specified
		if (typeof vrvToolkit !== "undefined") {
			toolkit = vrvToolkit;
		}
	}
	var containerid = container.id;
	var baseid = containerid.replace(/-container$/, "");
	var source = container.querySelector("#" + baseid + "-humdrum");
	if (!source) {
		console.log("Warning: No content to display");
		console.log("CONTAINER ID:", containerid);
		console.log("BASE ID:", baseid);
		console.log("SOURCE ID:", "#" + baseid + "-humdrum");
		console.log("SOURCE ELEMENT:", source);
		return;
	}
	var sourcetext = source.textContent.replace(/^\s+/m, "");

	if (sourcetext.match(/^\s*$/)) {
		// No data so don't try to render.
		// One problem may be that URL downloading is not suppressing display
		// of music until after URL data has been downloaded, so check on that.
		return;
	}

	var options = container.querySelector("#" + baseid + "-options");
	
	var pluginOptions = {};
	var vrvOptions = {};
	if (options) {
		pluginOptions = JSON.parse(options.innerHTML);
		vrvOptions = extractVerovioOptions(pluginOptions);
	}

	vrvOptions = insertDefaultOptions(vrvOptions, pluginOptions, container);

	sourcetext += getFilters(pluginOptions);

	var svgtarget = container.querySelector("#" + baseid + "-svg");
	if (!svgtarget) {
		console.log("Error: no container for SVG output image", "#" + baseid + "-svg");
	}

	var svg = toolkit.renderData(sourcetext, vrvOptions);

	svgtarget.innerHTML = svg;
	if (pluginOptions.postFunction) {
		// Need to run a function after the image has been created
		executeFunctionByName(pluginOptions.postFunction, window, [baseid]);
	}
	pluginOptions._currentPageWidth = vrvOptions.pageWidth;

	// Update stored options 
	var autoresize = pluginOptions.autoResize === "true" || pluginOptions.autoResize === true
		|| pluginOptions.autoResize === 1;

	if (autoresize && !pluginOptions._autoResizeInitialize) {
		// need to inialize a resize callback for this image.
		pluginOptions._autoResizeInitialize = true;
		var aridelement = container.parentNode;

		if (aridelement) {
			try {
				var ro = new ResizeObserver(function(event) {
					(function(bid, tk) {
						var contelement = document.querySelector("#" + baseid + "-container");
						var svgelement = contelement.querySelector("#" + baseid + "-svg");
						displaySvg(toolkit, container);
					})(baseid, toolkit);
				});
				ro.observe(aridelement);
			} catch (error) {
				// ResizeObserver is not present for this browser, use setInterval instead.
				var refreshRate = 250; // milliseconds
				setInterval(function() {
					(function(bid, tk) {
						checkParentResize(bid, tk);
					})(baseid, toolkit)
				}, refreshRate);
			}
		} else {
			window.addEventListener("resize", function(event) {
				(function(bid, tk) {
					var contelement = document.querySelector("#" + baseid + "-container");
					var svgelement = contelement.querySelector("#" + baseid + "-svg");
					displaySvg(toolkit, container);
				})(baseid, toolkit);
			});
		}
	}

	// save the options with any automatic state variable updates:
	var ostring = JSON.stringify(pluginOptions);
	options.innerHTML = ostring;
	console.log("OPTIONS:", pluginOptions);
}


//////////////////////////////
//
// checkParentResize --
//

function checkParentResize(baseid, toolkit) {
	var container = document.querySelector("#" + baseid + "-container");
	if (!container) {
		return;
	}
	var options = container.querySelector("#" + baseid + "-options");
	if (!options) {
		return;
	}
	var pluginOptions = JSON.parse(options.innerHTML);
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
	if (!MUTEX) {
		MUTEX = 1;
		displaySvg(toolkit, container);
		MUTEX = 0;
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
// insertDefaultOptions --
//

function insertDefaultOptions(vrvOptions, pluginOptions, container) {

	if (pluginOptions.header === "true" || pluginOptions.header === true) {
		vrvOptions.noHeader = 0;
	}

	if (!vrvOptions.hasOwnProperty("scale")) {
		// scale must be set before automatic pageWidth calculations
		vrvOptions.scale = 40;
	}

	if (!vrvOptions.pageWidth) {
		// set the width of the notation automatically to the width of the parent element
		var style = window.getComputedStyle(container, null);
		var width = parseInt(style.getPropertyValue("width"));
		vrvOptions.pageWidth = width;
		if (vrvOptions.scale) {
			vrvOptions.pageWidth /= (parseInt(vrvOptions.scale)/100.0);
		}
	}

	if (!vrvOptions.hasOwnProperty("pageHeight")) {
		vrvOptions.pageHeight = 60000;
	}
	if (pluginOptions.incipit === "true" || pluginOptions.incipit === 1 ||
			pluginOptions.incipit === true) {
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
	if (VEROVIO_OPTIONS) {
		for (var i=0; i<VEROVIO_OPTIONS.OPTION.length; i++) {
			var option = VEROVIO_OPTIONS.OPTION[i];
			var name = option.NAME;
			if (option.CLI_ONLY === "true" || option.CLI_ONLY === true || option.CLI_ONLY === 1) {
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
	} else if (Object.prototype.toString.call(filters) !== "[object Array]") {
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
// copyContentToContainer --
//

function copyContentToContainer(container, sourceid) {
	var source = document.querySelector("#" + sourceid);
	if (!source) {
		console.log("Error: No Humdrum source for " + sourceid);
		return;
	}
	if (!container) {
		console.log("Error: No container for storing data from" + sourceid);
		return;
	}
	var containerid = container.id;
	var targetid = containerid.replace(/-container$/, "");
	var htarget = container.querySelector("#" + targetid + "-humdrum");
	if (!htarget) {
		console.log("CANNOT FIND Humdrum container", "#" + targetid + "-humdrum");
		return;
	}
	var content = source.innerHTML.replace(/^\s+/m, "");

	var initial = content.substr(0, 600);
	// Probably use the real plugin options here later:
	var poptions = {};
	var options;
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
				inputFormat: "musicxml-hum"
			};
			content = convertMusicXmlToHumdrum(content, options, poptions);
		} else if (ctype === "mei") {
			// convert MEI data into Humdrum data
			options = {
				inputFormat: "mei-hum"
			};
			content = convertMeiToHumdrum(content, options, poptions);
		} else {
			console.log("Warning: given some strange XML data:", content);
		}
	}

	htarget.innerHTML = content;
	htarget.style.display = "block";
}



//////////////////////////////
//
// initializeContainer --  Generate contents for the main humdrum-plugin div that is used
//      to hold the verovio options, the input humdrum text and the output verovio SVG
//      image.
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

function initializeContainer(container, opts) {
	var output = "";
	hvisible = opts["humdrumVisible"] == "true";
	var targetid = container.id.replace(/-container$/, "");

	// convert function names into strings
	if (opts.postFunction) {
		if ({}.toString.call(opts.postFunction) === '[object Function]') {
			opts.postFunction = functionName(opts.postFunction);
		}
	}

	output += "<div class='humdrum-plugin' style='display:none;' id='";
	output += targetid + "-options'>";
	output += JSON.stringify(opts);
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
	output += targetid + "-humdrum'></pre>\n";
	output += "</div>\n";
	output += "</td>\n";
	
	output += "<td style='border:0;'>\n";
	output += "<div class='verovio-svg'";
	// output += " style='margin-top:-20px;'";
	output += " id='" + targetid + "-svg'></div>\n";
	output += "</td>\n";
	output += "</tr>\n";
	output += "</tbody>\n";
	output += "</table>\n";

	container.innerHTML = output;
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
// extractVerovioOptions -- Extract all of the verovio options
//   from the Humdrum plugin options object.
//

function extractVerovioOptions(opts) {
	var output = {};

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
		if (!opts.hasOwnProperty(property)) {
			// not a real property of object
			continue;
		}
		if (property === "scale") {
			// scale option handled above
			continue;
		}
		if (typeof VEROVIO_OPTIONS[property] === 'undefined') {
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
// createContainer -- Create a target location for the Humdrum notation
//    content.  First check if there is an element with the given ID,
//    and return that element if it exists.  If it does not exist, then
//    create a div element with the given containerid used as the ID for the
//    div.
//

function createContainer(target, containerid) {
	if (!target) {
		console.log("Error: need a target to place container before");
		return;
	}
	var container = document.querySelector("#" + containerid);
	if (container) {
		return container;
	}
	container = document.createElement('div');
	container.id = containerid;
	container.className = "humdrum-plugin";
	target.parentNode.insertBefore(container, target);
	return container;
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
console.log("SAVING file", fn);
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



