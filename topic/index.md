---
vim:	ts=3
---

{% include default-header.html %}

<style>
nav {
	padding-top: 100px;

}
.tag-h1,
.tag-h2 {
	display: none;
}
</style>

# Additional topics #


{% include list-of-topics.txt %}



{% comment %}
	The following data is used to print some music in the header of this page.
	The include file _includes/music-banner.html reads this data and creates
	the notation in the header.  If there is a !!!title: record in the
	Humdrum data below, then it will be placed above the musical example.
{% endcomment %}

<div style="display:none" id="title-notation-source">
!!!title: <a target="_blank" title="Piano roll animation of the canzona" href='https://www.youtube.com/watch?v=rquKBEjHSA4'>Frescobaldi: 36. Canzon Seconda. Canto Alto Tenore Bass, Sopra Romanesca</a>
{% include banner-scores/frescobaldi-canzoni36.krn %}
</div>

