---
vim:	ts=3
---

{% include_relative listeners.html %}
{% include_relative scripts-local.html %}
{% include_relative styles-local.html %}

# Options #


This page lists options for controlling the display and formatting
of music notation.  These options are given within an object passed
to the `displayHumdrum` function.  

Here is a a minimal call to `displayHumdrum`, giving only a source
ID for the Humdrum data to display:

<script>
displayHumdrum({source: "default"});
</script>
<script type="text/x-humdrum" id="default">
**kern
*M4/4
1c;
==
*-
</script>


```html
<script>
   displayHumdrum({source: "default"});
</script>

<script type="text/x-humdrum" id="default">
**kern
*M4/4
1c;
==
*-
</script>
```

To give more options, add them to the input object for `displayHumdrum`.
Here is an example of changing the size:

<script>
	var options = {
		source: "large-print",
		scale: 80
	};

	displayHumdrum(options);
</script>

<script type="text/x-humdrum" id="large-print">
**kern
*M4/4
1c;
==
*-
</script>


```html
<script>
   var options = {
      source: "large-print",
      scale: 80
   };

   displayHumdrum(options);
</script>

<script type="text/x-humdrum" id="large-print">
**kern
*M4/4
1c;
==
*-
</script>
```


<a name="list"> </a>

# Options list #

Options that can be used in `displayHumdrum()` are displayed below.
HNP-specific options names are colored in green, and verovio-specific
options are colored in purple.


{% include options.md %}


# Discussion and Examples #

<style>
	li { padding-bottom: 10px; }
</style>

* <a href="url">URL-related options</a>
* <a href="uri">URI option demo</a>
* <a href="lyrics">Lyrics-related options</a>
* <a href="resize">Automatic resizing option and examples</a>



{% comment %}
	The following data is used to print some music in the header of this page.
	The include file _includes/music-banner.html reads this data and creates
	the notation in the header.  If there is a !!!title: record in the
	Humdrum data below, then it will be placed above the musical example.
{% endcomment %}

<div style="display:none" id="title-notation-source">
!!!title: Vivaldi: Violin Concerto in E major (<i>Spring</i>), RV 269, op. 8, no. 1, mvmt. 1
{% include banner-scores/vivaldi-op8-no1-mvmt1-mm1-40.krn %}
</div>



