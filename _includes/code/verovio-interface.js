// vim: ts=3
// This is the Web Worker interface for the verovio toolkit.  These functions are
// interfaced through the verovio-calls.js functions.
//


//////////////////////////////
//
// vrvInterface::vrvInterface --
//

function vrvInterface(use_worker, onReady) {
	this.WIDTH = 0;
	this.HEIGHT = 0;
	this.page = 1;
	this.pageCount = 0;
	this.options = {};

	this.initialized = false;
	this.usingWorker = use_worker;

	if (use_worker) {
		this.createWorkerInterface(onReady);
	} else {
		this.createDefaultInterface(onReady);
	};
}



//////////////////////////////
//
// vrvInterface::createWorkerInterface --
//

vrvInterface.prototype.createWorkerInterface = function (onReady) {
	var vrv = this;

	function handleEvent(oEvent) {
		switch(oEvent.data.method) {
			case "ready":
				vrv.initialized = true;
				onReady();
				break;
			default:
				while (vrv.resolvedIdx <= oEvent.data.idx) {
					//resolve or reject
					if (vrv.resolvedIdx === oEvent.data.idx) {
						if (oEvent.data.success) {
							vrv.promises[vrv.resolvedIdx].deferred.resolve(oEvent.data.result);
						} else {
						vrv.promises[vrv.resolvedIdx].deferred.reject(oEvent.data.result);
						};
					} else {
						vrv.promises[vrv.resolvedIdx].deferred.reject();
					};
					if (vrv.promises[vrv.resolvedIdx].method === "renderData") {
						vrv.renderDataPending--;
						if (vrv.renderDataPending === 0) vrv.handleWaitingRenderData();
					};
					delete vrv.promises[vrv.resolvedIdx];
					vrv.resolvedIdx++;
				};
		};
	};

	// console.log("creating worker interface");
	this.promises = {};
	this.promiseIdx = 0;
	this.resolvedIdx = 0;
	this.renderDataPending = 0;
	this.renderDataWaiting = null;

/*
	var request = new XMLHttpRequest();
	request.open("GET", "{{site.sitename}}/scripts/verovio-worker.js");
	request.responseType = "blob";
	request.onload = function(event) {
		var blob = this.response;
		this.worker = new Worker(window.URL.createObjectURL(blob));
		this.worker.addEventListener("message", handleEvent);
	}
	request.send();
*/

//	this.worker = new Worker("{{site.sitename}}/scripts/verovio-worker.js");
//	this.worker.addEventListener("message", handleEvent);



//	var workerUrl = "{{site.sitename}}/scripts/verovio-worker.js";
//	console.log("LOADING {{site.sitename}}/scripts/verovio-worker.js");
	var workerUrl = "https://verovio-script.humdrum.org/scripts/verovio-worker.js";
	console.log("LOADING https://verovio-script.humdrum.org/scripts/verovio-worker.js");
	this.worker = null;
	var that = this;
	try {
		that.worker = new Worker(workerUrl);
		that.worker.addEventListener("message", handleEvent);

		that.worker.onerror = function (event) {
			event.preventDefault();
			that.worker = createWorkerFallback(workerUrl);
			that.worker.addEventListener("message", handleEvent);
		};
	} catch (e) {
		that.worker = createWorkerFallback(workerUrl);
		that.worker.addEventListener("message", handleEvent);
	}
};



//////////////////////////////
//
// createWorkerFallback -- Cross-origin worker
//

function createWorkerFallback(workerUrl) {
	console.log("Getting cross-origin worker");
	var worker = null;
	try {
		var blob;
		try {
			blob = new Blob(["importScripts('" + workerUrl + "');"], { "type": 'application/javascript' });
		} catch (e) {
			var blobBuilder = new (window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder)();
			blobBuilder.append("importScripts('" + workerUrl + "');");
			blob = blobBuilder.getBlob('application/javascript');
		}
		var url = window.URL || window.webkitURL;
		var blobUrl = url.createObjectURL(blob);
		worker = new Worker(blobUrl);
	} catch (e1) {
		//if it still fails, there is nothing much we can do
	}
	return worker;
}



//////////////////////////////
//
// vrvInterface::createDefaultInterface --
//

vrvInterface.prototype.createDefaultInterface = function (onReady) {

/*  No longer needed?

{% if site.local == "yes" %}
	var url = '/scripts/local/verovio-toolkit.js';
{% else %}
	var url = 'https://verovio-script.humdrum.org/scripts/verovio-toolkit.js';
{% endif %}

	console.log("create default interface")
	var vrv = this;
	this.verovio = new verovioCalls();

	var script = document.createEleent('script');
	script.onload = function () {
		vrv.verovio.vrvToolkit = new verovio.toolkit();
		vrv.initialized = true;
		onReady();
	};
	script.src = url;
	document.head.appendChild(script);

/* verovio toolkit is larger than allowed by localStorage (5 MB limit), so 
 * using basket to store it between sessions is not useful to use:

	basket
	.require(
		{url: url, expire: 500, unique: BasketVersion}
		// loaded as an include:
		// {url: "scripts/ace/humdrumValidator.js", skipCache: true}
	)
	.then(
		function () {
			vrv.verovio.vrvToolkit = new verovio.toolkit();
			vrv.initialized = true;
			onReady();
		},
		function () {
			console.log("There was an error loading script", url);
		}
	);
*/




};



