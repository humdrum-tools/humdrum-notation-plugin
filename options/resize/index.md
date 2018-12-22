---
vim:	ts=3:ft=liquid
---

{% include default-header.html %}

<style>
section {
	min-height: 1000px;
}
</style>


# Resizing music notation #

Automatic resizing of a musical example can be done with the Humdrum
notation plugin by setting the `autoResize` option to true.

This page demonstrates how to automatically resize music notation
when the web browse changes size, as well as how to automatically
resize music notation inside of a `<div>` element (or similar) within
a webpage. Resizing in this context means to change the width of the
music while keeping the same zoom scale. In other words, the music is
re-typeset whenever the width of its HTML container changes.



# Resizing music in a div #

The following example music can be resized according to the width red box
that contains it.  Try resizing the red box by dragging the bottom right
corner of the box.  You can even drag the box out into the right margin
of the page beyond the text.  When the music cannot be fully displayed
inside of the box, the contents of the box will become scrollable.

{% include_relative resize-example.txt %}

<p style="margin-top:20px;"> 
The above example was generated with this HTML code:
</p>

```html
{% include_relative resize-example.txt -%}
```


# Resizing incipits #

Incipits are short excerpts from the start of a work or movement.  Use the
`incipit: true` option to display only the first system of the music
contained in the example.  Then to resize the incipit, also add the
`autoResize: true` option as demonstrated in the following example.
Try dragging the right bottom corner of the red box to the left and
right to resize the incipit:


{% include_relative resize-example2.txt %}


<p style="margin-top:20px;"> 
Here is the HTML code that created the above example:
</p>

```html
{% include_relative resize-example2.txt -%}
```

# Full-page resizing #

This webpage limits the text and music notation to a region smaller than
the full width of the web-browser window. Click on <a target="_blank"
href="full-page-example.html">this link</a> to view a full-page resizing
example, using the first movement of Beethoven's <i>Moonlight</i> sonata.
The music will be resized to the full width of the window and overflow
of the music off the bottom of the page will be scrollable.

Here is an example of the music when the browser is wide:

<a target="_blank" href="moonlight-wide.png"><img class="figure" src="moonlight-wide.png"></a>

And here is an example of the music when the browser is narrow:

<a target="_blank" href="moonlight-narrow.png"><img style="width:50%" class="figure" src="moonlight-narrow.png"></a>

You can also rescale the page (typically with the command or control key in
combination with the plus/minus keys).  Here is an example of zooming
out to view the full <i>Moonlight</i> sonata first movement in the
web browser:

<a target="_blank" href="moonlight-all.png"><img style="width:100%" class="figure" src="moonlight-all.png"></a>

You can click on any of the above images to view them in more detail.


The HTML code of the example webpage is:

```html
{% include_relative full-page-example.txt -%}
```

Try copy-and-pasting this source code into an HTML page and view it on your
local browser (usually by double-clicking on the file in the Desktop).


# Resizing on your own #

Instead of using `autoResize: true`, you can alternatively control
the re-drawing of the music notation yourself rather than letting
the plugin manage the redrawing.  For example, the music notation
in the yellow banner at the top of the page is resized in this
manner.

ggg 
{% include_relative manual-example.txt %}
hhh



{% comment %}
	The following data is used to print some music in the header of this page.
	The include file _includes/music-banner.html reads this data and creates
	the notation in the header.  If there is a !!!title: record in the
	Humdrum data below, then it will be placed above the musical example.
{% endcomment %}


<div style="display:none" id="title-notation-source">
!!!title: Mozart: Piano sonata no. 11 in A major, K331/K<sup>6</sup>300i, mvmt. 2: Menuetto and Trio
{% include banner-scores/sonata11-2.krn -%}
</div>



