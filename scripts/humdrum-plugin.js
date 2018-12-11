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


function displayHumdrumNow(opts) {

	// Options should use "source", but code will convert internally to "sourceId":
	if (opts.source && !opts.sourceId) {
		opts.sourceId = opts.source;
	}
	if (opts.sourceID && !opts.sourceId) {
		opts.sourceId = opts.sourceID;
	}
	if (opts["source-id"] && !opts.sourceId) {
		opts.sourceId = opts["source-id"];
	}

	// Options should use "target", but code will convert internally to "targetId":
	if (opts.target && !opts.targetId) {
		opts.targetId = opts.target;
	}
	if (opts.targetID && !opts.targetId) {
		opts.targetId = opts.targetID;
	}
	if (opts["target-id"] && !opts.targetId) {
		opts.targetId = opts["target-id"];
	}

	var sourceid = opts["sourceId"];
	if (!sourceid) {
		console.log("Error: Missing Humdrum data source ID");
		return;
	}
	var source = document.querySelector("#" + sourceid);
	if (!source) {
		console.log("Error: Humdrum source location " +
				sourceid + " cannot be found.");
		return;
	}

	var targetid = opts["targetId"];
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
		downloadHumdrumUrlData(source, opts);
	} else {
		containerid = targetid + "-container";
		var container = document.querySelector("#" + containerid);
		if (!container) {
			var target = document.querySelector("#" + targetid);
			if (!target) {
				console.log("Error: Cannot find target", "#" + target);
				return;
			}
			container = createContainer(target, containerid);
		}
		initializeContainer(container, opts);
		copyContentToContainer(container, sourceid);
		var toolkit = opts.renderer;
		displaySvg(toolkit, container);
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
	request.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			source.textContent = this.responseText;
		}
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
	var sourcetext = source.textContent.replace(/^\s+/sm, "");

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
		pluginOptions = JSON.parse(options.textContent);
		vrvOptions = extractVerovioOptions(pluginOptions);
	}

	sourcetext += getFilters(pluginOptions);


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

	var svgtarget = container.querySelector("#" + baseid + "-svg");
	if (!svgtarget) {
		console.log("Error: no container for SVG output image", "#" + baseid + "-svg");
	}
	var svg = toolkit.renderData(sourcetext, vrvOptions);

	svgtarget.innerHTML = svg;
	if (pluginOptions.post) {
		// Need to run a function after the image has been created
		executeFunctionByName(pluginOptions.post, window, [baseid]);
	}
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
	var content = source.textContent.replace(/^\s+/sm, "");
	htarget.textContent = content;
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
	if (opts.post) {
		if ({}.toString.call(opts.post) === '[object Function]') {
			opts.post = functionName(opts.post);
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



