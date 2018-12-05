---
vim:	ts=3
---

{% include default-header.html %}



# Introduction #


This website documents a javascript plugin that allows you to display
graphical musical notation on any webpage. The notation is generated from
embedded <a target="_blank" href="https://www.humdrum.org">Humdrum</a>
data stored within the webpage.  Here is an example usage of the plugin
to display all ten measures J.N.&nbsp;Hummel's prelude in D-flat major,
op.&nbsp;67/15:

{% include_relative hummel-example.txt %}

The above music notation was generated dynamically inside of your
web browser as the page was loaded, using a <a target="_blank"
href="hummel-prelude-op67n15.txt">digital score</a> stored inside the
webpage.  Multiple notation examples can be shown on the same page,
and music data can also be loaded from outside of the webpage.



# Setup #


To use the Humdrum notation plugin on a webpage, copy the following 
lines of text into your webpage:

```html
<script src="https://verovio-script.humdrum.org/scripts/verovio-toolkit.js"></script>
<script src="https://plugin.humdrum.org/scripts/humdrum-plugin.js"></script>
<script>var vrvToolkit = new verovio.toolkit()</script>
```

The first line loads the <a target="_blank"
href="http://www.verovio.org">verovio toolkit</a> that is used to convert
a Humdrum score into an SVG image, and the second line loads the plugin
itself.  If you want to guarantee a stable setup, then copy these two
javascript files into your website (and update periodically as needed
with the latest version of verovio and/or the plugin).  The last 
line of the setup code is a short javascript program that initializes
the verovio toolkit on the webpage so that it can be used by the
Humdrum notation plugin.


# Display some music #


Adding a musical example on a webpage consists of two components:
(1) a javascript function call to `displayHumdrum()` with a list
of display options, such as:

```html
<script>
displayHumdrum({
	source:   "example",
	renderer: vrvToolkit
});
</script>
```

and (2) a corresponding Humdrum data script on the page, such as:

```html
<script type="text/x-humdrum" id="example">
{% include_relative example.krn -%}
</script>
```

Here is the resulting display for the above plugin code:

{% include_relative short-example.txt %}


## Required source parameter ##

For the input to `displayHumdrum()`, the `source` parameter is required,
and it must be set to the id of the Humdrum content script.  In this case
the value is `example` since the `id` of the humdrum data is `example`.

## Default render parameter ##

The `renderer` parameter specifies the variable name of the verovio
toolkit.  This parameter can be omitted if its variable name is
`vrvToolkit`.  So a minimal example using the standard setup described
above would be:

```html
{% include_relative short-example.txt -%}
```



# Complete example page #


Try copy-and-pasting the following HTML content into a file and view it in a
web browser:


```html
{% include_relative example2.html -%}
```


(or <a target="_blank" href="example.html"> click here</a> to view it
online).  Notice that the function call `displayHumdrum()` can be moved
into the same script as the one that initializes the verovio toolkit.
After opening the webpage in a browser, it should look something like:

<img style="border: 1px solid #999999; border-radius: 3px; box-shadow: 10px 10px 5px #cccccc;" src="/images/example.png">



# Multiple examples #


More than one musical example can be placed on a page by giving
a unique id name to each Humdrum data script:

```html
{% include_relative multiple-example.txt %}
```

The above HTML code produces the following two musical examples:

<div style="width:450px; border: 1px solid #dddddd; padding:50px; text-align:left; background-color:#ffffff;">
{% include_relative multiple-example.txt %}
</div>

<br/>
Notice that the placement of the music notation depends on the location
of the Humdrum data script in the page (`example2` is placed above
`example1` in this case).

Also note that the script that generates the musical examples can be placed
anywhere on the webpage, and the individual calls to `displayHumdrum()` can
be split into separate scripts, such as in the following example where they
are adjacent to the humdrum data, which allows easier editing of styling
options for each example:

```html
{% include_relative multiple-example2.txt %}
```



# URL content #


Humdrum data can be downloaded from the server that hosts the webpage
or from another website that disables the <a target="_blank"
href="https://en.wikipedia.org/wiki/Same-origin_policy">same-orgin
policy</a> by specifying a URL for the Humdrum data in the `url`
parameter given to `displayHumdrum()`:

```html
{% include_relative url-example.txt %}
```

Notice that the Humdrum script element is empty, since it will be
filled in later with the downloaded Humdrum data.  The Humdrum
script's location on the page will control the display location of
the final notation, and any initial contents of the script will be
ignored if a `url` parameter is given to the `displayHumdrum()`
function.  In this case the URL is relative to the current page,
so the full URL address of the downloaded data is <a target="_blank"
href="sonata06-3a.krn">https://plugin.humdrum.org/sonata06-3a.krn</a>.

{% include_relative url-example.txt %}

Here is an example of downloading the same data using a Github URL
from the <a target="_blank"
href="https://github.com/craigsapp/mozart-piano-sonatas">Mozart
piano sonata repository</a>:

```html
{% include_relative url-example2.txt %}
```

{% include_relative url-example2.txt %}



# Options #


This section will describe how to set verovio display options, and how
to show/hide Humdrum text as well as position it above/below/left/right
of the music notation.



# Filters #


<a target="_blank" href="https://doc.verovio.humdrum.org/filters/index.html">Verovio
Humdrum Viewer filters</a> can be included within the Humdrum data
to manipulate the final notation display.  Here is an example of
using the <a target="_blank"
href="http://doc.verovio.humdrum.org/filters/transpose">transpose</a> tool:

```html
{% include_relative transpose-example.txt %}
```

Notice that the Humdrum encoding is in C major, but the filter
command at the end of the data transposes the music to E-flat major
before the music notation is generated:

{% include_relative transpose-example.txt %}

Another useful filtering tool used in this example is the <a target="_blank"
href="http://doc.verovio.humdrum.org/filters/autobeam">autobeam</a> tool, which
was used in this example to beam the eighth notes together by
quarter-note durations.  In this case the tools are used in separate filter lines, 
but they can be given on the same line like this:

```
!!!filter: transpose -k e- | autobeam
```

Other interesting filtering tools include 
<a target="_blank" href="http://doc.verovio.humdrum.org/filters/maynk">myank</a> for
extracting a range of measures from a longer example, and
<a target="_blank" href="http://doc.verovio.humdrum.org/filters/extract">extract</a>
for extracting parts or removing lyrics from the rendered musical notation.


# TODO #

* Make examples interactive
* Allow for shift-click in SVG image to toggle display of Humdrum text
* Allow humdrum text to be shown above/below/left/right of the musical example.
* Allow for auto and manual tab widths in Humdrum text
* Add newline fix from VHV documentation jekyll plugin.




{% comment %}
	The following data is used to print some music in the header of this page.
	The include file _includes/music-banner.html reads this data and create
	the notation in the header.  If there is a !!!title: record in the
	Humdrum data below, then it will be placed above the musical example.
{% endcomment %}

<div style="display:none" id="title-notation-source">
!!!title: <a target="_blank" title="Pablo Casals playing the sarabande" href='https://www.youtube.com/watch?v=XEN-Xhx8aDA'>J.S. Bach cello suite no. 5 in C minor, BWV 1011, Sarabande</a>
{% include_relative bach-sarabande.krn %}
</div>
