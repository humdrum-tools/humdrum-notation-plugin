---
vim:	ts=3
cachedBannerSvg: 60.2px
permalink: /index.html
---

{% include_relative styles-local.html %}


# Introduction #

The Humdrum Notation Plugin creates music notation for web pages
from <a target="_blank" href="https://www.humdrum.org">Humdrum</a>
digital scores, either embedded within the same page or from an
external source.  Here is an example use of the plugin to display
J.N.&nbsp;Hummel's prelude in D-flat major, op.&nbsp;67/15:


{% include tryit.html id="G67FY3DSQPMJ" marginBottom="-20px" zIndex="2000" %}
{% include hummel-interaction.html %}
<div id="hummel-prelude-op67n15-container" style="height:573.2px;">
{% include_relative hummel-prelude-op67n15.svg -%}
</div>
{% include_relative hummel-example.txt -%}

The above music notation was created dynamically inside your web
browser as the page was loaded, using <a target="_blank"
href="hummel-prelude-op67n15.txt">this Humdrum score</a> stored in
a <a target="_blank" href="hummel-example-b.txt">plugin wrapper</a>
inside the webpage.  The notation is displayed as an SVG image,
allowing interaction with notational elements: 
trying moving the mouse over
a note and see what happens.  (<a target="_blank"
href="highlight-pitch-class.txt">Here</a> is the javascript code
for the interaction).  In addition to embedding the musical data
within the webpage, the plugin can also download scores from external
sources, such as this example of the same score downloaded from <a
target="_blank"
href="https://github.com/craigsapp/hummel-preludes/tree/master/kern">Github</a>:

``` html
{% include_relative hummel-example2b.txt -%}
```
{% include tryit.html id="G67GAX50ACYE" marginTop="-65px" %}

Different views of the score can be created on a webpage using the
same data.  Here is an example that extracts the first three measures
of the prelude and transposes it to C major:

<div id="hummel-extract-container" style="height:200.2px;">
{% include_relative hummel-extract.svg -%}
</div>
{% include_relative hummel-example2.txt -%}

``` html
{% include_relative hummel-example2.txt -%}
```
{% include tryit.html id="G67GILRVM07N" marginTop="-65px" %}

This example applies the filter `myank -m 1-3 | transpose -k
c` to the full score, generating a transposed excerpt.
See the <a href="#filters">Filter section</a> of this
documentation for more information, or the <a target="_blank"
href="https://doc.verovio.humdrum.org/filters/index.html">filter documentation</a> for
<a target="_blank" href="http://verovio.humdrum.org">Verovio Humdrum
Viewer</a>, which is an online interactive music editor where you can
prepare scores for use with the Humdrum Notation Plugin.


Feature requests and bug-reports can be submitted to the <a
target="_blank"
href="https://github.com/humdrum-tools/humdrum-plugin/issues">issues
page</a> of the humdrum-plugin repository on Github. See also this
<a target="_blank" href="https://chorales.sapp.org">J.S. Bach
Chorales website</a> which uses the Humdrum Notation Plugin to
display chorales, along with an <a target="_blank"
href="https://chorales.sapp.org/typesetter">interactive chorale
typesetter</a> that generates Humdrum Notation Plugin code for
displaying chorales on any website.

# Embedding digital scores on webpage #


## Setup ##

To use the Humdrum Notation Plugin on a webpage, copy the following 
line somewhere into your webpage:

``` html
<script src="https://plugin.humdrum.org/scripts/humdrum-notation-plugin-worker.js"></script>
```
{% include tryit.html id="G68EZ6WSUC28" marginTop="-62px" %}

If you are displaying a webpage from a local file on your computer without
using a webserver, you will instead need to use these setup lines:

``` html
<script src="https://verovio-script.humdrum.org/scripts/verovio-toolkit.js"></script>
<script src="https://plugin.humdrum.org/scripts/humdrum-notation-plugin.js"></script>
<script>var vrvToolkit = new verovio.toolkit()</script>
```
{% include tryit.html id="G68F298DVD3V" marginTop="-65px" %}

The first case is best for online use, particularly when lots of music
notation examples are given on the same page.  The second case can
also be used for online situations but performs best when there
are few examples on a page.  

Notation rendering is handled by <a target="_blank" href="">Vervio</a>.
For the single-line setup shown above, the verovio toolkit is loaded
automatically by the Humdrum Notation Plugin, while in the second
case it is loaded independetly (on the first line of the three-line
setup method), and then the toolkit is initialized within the webpage
with the last line.


## Displaying music ##


Adding a musical example onto a webpage consists of two components:
(1) a javascript function call to `displayHumdrum()` with a list
of display options, such as:

``` html
<script>
   displayHumdrum({source: "example"});
</script>
```

and (2) a corresponding Humdrum data script on the page, such as:

