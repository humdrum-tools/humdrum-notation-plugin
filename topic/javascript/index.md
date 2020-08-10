---
vim:	ts=3
---

# Integration with Javascript #

{% include_relative style-local.html %}
{% include_relative listeners.html %}
{% include_relative scripts-local.html %}

Below is a musical dice game attributed to Mozart (K<sup>6</sup> 516f).  The <a
href="https://kern.humdrum.org/cgi-bin/ksdata?file=k516f.krn&l=users/craig/dice/mozart&format=pdf"
target="_new">original score</a> was printed in a musical magazine
in Berlin around 1790.  Click on measure numbers in the following
grid to construct a score, which will be displayed under the measure
grid.  When no measures are selected, all of the input measures are
displayed.  To play the game, roll two dice at a time to select a specific row
in the grid.  Do this sixteen times to generate a randomized score.

<div id="measure-grid"></div>

<script>
	var HnpOptions = {
		uri: "humdrum://dice/mozart/k516f.krn",
		source: "dice",
		postFunctionHumdrum: displayHumdrumData
	}

	displayHumdrum(HnpOptions);
</script>

<script type="text/x-humdrum" id="dice"> /script>


<div style="display:none" id="humdrum-link"></div>
<pre style="display:none; tab-size:12; -moz-tab-size:12;" id="humdrum-score"></pre>


<div style="display:none" id="title-notation-source">
!!!title: A realization of <i>Musikalisches Würfelspiel</i> (Mozart?, K<sup>6</sup>. 516f)
{% include banner-scores/mozart-516f.krn %}
</div>

