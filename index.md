---
vim:	ts=3
---

{% include default-header.html %}



# Introduction #


This website documents a javascript plugin that allows you to display,
on any webpage, graphical musical notation generated from
<a target="_blank" href="https://www.humdrum.org">Humdrum</a>
data embedded within the page.  Here is an example usage of the plugin
to display all ten measures of J.N.&nbsp;Hummel's prelude in D-flat major,
op.&nbsp;67/15:

{% include hummel-interaction.html %}
{% include_relative hummel-example.txt %}

The above music notation was created dynamically inside your
web browser as the page was loaded, using <a target="_blank"
href="hummel-prelude-op67n15.txt">this Humdrum score</a> stored as 
<a target="_blank" href="hummel-example-b.txt">text</a>
inside the webpage.  The notation is displayed in an SVG image, which
allows interaction with notational elements.  For example the
prelude has been made interactive by adding CSS and javascript code: try
moving your mouse pointer over a note in the music, which will highlight
other notes in the score possessing the same pitch class.

Using the same data within the page, different views of the score can be
produced.  Here is an example of extracting the first three measures of
the prelude and transposing to C major:

{% include_relative hummel-example2.txt %}

This example applies the filter `myank -m 1-3 | transpose -k
c` to the full score, generating a transposed excerpt.
See the <a href="#filters">Filter section</a> of this
documentation for more information, or the <a target="_blank"
href="https://doc.verovio.humdrum.org/filters/index.html">filter documentation</a> for
<a target="_blank" href="http://verovio.humdrum.org">Verovio Humdrum
Viewer</a>, which is an online interactive music editor where you can
prepare scores for use with the Humdrum notation plugin.

Feature requests and bug-reports can be submitted to the 
<a target="_blank" href="https://github.com/humdrum-tools/humdrum-plugin/issues">issues page</a> of the humdrum-plugin repository on Github.

# Setup #


To use the Humdrum notation plugin on a webpage, copy the following 
lines of text into your webpage:

```html
<script src="{{site.veroviourl}}"></script>
<script src="{{site.notationurl}}"></script>
<script>var vrvToolkit = new verovio.toolkit()</script>
```

The first line loads the <a target="_blank"
href="http://www.verovio.org">verovio toolkit</a>, which is used to convert
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

Note that colorization of the Humdrum data in the above box is random
since the highlighter thinks that the example is HTML code.  Here is
the resulting display for the above plugin code:

{% include_relative short-example.txt %}



## Required source parameter ##

As input to the `displayHumdrum()` function, the `source` parameter is
required, and it must be set to the ID of the Humdrum content script.
In this case the value is "example" since the ID of the Humdrum data script
is "example".  Placement of the music notation for the example will be
dependent on the location of the source element that contains the Humdrum
data (the notation will be placed immediately before the source element).



## Default renderer parameter ##

The optional `renderer` parameter specifies the variable name of the verovio
toolkit.  This parameter can be omitted if its Javascript variable name is
`vrvToolkit`.  So a minimal example using the standard header setup
described above would be:

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
online).  After opening the webpage in a browser, it should look
something like:

<img style="border: 1px solid #999999; border-radius: 3px; box-shadow: 10px 10px 5px #cccccc;" src="/images/example.png">



# Multiple examples #


More than one musical example can be placed on a page by giving
a unique ID name to each Humdrum data script:

```html
{% include_relative multiple-example.txt %}
```

The above HTML code produces the following two musical examples:

<div style="width:450px; border: 1px solid #dddddd; padding:50px; text-align:left; background-color:#ffffff;">
{% include_relative multiple-example.txt %}
</div>

<br/>

# URL content #


Humdrum data can be downloaded from the server that hosts the
webpage or from another website that disables the <a target="_blank"
href="https://en.wikipedia.org/wiki/Same-origin_policy">same-origin
policy</a> (allowing direct web browser access to a server that is not
directly hosting the webpage).