``` html
<script type="text/x-humdrum" id="example">
{% include_relative example.krn -%}
</script>
```
{% include tryit.html id="G68FJ82HV2QZ" marginTop="-65px" %}

The rendered notation will be placed immediately above the Humdrum script 
in the file, so the call to `displayHumdrum()` and the Humdrum script do
not need to be adjacent to each other.  Here is the resulting display
for the above plugin code:

<div id="example-container" style="height:106.4px;"></div>
{% include_relative short-example.txt -%}



## Required source parameter ##

The `displayHumdrum()` function is given a list of options to control
generation of the notation.  The `source` parameter is the only
required parameter, and it must be set to the ID of a Humdrum content
script.  Note that each musical example must have a different ID
so that the Humdrum Notation Plugin can tell them apart.

You can view a list of the plugin options further below, or refer to the same list
on the <a target="_blank" href="/options">options page</a>.  Here is an example
of displaying the notation at a smaller size using the `scale` parameter:

<div id="example-small-container" style="height:53.2px;"></div>
{% include_relative short-example-small.txt -%}

<div style="height:20px;"></div>

``` html
{% include_relative short-example-small.txt -%}
```
{% include tryit.html id="G68F5Q42WG9V" marginTop="-65px" %}

In this case the digital score from the previous example is also being
recycled using the `source` parameter as the ID of the original data, 
and the `target` parameter is the ID of the Humdrum script element into which
the source data will be duplicated.

## Complete webpage example ##


Try copy-and-pasting the following HTML content into a file and view it in a
web browser (typically by double-clicking on the newly created file):


``` html
{% include_relative example2.html -%}
```
{% include tryit.html id="G67CR2SIWSCG" marginTop="-65px" %}


# Multiple examples #


More than one musical example can be placed on a page by giving
a unique ID name to each Humdrum data script:

``` html
{% include_relative multiple-example.txt -%}
```
{% include tryit.html id="G67GLTD5XMTH" marginTop="-65px" %}

The above HTML code produces the following two musical examples:

<div style="width:450px; border: 1px solid #dddddd; padding:50px; text-align:left; background-color:#ffffff;">
{% include_relative multiple-example.txt -%}
</div>

<div height="20px"></div>

Note that the javascript scripts can be merged and/or placed independently
from the Humdrum scripts that contain the digital scores:

``` html
{% include_relative multiple-example-merged.txt -%}
```
{% include tryit.html id="G68FBWIZHTCV" marginTop="-65px" %}

And here is a variation of the above example where all notation examples will 
automatically be identified and rendered with a single javascript script (provided
they all use the same options set):

``` html
{% include_relative multiple-example-auto.txt -%}
```
{% include tryit.html id="G68FH1Y4QUG5" marginTop="-65px" %}

<br/>

# URL content #


Humdrum data can be downloaded from the server that hosts the webpage
or from another website that disables the <a target="_blank"
href="https://en.wikipedia.org/wiki/Same-origin_policy">same-origin
policy</a> (allowing direct web browser access to a server that is
not directly hosting the webpage).  Here is an example of downloading
a Humdrum score from the same server as the webpage.  This is done
by adding a `url` parameter pointing to the online data file as
input to the `displayHumdrum()` function:

``` html
{% include_relative url-example.txt -%}
```

Notice that the Humdrum script element is empty since it will
be filled in later with the downloaded Humdrum data.  Do not add
any content to the Humdrum script when using the `url` parameter;
otherwise, the URL content download will be suppressed.  The Humdrum
script's location on the page will control the display location of
the final notation, and any initial contents of the data script will be
ignored if a `url` parameter is given to the `displayHumdrum()`
function.  In this case the URL is relative to the current page,
so the full URL address of the downloaded data is <a target="_blank"
href="sonata06-3a.txt">https://plugin.humdrum.org/sonata06-3a.txt</a>.
Also notice that the parameter `header` is set to true.  This causes title
and composer information to be added above the first system of music.

{% include_relative url-example.txt -%}

Here is an example of downloading data for the first variation of the
same sonata movement using a URL pointing to a file on Github 
from the <a target="_blank"
href="https://github.com/craigsapp/mozart-piano-sonatas">Mozart
piano sonata repository</a> (also available on <a target="blank"
href="http://verovio.humdrum.org/?k=e&file=beethoven/sonatas">VHV</a>):

``` html
{% include_relative url-example2.txt -%}
```
{% include tryit.html id="G68FZRJ7V8CD" marginTop="-65px" %}

{% include_relative url-example2.txt -%}


There are also [URI](/options/uri) shortcuts for various Humdrum repositories
on the web.  Here is the same score as above, but downloaded with the `github://`
URI to simplify the address to the data:

``` html
{% include_relative uri-example.txt -%}
```
{% include tryit.html id="G68G20YS2BCS" marginTop="-65px" %}

{% include_relative uri-example.txt -%}

The URI

```
github://craigsapp/mozart-piano-sonatas/kern/sonata06-3b.krn
```

