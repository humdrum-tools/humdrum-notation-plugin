---
vim:	ts=3
---

{% include default-header.html %}


# Coloring with RDF marks #

RDF markers can be used to color notes in a score.  In the following example, the line

```
!!!RDF**kern: @ = marked note
```

Defined the user-signifier in `**kern` data to mean a marked note.  These marked notes will
automatically be rendered in red when converting into notation.

```html
{% include_relative rdf1.txt %}
```
{% include_relative rdf1.txt %}


The color of the mark can be changed by adding a color parameter to the RDF line:

```html
{% include_relative rdf2.txt %}
```
{% include_relative rdf2.txt %}


And multiple colors can be used on different notes by defining multiple markers:

```html
{% include_relative rdf3.txt %}
```
{% include_relative rdf3.txt %}

Note that any CSS/SVG color can be used, either a named color or a numeric one.  However, 
make sure to avoid spaces in the color name (such as the `rgba` color in the above example).

# Color interpretations #

Notes can be colored within a spine by using a `*color` tandem interpretation.  All notes
in a spine after a color interpretation will be colored until a new color is given (or 
the color "black" is used to stop coloring the notes).

```html
{% include_relative interpretation.txt %}
```
{% include_relative interpretation.txt %}




# Coloring by \*\*color spine #

A `**color` spine can be added to a score to display to color all notes starting at the
current line until another color is given (using "black" is equivalent to turning off
the color).  You can scroll in this example to see the changes in color at measures
7, 12, 16, and 24.  Green means G major, red is D major, and yellow is C major.

<div class="scrolling">
{% highlight html %}
{% include_relative chopin-color.txt %}
{% endhighlight html %}
{% include_relative chopin-color.txt %}
</div>

If there is a color spine anywhere to the right of of a kern spine, it will be
used to color the notes found in that kern spine.  If you want to color notes
in different kern spines independently, place a color spine to the right of 
each kern spine.  This can also be done to only color a single spine's notes.


# Coloring by msearch filter #

The msearch filter is a basic music searching tool that can be used to
highlight notes.  The following example shows two separate searches.
The first search for the pitch sequence "C D E G" uses the default color
of red, and uses `@` as an RDF marker behind-the-scenes.  The second search
uses a different marker (`N`) and a different color to search for the 
melodic sequence "A G A B".


```html
{% include_relative msearch.txt %}
```
{% include_relative msearch.txt %}





{% comment %}
	The following data is used to print some music in the header of this page.
	The include file _includes/music-banner.html reads this data and creates
	the notation in the header.  If there is a !!!title: record in the
	Humdrum data below, then it will be placed above the musical example.
{% endcomment %}

<div style="display:none" id="title-notation-source">
!!!title: Chopin: Prelude in G major, op. 28, no. 3 with notes colored according to prevailing key.
{% include_relative chopin-prelude28-3.krn %}
</div>
