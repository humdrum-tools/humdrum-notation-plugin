---
vim:	ts=3:ft=liquid
---


# Lyrics-related options #

This page demonstrates plugin options involving lyrics.  The following musical
incipit is used for the examples, and this initial display of the music shows the
default style for the lyrics:

{% include_relative lyricExample.txt %}

{% highlight html tabsize=24 %}
{% include_relative lyricExample.txt -%}
{% endhighlight %}




# lyricSize #

{% include_relative lyricSize-option-documentation.txt %}



# lyricTopMinMargin #

{% include_relative lyricTopMinMargin-option-documentation.txt %}



# Coloring lyrics with CSS #

{% include_relative coloringLyricsWithCss-documentation.txt %}



# Coloring lyrics within Humdrum #

{% include_relative coloringLyricsWithinHumdrum-documentation.txt %}




{% comment %}
	The following data is used to print some music in the header of this page.
	The include file _includes/music-banner.html reads this data and creates
	the notation in the header.  If there is a !!!title: record in the
	Humdrum data below, then it will be placed above the musical example.
{% endcomment %}

<div style="display:none" id="title-notation-source">
!!!title: <a target="_blank" title="A Collection of Twenty Four Songs By English Composers of the 17th and 18th Centuries: From Lawes to Linley, Edited by G.E.P. Arkwright, Parker and Son, 27 Broad-street, Oxford; 1908, pp. 26-27" href='http://conquest.imslp.info/files/imglnks/usimg/c/cc/IMSLP281045-SIBLEY1802.19522.78d6-39087011123033score.pdf#page=38'>Purcell/Heveningham: If music be the food of love</a>
{% include banner-scores/purcell-if_music_be_the_food_of_love.krn -%}
</div>



