

| option name     | default&nbsp;value&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | description 
|-----------------|:-------------:|------------
| `appendText `   |               | Append the given text line(s) at the end of the Humdrum data before it is rendered.  This is typically used to add reference records for printing the title information.
| `autoResize `   | false         | Re-typeset the music whenever the browser window is resized. See [this page](/options/resize) for examples.
| `filter `       |               | A <a target="_blank" href="https://doc.verovio.humdrum.org/filters">filter command</a> which will be run on the Humdrum data before it is sent to the renderer to generate graphical music notation.
| `header`        | false         | When set to "true", display embedded title, composer, lyricist information in musical notation.
| `incipit`       | false         | When set to "true", only the first system of the music notation will be displayed. 
| `postFunction`  |               | The name of a function to run after notation has been rendered to an SVG image.
| `source`        |               | A required ID for an element that stored the Humdrum data to generate notation from.  The location of this element on the page will determine the position of the generated notation.  If the data is downloaded via a URL, then this is the ID of the element where the downloaded data will be stored.
| `suppressSvg`   | false         | Setup the container for an SVG image, but do not actually create one.  This option is useful for pre-loading Humdrum data onto the page for later rendering. ([see example usage](/topic/toggle))
| `target`        |               | An optional ID for the target container (useful for sharing a source with multiple notation displays).
| `uri`           |               | A predefined URI shortcut for Humdrum data located on the web. ([example](/options/uri))
| `url`           |               | The URL from which to download data can be given with this parameter.  By default musical data is stored extracted from the page, but this parameter allowed it to be downloaded from a separate file on the web server, or in certain cases, downloaded from other web servers such as Github. ([see url documentation](/options/url))
| `urlFallback`   |               | An alternate URL if data downloading with the `url` parameter fails.  This allows downloading data from a mirror site if the primary one is down or inaccessible for some reason. ([see url documentation](/options/url))

Numeric options:

| option name        | default&nbsp;&nbsp;&nbsp;       | min       | max       | description 
|--------------------|---------------|-----------|-----------|-------------
| `pageWidth`        | *none*        | 100       | 60000     | Width of the music notation.  By default, the humdrum plugin will set the width of the notation to match the width of the parent element that contains the notation.
| `pageMarginBottom` | 50            | 0         | 500       | Height of the bottom margin.
| `pageMarginLeft`   | 50            | 0         | 500       | Width of the left margin.
| `pageMarginRight`  | 50            | 0         | 500       | Width of the right margin.
| `pageMarginTop`    | 50            | 0         | 500       | Height of the top margin.
| `scale`            | 40            | 1         |           | The scaling size of the music notation as a percentage.
| `spacingStaff`     | 8             | 0         | 24        | The minimum distance between staves in diatonic steps.
| `spacingLinear`    | 0.25          | 0.0       | 1.0       | This parameter controls the density of the notation, with 0.0 being very crowded and 1.0 being very spacious.
| `spacingNonLinear` | 0.6           | 0.0       | 1.0       | This parameter controls the relative widths of notes compared to those that are twice as long.  For example 0.6 means that half notes take up 60% of the space that two quarter notes would.  A value of 0.0 means that all rhythms are equally spaced, and 1.0 means that note spacings are directly proportional to their durations.  Small values will tend to compress the music wile large value tend to expand the musical spacing.
| `lyricSize`      ` | 4.5           | 2.0       | 8.0       | The height of lyric text in units of diatonic steps. ([see lyrics option doc.](/options/lyrics))
| `lyricTopMinMargin`| 2.0           | 0.0       | 8.0       | The minimum margin between lyrics and the music on the staff above them in units of diatonic steps ([see lyrics options doc.](/options/lyrics)).

