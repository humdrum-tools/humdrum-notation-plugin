//
// Programmer:    Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date: Sun Dec 23 01:47:54 EST 2018
// Last Modified: Sun Dec 23 01:47:57 EST 2018
// Filename:      _includes/code/ReferenceRecords.js
// Syntax:        JavaScript 1.8.5/ECMAScript 5.1
// vim:           ts=3
//
//	This file contains the ReferenceRecords class for 
// the Humdrum notation plugin.  This class is used to access
// the reference records in a Humdrum file.
//


//////////////////////////////
//
// ReferenceRecords::initializer --
//

function ReferenceRecords(humdrumfile) {
	this.sequence = [];  // The order that the Humdrum records are found in the file
	this.database = {};  // Hash of the records by ReferenceRecord::keyBase
	parseReferenceRecords(humdrumfile);
	return this;
}



//////////////////////////////
//
// ReferenceRecords::parseReferenceRecords --
//

ReferenceRecords.prototype.parseReferenceRecords = function (humdrumfile) {
	var lines = [];
	if (typeof linetext === "string" || linetext instanceof String) {
		lines = humdrumfile.match(/[^\r\n]+/g);
	} else if (Object.prototype.toString.call(humdrumfile) === '[object Array]') {
		if (humdrumfile[0] === "string" || humdrumfile[0] instanceof String) {
			line = humdrumfile;
		}
	} else {
		// check if an HTML element and load text from there.
		var ishtml = false;
  		try {
			ishtml = obj instanceof HTMLElement ? true : false;
  		}
  		catch(e){
    		//Browsers not supporting W3 DOM2 don't have HTMLElement and
    		//an exception is thrown and we end up here. Testing some
    		//properties that all elements have (works on IE7)
    		if ((typeof obj === "object") &&
      			(obj.nodeType === 1) && (typeof obj.style === "object") &&
      			(typeof obj.ownerDocument ==="object")) {
				ishtml = true;
			}
		}
		if (ishtml) {
			lines = humdrumfile.innerHTML.match(/[^\r\n]+/g);
		}
	}
	for (i=0; i<lines.length; i++) {
		if (!lines[i].match(/^!!![^!:]/)) {
			var record = new HumdrumRecord(i, lines[i]);
			this.sequence.push(record);
			var key = record.keyBase;
			if (!this.database[key]) {
				this.database[key] = [ record ];
			} else {
				this.database[key].push(record);
			}
		}
	}
	return this;
}



//////////////////////////////
//
// ReferenceRecords::getReferenceFirst -- Get the first reference record
//    which matches the given key.  This function will ignore qualifiers,
//    counts or variants on the key (KEY2 will map to KEY, KEY@@LANG will map
//    to KEY, KEY-variant will map to KEY).
//

ReferenceRecords.prototype.getReferenceFirst = function (keyBase) {
	// return the first keyBase record
	var items  = this.database[keyBase];
	if (!items) {
		return "";
	} else if (items.length > 0) {
		return items[0];
	} else {
		return "";
	}
}



//////////////////////////////
//
// ReferenceRecords::getReferenceAll -- Get all reference records that match to key.
//

ReferenceRecords.prototype.getReferenceAll = function (keyBase) {
	// if keyBase is empty, then return all records:
	if (!keyBase) {
		return this.sequence;
	}
	// return all keyBase records
	var items  = this.database[keyBase];
	if (!items) {
		return [];
	} else if (items.length > 0) {
		return items[0];
	} else {
		return [];
	}
}



//////////////////////////////
//
// ReferenceRecords::getReferenceFirstExact -- 
//

ReferenceRecords.prototype.getReferenceFirstExact = function (key) {
	// return first matching key record
	var list = getReferenceAll(key)
	for (var i=0; i<list.length; i++) {
		if (list[i].key === key) {
			return list[i];
		}
	}
	return "";
}



//////////////////////////////
//
// ReferenceRecords::getReferenceAllExact -- 
//

ReferenceRecords.prototype.getReferenceAllExact = function (key) {
	// return all matching key record
	var list = getReferenceAll(key)
	var output = [];
	for (var i=0; i<list.length; i++) {
		if (list[i].key === key) {
			output.push(list[i]);
		}
	}
	return output;
}