Here is an example of downloading a Humdrum score from the same server
as the webpage.  This is done by adding a `url` parameter pointing 
to the online data file as input to the `displayHumdrum()` function:

```html
{% include_relative url-example.txt %}
```

Notice that the Humdrum script element is empty, since it will
be filled in later with the downloaded Humdrum data.  Do not add
any content to the Humdrum script when using the `url` parameter;
otheriwse, the URL content download will be suppressed.  The Humdrum
script's location on the page will control the display location of
the final notation, and any initial contents of the script will be
ignored if a `url` parameter is given to the `displayHumdrum()`
function.  In this case the URL is relative to the current page,
so the full URL address of the downloaded data is <a target="_blank"
href="sonata06-3a.txt">https://plugin.humdrum.org/sonata06-3a.txt</a>.
Also notice that the parameter `header` is set to true.  This causes title
and composer information to be added above the first system of music.

{% include_relative url-example.txt %}

Here is an example of downloading data for the first variation of the
same sonata movement using a URL pointing to a file on Github 
from the <a target="_blank"
href="https://github.com/craigsapp/mozart-piano-sonatas">Mozart
piano sonata repository</a>:

```html
{% include_relative url-example2.txt %}
```

{% include_relative url-example2.txt %}



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

```html
{% include_relative transpose-example.txt %}
```

Notice that the Humdrum encoding is in C major, but the filter
command at the end of the data transposes the music to E-flat major
before the music notation is generated:

{% include_relative transpose-example.txt %}

Another useful filtering tool used
in this example is the <a target="_blank"
href="http://doc.verovio.humdrum.org/filters/autobeam">autobeam</a> tool,
which connected eighth notes together by quarter-note durations based on
the key signature.  In this case the tools are used in separate filter
lines, but they can be given on the same line like this:

```
!!!filter: transpose -k e- | autobeam
```

Other interesting filtering tools include 
<a target="_blank" href="http://doc.verovio.humdrum.org/filters/maynk">myank</a> for
extracting a range of measures from a longer example, and
<a target="_blank" href="http://doc.verovio.humdrum.org/filters/extract">extract</a>
for extracting parts or removing lyrics from the rendered musical notation.


## Filter option ##

One or more filter commands can be specified in the
plugin input options.  Here is an example that downloads
Obrecht's motet *Salve crux* from the <a target="_blank"
href="https://github.com/josquin-research-project/jrp-scores">Josquin
Research Project score repository</a>, and then a dissonance analysis
of the musical data is done, followed by extracting measures 1&ndash;18
from the full score, and then extracting only the bass part to display:


```html
{% include_relative obrecht.txt %}
```

The digital score downloaded from the `url` parameter does not contain any
filtering instructions, but by adding the option:

```javascript
filter: "dissonant --colorize | myank -m 1-18 | extract -k 1"
```

the music will be processed by this filter before notation is generated from 
the Humdrum data:

{% include_relative obrecht.txt %}

Colored notes form a dissonance with other voices in the polyphonic
texture (blue means a seventh against another note, green is a second
against another note, and red means the note forms forth with the
lowest sounding note). The dissonant notes are labeled according to
their function: `p` is a falling passing tone, `g` is a suspension agent (initiates
a suspension, but is considered the consonant note of the suspension), and `v`
is a descending accented passing tone.  For more information, see 
<a target="_blank" href="http://doc.verovio.humdrum.org/filters/dissonant">documentation for the dissonant tool</a>.



# Additional topics #

Here are a list of topics that give more examples or elaborate on the main documention
on this page.

{% include topic-list.txt %}


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

<div style="display:none" id="title-notation-source">
!!!title: <a target="_blank" title="Pablo Casals playing the sarabande" href='https://www.youtube.com/watch?v=XEN-Xhx8aDA'>J.S. Bach: Cello suite no. 5 in C minor, BWV 1011, Sarabande</a>
{% include banner-scores/bach-sarabande.krn %}
</div>