//////////////////////////////
//
// vrvInterface::checkInitialized --
//

vrvInterface.prototype.checkInitialized = function () {
	if (!this.initialized) throw("Verovio toolkit not (yet) initialized");
};



//////////////////////////////
//
// vrvInterface::filterData --
//

vrvInterface.prototype.filterData = function (opts, data, type) {
	// Don't store options when filtering data.
	return this.execute("filterData", arguments);
};



//////////////////////////////
//
// vrvInterface::renderData --
//

vrvInterface.prototype.renderData = function (opts, data, page) {
	// console.log("%cvrvInterface.renderData", "color: #aa8800; font-weight: bold");
	this.options = opts;
	return this.execute("renderData", arguments);
};



//////////////////////////////
//
// vrvInterface::getHumdrum --
//

vrvInterface.prototype.getHumdrum = function () {
	// console.log("%cvrvInterface.getHumdrum", "color: #aa8800; font-weight: bold");
	var value = this.execute("getHumdrum", arguments);
	return value;
};



//////////////////////////////
//
// vrvInterface::redoLayout --
//

vrvInterface.prototype.redoLayout = function (opts, redo, measure) {
	// console.log("%cvrvInterface.redoLayout", "color: #8800aa; font-weight: bold");
	this.options = opts;
	return this.execute("redoLayout", arguments);
};



//////////////////////////////
//
// vrvInterface::renderPage --
//

vrvInterface.prototype.renderPage = function (page) {
	return this.execute("renderPage", arguments);
};



//////////////////////////////
//
// vrvInterface::renderAllPages --
//

vrvInterface.prototype.renderAllPages = function (data, opts) {
	return this.execute("renderAllPages", arguments);
};



//////////////////////////////
//
// vrvInterface::gotoPage --
//

vrvInterface.prototype.gotoPage = function (page) {
	var vrv = this;
	return this.execute("gotoPage", arguments)
	.then(function (obj) {
		vrv.page = obj.page;
		vrv.pageCount = obj.pageCount;
		return page;
	});
};



//////////////////////////////
//
// vrvInterface::getMEI --
//

vrvInterface.prototype.getMEI = function (page) {
	return this.execute("getMEI", arguments);
};



//////////////////////////////
//
// vrvInterface::renderToMidi --
//

vrvInterface.prototype.renderToMidi = function () {
	var value = this.execute("renderToMidi", arguments);
	return value;
};



//////////////////////////////
//
// vrvInterface::getElementsAtTime --
//

vrvInterface.prototype.getElementsAtTime = function (vrvTime) {
	return this.execute("getElementsAtTime", arguments);
};



//////////////////////////////
//
// vrvInterface::getTimeForElement --
//

vrvInterface.prototype.getTimeForElement = function (id) {
	return this.execute("getTimeForElement", arguments);
};



//////////////////////////////
//
// vrvInterface::execute --
//

vrvInterface.prototype.execute = function (method, args) {
	var vrv = this;
	if (this.usingWorker) {
		var arr = Array.prototype.slice.call(args);
		switch(method) {
			case "renderData":
console.log("GOING TO RENDER DATA HERE YYY");
				return vrv.postRenderData(method, arr);
			default:
				vrv.handleWaitingRenderData();
				return vrv.post(method, arr);
		};
	} else {
		return new RSVP.Promise(function (resolve, reject) {
			try {
				vrv.checkInitialized();
				resolve(vrv.verovio[method].apply(vrv.verovio, args));
			} catch(err) {
				reject(err);
			};
		});
	};
};



//////////////////////////////
//
// vrvInterface::handleWaitingRenderData --
//

vrvInterface.prototype.handleWaitingRenderData = function () {
console.log("HANDLE WAITING RENDER DATA", this, JSON.stringify(this));
	if (this.renderDataWaiting) {
console.log("GOT HERE TTT");
		this.postDeferredMessage("renderData",
				this.renderDataWaiting.args,
				this.renderDataWaiting.deferred);
		this.renderDataWaiting = null;
		this.renderDataPending++;
	};
};



//////////////////////////////
//
// vrvInterface::postRenderData --
//

vrvInterface.prototype.postRenderData = function (method, args) {
console.log("ENTERING POST RENDER DATA");
	// squash pending renderings:
	if (this.renderDataPending > 0) {
console.log("POSITIVE RENDER DATA PENDING:", this.renderDataPending);
		if (!this.renderDataWaiting) {
			this.renderDataWaiting = {
				deferred: new RSVP.defer(),
			};
		};
		this.renderDataWaiting.args = args;
		return this.renderDataWaiting.deferred.promise;
	} else {
console.log("ZERO RENDER DATA PENDING");
		this.renderDataPending++;
		this.renderDataWaiting = null;
		return this.post(method, args);
	};
};



//////////////////////////////
//
// vrvInterface::post --
//

vrvInterface.prototype.post = function (method, args) {
	return this.postDeferredMessage(method, args, new RSVP.defer());
};



//////////////////////////////
//
// vrvInterface::postDeferredMessage --
//

vrvInterface.prototype.postDeferredMessage = function (method, args, deferred) {
console.log("ENTERING POST DEFERRED MESSAGE METHOD=", method);
	this.worker.postMessage({
		idx: this.promiseIdx,
		method: method,
		args: args
	});
	this.promises[this.promiseIdx] = {
		method: method,
		deferred: deferred
	};
	this.promiseIdx++;
	return deferred.promise;
};



