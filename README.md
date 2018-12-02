
<script src="https://verovio-script.humdrum.org/scripts/verovio-toolkit.js"></script>
<script src="/scripts/humdrum-plugin.js"></script>
<script>
var vrvToolkit = new verovio.toolkit();
</script>

This repository contains a javascript plugin that can be used to display
music notation on a webpage, created from a Humdrum encoding of the music.
View the <a href="https://plugin.humdrum.org">plugin website</a> for
detailed documentation and examples for how to use the plugin.

Here is a simple example:


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

Which generates a music notation example on <a href="https://plugin.humdrum.org/example.html">this page</a>.

