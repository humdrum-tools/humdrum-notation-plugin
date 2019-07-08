---
vim:	ts=3
---

# Embedded options #

Humdrum notation plugin options can be embedded within Humdrum digital
scores.  This is useful for several types of cases, the main one
being to automate conversion of a Humdrum text scripts. Here are two
notation examples, where both are processed with a for-loop loading each
example into `displayHumdrum()`.



{% include_relative example.txt %}


Options can be embedded into a humdrum file reference record according to this structure:

```
!!!hnp-option: parameter: value
```

where <i>parameter</i> is the name of an option parameter, and
<i>value</i> is the value that the option is set to.  Spaces are
optional before or after colons surrounding the <i>parameter</i> name.
Some Humdrum notation plugin options will be ignored (you get to figure
out which ones, but some of them are <i>source</i>, <i>target<i>,
and <i>url</i>).  Mostly embedded options are intended for typesetting
options, such as <i>spacingStaff</i>, and <i>scale</i>.


```html
{% include_relative example.txt %}
```


{% comment %}
	The following data is used to print some music in the header of this page.
	The include file _includes/music-banner.html reads this data and creates
	the notation in the header.  If there is a !!!title: record in the
	Humdrum data below, then it will be placed above the musical example.
{% endcomment %}

<script type="text/x-humdrum" id="title-notation-source">
!!!title: J.S. Bach: Chorale <i>Herr Christ, der ein'ge Gottes Sohn</i>, BWV 164/6
{% include_relative chor101.krn -%}
!!!filter: satb2gs
!!!hnp-option:spacingLinear:0.35
!!!hnp-option:spacingNonLinear:0.7
</script>
