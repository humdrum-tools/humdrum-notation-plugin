---
vim:	ts=3
---

{% include style.html %}
{% include music-banner.html %}
{% include plugin-setup.html %}

# Introduction #

This website hosts a javascript plugin that allows you to display Humdrum
data as graphical musical notation on any webpage.  Multiple examples
can be shown on the same page and editing the Humdrum data on the page
will dynamically update the corresponding music notation.  In addition,
the Humdrum data can be hidden, showing only the graphical music notation.


# Setup #

To use the Humdrum plugin on a webpage, add the following lines of HTML code 
at the top of the page (in the `<head>` section):

```html
<script src="https://verovio-script.humdrum.org/scripts/verovio-toolkit.js"></script>
<script src="https://plugin.humdrum.org/scripts/humdrum-plugin.js"></script>
```

The first line loads the <a href="http://www.verovio.org">verovio
toolkit</a> that is used to convert a Humdrum score into an SVG image
of the music notation, and the second line loads the plugin itself.
If you want to guarantee a stable setup, then copy these two javascript
files into your website (and update periodically as needed with the
latest version of verovio and/or the plugin).

Then add the following script after the above two lines if the 
verovio toolkit is not already initialized somewhere else on your webpage:

```html
<script>
   var vrvToolkit = new verovio.toolkit();
</script>
```


# Adding a musical example to a webpage #

Creating a musical example on a website consists of two components: (1) a 
javascript function call to `displayHumdrum()` with a list if display options,
such as:

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
**kern
*M4/4
=1-
4c
8dL
8eJ
4f
4g
=
*-
</script>
```

For the input to `displayHumdrum()`, the `source` parameter is required,
and it must be set to the id of the Humdrum content script.  In this case the
value is `example` since the `id` of the humdrum data is `example`.

The `renderer` parameter specifies the variable name of the verovio toolkit.  This parameter can be omitted if its variable name is `vrvToolkit`.  So a
minimal example would be:

```html
<script>
   displayHumdrum({source: "example"});
</script>
<script type="text/x-humdrum" id="example">
**kern
*M4/4
=1-
4c
8dL
8eJ
4f
4g
=
*-
</script>
```


Here is the resulting example for the above plugin code:


<script>
displayHumdrum({
	source:   "example",
	renderer: vrvToolkit
});
</script>
<script type="text/x-humdrum" id="example">
**kern
*M4/4
=1-
4c
8dL
8eJ
4f
4g
=
*-
</script>


# Complete example #

Try copy-and-pasting the following HTML content into a file and view it in a
web browser:


```html
<html>
<head>
<title>My musical example</title>
<script src="https://verovio-script.humdrum.org/scripts/verovio-toolkit.js"></script>
<script src="https://plugin.humdrum.org/scripts/humdrum-plugin.js"></script>
<script>
   var vrvToolkit = new verovio.toolkit();
</script>
</head>
<body>

A musical example:

<script>
   displayHumdrum({source: "example"});
</script>
<script type="text/x-humdrum" id="cue1">
**kern
*M4/4
=1-
4c
8dL
8eJ
4f
4g
=
*-
</script>
</body>
</html>
```


The browser display should look something like:


<img src="/images/example.png">


# Multiple examples on a webpage #

More than one musical example can be placed on a page by giving
a unique id name to each Humdrum data script:

```html
<script>
   displayHumdrum({source: "example1"});
   displayHumdrum({source: "example2"});
</script>

Falling melody:
<script type="text/x-humdrum" id="example2">
**kern
*M4/4
=1-
4g
8fL
8eJ
4d
4c
=
*-
</script>

Rising melody:
<script type="text/x-humdrum" id="example1">
**kern
*M4/4
=1-
4c
8dL
8eJ
4f
4g
=
*-
</script>
```

The above HTML code produces the following two musical examples:

<table>
<tr>
<td style="width:600px; padding:50px; text-align:left; background-color:#ffffff;">

<script>
   displayHumdrum({source: "example1"});
   displayHumdrum({source: "example2"});
</script>

Falling melody:
<script type="text/x-humdrum" id="example2">
**kern
*M4/4
=1-
4g
8fL
8eJ
4d
4c
=
*-
</script>

Rising melody:
<script type="text/x-humdrum" id="example1">
**kern
*M4/4
=1-
4c
8dL
8eJ
4f
4g
=
*-
</script>


</td>
</tr>
</table>

Notice that the placement of the music notation depends on the location
of the Humdrum data script in the page (`example2` is placed above
`example1` in this case).

Also note that the script that generates the musical examples can be placed
anywhere on the webpage, and the individual calls to `displayHumdrum()` can
be split into separate scripts, such as in the following example where they
are adjacent to the humdrum data, which allows easier editing of styling
options for each example:

```html
Falling melody:
<script>
   displayHumdrum({source: "example2"});
</script>
<script type="text/x-humdrum" id="example2">
**kern
*M4/4
=1-
4g
8fL
8eJ
4d
4c
=
*-
</script>

Rising melody:
<script>
   displayHumdrum({source: "example1"});
</script>
<script type="text/x-humdrum" id="example1">
**kern
*M4/4
=1-
4c
8dL
8eJ
4f
4g
=
*-
</script>
```


# Options #

This section will describe how to set verovio display options, and how
to show/hide Humdrum text as well as position is above/below/left/right
of the music notation.


# Filters #

<a href="https://doc.verovio.humdrum.org/filters/index.html">Verovio Humdrum Viewer filters</a> can be included with the Humdrum data to manipulate the final
notation display.  Here is an example of using the 
<a href="http://doc.verovio.humdrum.org/filters/transpose">transpose</a> tool:

```html
<script>
   displayHumdrum({source: "transpose"});
</script>
<script type="text/x-humdrum" id="transpose">
**kern
*M4/4
*k[]
*C:
=1-
4c
8dL
8eJ
4f
4g
=
*-
!!!filter: transpose -k e-
</script>
```

<script>
   displayHumdrum({source: "transpose"});
</script>
<script type="text/x-humdrum" id="transpose">
**kern
*M4/4
*k[]
*C:
=1-
4c
8dL
8eJ
4f
4g
=
*-
!!!filter: transpose -k e-
</script>


Other interesting filtering tools include 
<a href="http://doc.verovio.humdrum.org/filters/maynk">myank</a> for
extracting a range of measures from a longer example, and
<a href="http://doc.verovio.humdrum.org/filters/extract">extract</a>
for extracting parts or removing lyrics from the rendered musical notation.


# TODO #

* Make examples interactive
* Set default style to hide Humdrum text
* Allow for shift-click in SVG image to toggle display of Humdrum text
* Allow humdrum text to be shown above/below/left/right of the musical example.
* Allow for auto and manual tab widths
* Add newline fix from VHV documentation jekyll plugin.