will be mapped internally by the Humdrum Notation Plugin into the URL:

```
https://raw.githubusercontent.com/craigsapp/mozart-piano-sonatas/master/kern/sonata06-3b.krn
```


# Options #


Below is a list of options that can be given to `displayHumdrum()`.  You can also
view this list on the <a href="/options">Options page</a>, which provides links to
additional documentation and examples for the options.

{% include options.md %}


# Filters #


<a target="_blank" href="https://doc.verovio.humdrum.org/filters/index.html">Verovio
Humdrum Viewer filters</a> can be included within the Humdrum data
to manipulate the final notation display.  Here is an example of
using the <a target="_blank"
href="http://doc.verovio.humdrum.org/filters/transpose">transpose</a> tool to 
transpose music in C major to E-flat major:

``` html
{% include_relative transpose-example.txt -%}
```
{% include tryit.html id="G68G20YS2BCS" marginTop="-65px" %}

Notice that the Humdrum encoding is in C major, but the filter
command transposes the music to E-flat major
before the music notation is generated:

{% include_relative transpose-example.txt -%}

Another useful filtering tool given
in this example is the <a target="_blank"
href="http://doc.verovio.humdrum.org/filters/autobeam">autobeam</a> tool,
which beamed the eighth notes together by quarter-note durations based on
the key signature.  In this case the tools are used on separate filter
lines, but they can be merged onto the same line like this:

```
!!!filter: transpose -k e- | autobeam
```

Other interesting filtering tools include 
<a target="_blank" href="http://doc.verovio.humdrum.org/filters/maynk">myank</a> for
extracting a measure range from a longer score, and
<a target="_blank" href="http://doc.verovio.humdrum.org/filters/extract">extract</a>
for extracting parts or removing lyrics from the rendered musical notation.


## Filter option ##

One or more filter commands can be specified in the
plugin input options.  Here is an example that downloads
Obrecht's motet *Salve crux* from the <a target="_blank"
href="https://github.com/josquin-research-project/jrp-scores">Josquin
Research Project score repository</a>, and then does a dissonance analysis
of the musical data, followed by extracting measures 1&ndash;18
from the full score, and then extracting only the bass part to display:


``` html
{% include_relative obrecht.txt -%}
```
{% include tryit.html id="G68G7S27GW3R" marginTop="-65px" %}

The digital score downloaded from the `url` parameter does not contain any
filtering instructions, but by adding the option:

``` javascript
filter: "dissonant --colorize | myank -m 1-18 | extract -k 1"
```

the music will be processed by this filter before notation is generated:

{% include_relative obrecht.txt -%}

Colored notes form a dissonance with other voices in the polyphonic
texture (blue means a seventh against another note, green is a second
against another note, and red means the note forms a forth with the
lowest sounding note). The dissonant notes are labeled according to
their function: `p` is a falling passing tone, `g` is a suspension agent (initiates
a suspension, but is considered the consonant note of the suspension), and `v`
is a descending accented passing tone.  For more information, see 
<a target="_blank" href="http://doc.verovio.humdrum.org/filters/dissonant">documentation for the dissonant tool</a>.

The `filter` option can also be set to an array of filters, which will be applied in the same sequence.  The 
above pipe-lined filter can be equivalently expressed as:

``` javascript
filter: [
      "dissonant --colorize",
      "myank -m 1-18",
      "extract -k 1"
   ]
```
{% include tryit.html id="G68G9ICOCPQF" marginTop="-65px" %}

First the music will be analyzed by the dissonant tool, then the first 18
measures will be excerpted from the score, then the first kern spine (for
the bass part) will be extracted along with its secondary analysis spines.

# TODO #

* Allow for shift-click in SVG image to toggle display of Humdrum text.
* Allow Humdrum text to be shown above/below/left/right of the musical example.
* Make examples interactive (typing Humdrum text will update notation).
* Implement optional paged view for longer examples.
* Implement optional MIDI playback of examples.



{% comment %}
	The following data is used to print some music in the header of this page.
	The include file _includes/music-banner.html reads this data and creates
	the notation in the header.  If there is a !!!title: record in the
	Humdrum data below, then it will be placed above the musical example.
{% endcomment %}

<script>
	window.addEventListener("DOMContentLoaded", function() {
		var element = document.querySelector("#title");
		if (!element) {
			return;
		}
		element.style.display = "block";
		element.innerHTML = "J.S. Bach: Cello suite no. 5 in C minor, BWV 1011, Sarabande"
	});
</script>

<div style="display:none" id="title-notation-source">
!!!title: <a target="_blank" title="Pablo Casals playing the sarabande" href='https://www.youtube.com/watch?v=XEN-Xhx8aDA'>J.S. Bach: Cello suite no. 5 in C minor, BWV 1011, Sarabande</a>
{% include banner-scores/bach-sarabande.krn %}
</div>
