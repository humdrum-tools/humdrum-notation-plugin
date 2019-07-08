---
vim:	ts=3
---

# Wikimedia humdrum tag extension #

Here is an implementation of a humdrum tag extension for Wikimedia:

<div class="scrolling"></div>
``` php
{% include_relative Humdrum.php %}
```

# Installation #

If you have a wiki that uses <a target="_blank"
href="https://www.mediawiki.org/wiki/MediaWiki">MediaWiki</a>, then here
are instructions for allowing use of the `<humdrum>` tag to generate music
notation on wiki pages:

(1) Place this line in the `LocalSettings.php` file that is located in the
base directory of the wiki's website (wherever that is installed on your
web server):


```php
  require_once "$IP/extensions/Humdrum/Humdrum.php";
```

(2) Place the above <a target="_blank" href="Humdrum.php">PHP script</a>
into a file called `extensions/Humdrum/Humdrum.php` in relation to the
base directory of your wiki website.


# Example #

Once the tag extension is installed on your wiki, you can type some text like this onto a wiki page:


```html
<humdrum>
{% include_relative twinkle.txt -%}
</humdrum>
```

which will produce the SVG image:

{% include_relative twinkle-example.txt %}


The tag extension uses the Humdrum notation plugin.  Attributes of the `<humdrum>` tag are mapped
to `displayHumdrum()` input parameters:

```html
<humdrum filter="transpose -k d" scale="55" spacingNonLinear="0.7">
[humdrum data goes here]
</humdrum>
```

is equivalent to

```html
{% include_relative twinkle-example2.txt -%}
```

which produces the SVG image:

{% include_relative twinkle-example2.txt %}

See <a target="_blank" href="http://wiki.ccarh.org/wiki/Humdrum_wiki_extension">this wiki page</a>
for some demonstrations of the tag extension.

<script>
document.addEventListener("DOMContentLoaded", function() {
	var list = document.querySelectorAll("div.scrolling");
	for (var i=0; i<list.length; i++) {
		var element = list[i].nextElementSibling;
		if (element) {
			list[i].innerHTML = element.outerHTML;
			element.style.display = "none";
		}
	}
});
</script>


{% comment %}
	The following data is used to print some music in the header of this page.
	The include file _includes/music-banner.html reads this data and creates
	the notation in the header.  If there is a !!!title: record in the
	Humdrum data below, then it will be placed above the musical example.
{% endcomment %}

<div style="display:none" id="title-notation-source">
!!!title: Haydn: String quartet in E major, op. 17/1 (H III:25), mvmt. 4: Finale: Presto, automatic piano reduction
{% include banner-scores/haydn-op17n1-04.krn %}
</div>
