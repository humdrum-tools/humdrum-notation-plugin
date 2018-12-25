---
vim:	ts=3
---

{% include default-header.html %}

<style>
nav {
	position: fixed;
	top: 380px;
}
section {
	margin-top: 0px !important;
}
@media print, screen and (max-width: 1060px) { 
	section {
		margin-top: 0px !important;
	}
}
</style>



# List of options #

{% include options.md %}



# Discussion and Examples #


* <a href="url">URL-related options</a>
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



