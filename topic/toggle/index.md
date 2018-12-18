---
vim:	ts=3
---

{% include default-header.html %}
{% include_relative click-event-delegation.txt %}
{% include_relative prepare-song-list.txt %}

<style>
section {
	min-height: 2000px;
}

</style>

# Toggling music view #

{% include_relative introduction.txt %}



# List of songs #

<div id="song-list"></div>



# Implementation notes #

{% include_relative implementation-notes.txt %}



{% comment %}
	The following data is used to print some music in the header of this page.
	The include file _includes/music-banner.html reads this data and creates
	the notation in the header.  If there is a !!!title: record in the
	Humdrum data below, then it will be placed above the musical example.
{% endcomment %}

<div style="display:none" id="title-notation-source">
!!!title: Learn the Songs of Victory, No. 149 from <i>Teton Sioux Music</i>, Densmore collection
{% include banner-scores/sioux149.krn %}
</div>



