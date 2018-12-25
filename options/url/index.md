---
vim:	ts=3
---

{% include default-header.html %}

This page describes option parameters related to downloading musical
scores into the webpage rather than embedding digital scores within the
page.



# Downloading data by URL #

Both local and remote external scores can be downloaded.  Here are examples for each case:



## Local URL ##

The `url` parameter can be used to specify an external data source for
a digital score.  The following example loads the file `sonata05-1.krn`
and then converts it into notation on the webpage.

{% include_relative example-local.txt %}

```html
{% include_relative example-local.txt %}
```

The URL is relative to the webpage, so the full address is 
<a target="_blank" href="https://plugin.humdrum.org/options/url/sonata05-1.krn">https://plugin.humdrum.org/options/url/sonata05-1.krn</a>.



## Remote  URL ##

The above example downloads data from the same web server as this webpage.
It is also possible to download data from external web servers, provided
that they permit it.  Here is an example of downloading the same score
from a Github repository:

{% include_relative example-remote.txt %}

```html
{% include_relative example-remote.txt %}
```



# Fallback URL #

The parameter `urlFallback` can be given to `displayHumdrum()` as a backup URL in case there
was a problem downloading musical data using the primary `url` parameter.  This is useful, for example,
if you want to usually download the most up-to-date score in an online repository, but the access
is temporarily down or you are currently offline (with a local installation of the Humdrum notation
plugin).

Here is an example where the `url` parameter is set to a non-existent location, and the `urlFallback` 
parameter is set to a copy of the intended score saved statically on the same web server as this webpage:

{% include_relative backup.txt %}

HTML code for the example:

```html
{% include_relative backup.txt %}
```

The `urlFallback` parameter can be either a relative path to a file on
the same web server, or an absolute path to a file on another web server.



# Fallback data #

If the `url` parameter fails to load data, and the `urlFallback` parameter also fails to load
data, then the Humdrum notation plugin will use any data embedded within the Humdrum text script
on the webpage.


{% include_relative embedded.txt %}

HTML code for the example:

```html
{% include_relative embedded.txt %}
```

The `url` parameter ("https://some-random.comp.uter/data/some-random-file.krn") does not
load successfully.  Then the `urlFallback` parameter is used to check for "some-random-file.krn"
on the local server, but that also fails.  So the Humdrum notation plugin displays the existing
digital score found in the Humdrum text script.



# Error score #


The `emptyScore` option can point to a digital score to display when the intended score cannot be
downloaded via the `url` or `urlFallback` parameters, and there is otherwise no contents in the
Humdrum text script.  The first two examples try to download invalid files, and the third has an
empty Humdrum text script.  All three of them use the score stored in the element having
an ID `empty-score`.


{% include_relative error-score.txt %}


```html
{% include_relative error-score.txt %}
```


{% comment %}
	The following data is used to print some music in the header of this page.
	The include file _includes/music-banner.html reads this data and creates
	the notation in the header.  If there is a !!!title: record in the
	Humdrum data below, then it will be placed above the musical example.
{% endcomment %}

<div style="display:none" id="title-notation-source">
!!!title: Beethoven: Piano sonata no. 5 in C minor, op. 10/1, mvmt. 1
{% include banner-scores/beethoven-sonata05-1.krn %}
</div>



# Default empty score #

If you always want to show an error score if the intended score is not
successfully downloaded, but you do not want to add the `errorScore`
parameter to every call of `displayHumdrum()`, then you can call
`setErrorScore()` with the ID of a Humdrum text script containing the
error score.  Here is a similar example to the previous set, but now
there is an automatically placed error score when the Humdrum text script
is empty.


{% include_relative default-error.txt %}

```html
{% include_relative default-error.txt %}
```




