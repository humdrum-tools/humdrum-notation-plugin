//
// Programmer:    Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date: Sun Dec 23 01:47:54 EST 2018
// Last Modified: Sun Dec 23 01:47:57 EST 2018
// Filename:      _includes/code/ReferenceRecords.js
// Syntax:        JavaScript 1.8.5/ECMAScript 5.1
// vim:           ts=3
//
//	This file contains the ReferenceRecord class for 
// the Humdrum notation plugin.  This class is used by
// the ReferenceRecords class to store a particular
// reference record.
//


//////////////////////////////
//
// ReferenceRecords::initializer --
//

function ReferenceRecord(lineindex, linetext) {
	clear();
	setLineIndex(lineindex);
	setLineText(linetext);
	return this;
}



//////////////////////////////
//
// ReferenceRecords::clear --
//

ReferenceRecord.prototype.clear = function () {
	this.line         = -1;  // line index: offset from 0 for first line in file.
	this.text         = "";
	clearParsedData();
	return this;
}



//////////////////////////////
//
// ReferenceRecords::clearParsedData --
//

ReferenceRecord.prototype.clearParsedData = function () {
	this.key          = "";
	this.keyBase      = "";
	this.keyAt        = "";
	this.keyVariant   = "";
	this.keyCount     = "";
	this.value        = "";
	return this;
};



//////////////////////////////
//
// ReferenceRecords::setLineIndex --
//
ReferenceRecord.prototype.setLineIndex = function (lineindex) {
	try {
		this.line = parseInt(lineindex);
	} catch (error) {
		this.line = -1;
	}
	return this;
};



//////////////////////////////
//
// ReferenceRecords::setLineText --
//

ReferenceRecord.prototype.setLineText = function (linetext) {
	if (typeof linetext === "string" || linetext instanceof String) {
		this.text = linetext;
		parseTextLine();
	} else {
		clear();
	}
	return this;
}



//////////////////////////////
//
// ReferenceRecords::parseTextLine --
//

ReferenceRecord.prototype.parseTextLine = function () {
	// this.key          = The complete reference key.
	// this.keyBase      = The reference key without langauge, count or variant qualifiers.
	// this.keyAt        = The language qualification, including the @ signs.
	// this.keyVariant = The variant qualification (a dash followed by text).
	// this.keyCount     = A Number following a keyBase, before keyAt or keyQual.
	clearParsedData();
	var matches = text.match(/^!!![^!:]+\s*:\s*(.*)\s*$/);
	if (matches) {
		this.keyBase = matches[1];
		this.key     = matches[1];
		this.value   = matches[2];
	}
	matches = this.keyBase.match(/^([^@]+)(@+.*)$/);
	if (matches) {
		this.keyBase = matches[1];
		this.keyAt = matches[2];
	}
	matches = this.keyBase.match(/^([^-]+)-(.+)$/);
	if (matches) {
		this.keyBase    = matches[1];
		this.keyVariant = matches[2];
	}
	// order of language and variant is not defined (so allow either to be first).
	matches = this.keyAt.match(/^([^-]+)-(.+)$/);
	if (matches) {
		this.keyAt      = matches[1];
		this.keyVariant = matches[2];
	}
	return this;
}



