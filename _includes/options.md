

| option name | default value | description 
|-------------|---------------|------------
| `filter `   |               | A filter command which will be run on the Humdrum data before it is sent to the renderer to generate graphical music notation.
| `incipit`   | "false"       | When set to "true", only the first system of the music notation will be displayed. 
| `renderer`  | vrvToolkit    | The name of the variable that contains the verovio toolkit, which is used to generate SVG of the music notation.  If the toolkit is stored in a variable called `vrvToolkit`, then this parameter is optional.
| `source`    |               | A required ID for an element that stored the Humdrum data to generate notation from.  The location of this element on the page will determine the position of the generated notation.  If the data is downloaded via a URL, then this is the ID of the element where the downloaded data will be stored.
| `url`       |               | The URL from which to download data can be given with this parameter.  By default musical data is stored extracted from the page, but this parameter allowed it to be downloaded from a separate file on the web server, or in certain cases, downloaded from other web servers such as Github.

Numeric options:

| option name        | default       | min       | max       | description 
|--------------------|---------------|-----------|-----------|-------------
| `pageHeight`       | *none*        | 100       | 60000     | Width of the music notation.  By default, the humdrum plugin will set the width of the notation to match the width of the parent element that contains the notation.
| `scale`            | 40            | 1         |           | The scaling size of the music notation.
| `spacingStaff`     | 8             | 0         | 24        | The minimum distance between staves in diatonic steps.
| `spacingLinear`    | 0.25          | 0.00      | 1.00      | This parameter controls the density of the notation, with 0.0 being very crowded and 1.0 being very spacious.
| `spacingNonLinear` | 0.60          | 0.00      | 1.00      | This parameter controls the relative widths of notes compared to those that are twice as long.  For example 0.6 means that half notes take up 60% of the space that two quarter notes would.  A value of 0.00 means that all rhythms are equally spaced, and 1.00 means that note spacings are directly proportional to their durations.  Small values will tend to compress the music wile large value tend to expand the musical spacing.
| `lyricSize`      ` | 4.50          | 2.00      | 8.00      | The height of lyric text in units of diatonic steps.
| `lyricTopMinMargin`| 2.00          | 0.00      | 8.00      | The minimum margin between lyrics and the music on the staff above them in units of diatonic steps.


