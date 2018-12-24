<?php

/*
 * humdrum-mediawiki-extension
 * Humdrum music notation extension for MediaWiki.
 *
 * Craig Stuart Sapp <craig@ccrma.stanford.edu>
 * Wed Dec 12 14:54:26 PST 2018
 * Developed for use in MediaWiki 1.24
 *
 * This <humdrum> tag extension converts Humdrum scores into SVG images using
 * the Verovio toolkit on a MediaWiki-based wiki (https://www.mediawiki.org/wiki/MediaWiki).
 * The extension loads two external javascript libraries to produce SVG images
 * directly within a user's web browser:
 *   (1) Verovio (https://www.verovio.org), using a Humdrum-aware version stored at
 *       https://verovio-script.humdrum.org.
 *   (2) humdrum-plugin (https://plugin.humdrum.org) which serves as a front-end to
 *       manage options for the Verovio toolkit.
 * Since the extension inserts javascript code onto a webpage (which in turn inserts
 * SVG images onto the page), the extension is not suitable for publically editable
 * wikis (such as Wikipedia).
 *
 * The extension will convert a <humdrum> tag such as this:
 *
 *   <humdrum scale="40">
 *   **kern
 *   *clefG2
 *   *M4/4
 *   1c;
 *   ==
 *   *-
 *   </humdrum>
 *
 * into the following HTML code inserted onto the page:
 *
 *   <script>
 *      displayHumdrum({
 *         "scale": "40"
 *      })
 *   </script>
 *   <script type="text/x-humdrum" id="example">
 *      **kern
 *      *clefG2
 *      *M4/4
 *      1c;
 *      ==
 *      *-
 *   </script>
 *
 * The scale parameter sets the size of the music.  Additional parameters
 * are listed at https://plugin.humdrum.org/options.  The first use of
 * the <humdrum> tag will insert the following initializtion code:
 *
 *   <script src="https://verovio-script.humdrum.org/scripts/verovio-toolkit.js"></script>
 *   <script src="https://plugin.humdrum.org/scripts/humdrum-notation-plugin.js"></script>
 *   <script>var vrvToolkit = new verovio.toolkit()</script>
 *
 *
 * Programming References:
 *    https://www.mediawiki.org/wiki/Manual:Tag_extensions
 *    https://www.mediawiki.org/wiki/Parser_extension_tags
 */

// tagCounter is used to initialize the humdrum-plugin code:
$tagCounter = 0;

$wgExtensionFunctions[] = 'wfHumdrum';
$wgExtensionCredits['parserhook'][] = array(
   'name'=>'Humdrum',
   'author'=>'Craig Stuart Sapp',
   'url'=>'http://www.mediawiki.org/wiki/Extension:Humdrum',
   'description'=>'Humdrum music notation renderer',
);


function wfHumdrum() {
   new Humdrum();
}

class Humdrum {

   public static function HumdrumTagSetup(Parser &$parser) {
      global $tagCounter;
      $tagCounter = 100;
      $tagName = "humdrum";
      $callback = function($input, $argv, $parser, $frame) use ($tagName) {
         return Humdrum::hookHumdrum($input, $argv, $parser, $frame, $tagName);
      };
      $parser->setHook($tagName, $callback);
      return true;
   }

   # Construct the extension and install it as a parser hook.
   public function __construct() { 
      global $wgHooks;
      $wgHooks['ParserFirstCallInit'][] = 'Humdrum::HumdrumTagSetup';
   }

   # hookHumdrum -- The hook function. Handles <humdrum></humdrum>.
   # Receives the Humdrum content and <humdrum> parameters.
   public static function hookHumdrum($humdrumText, $argv, $parser, $frame, $tagName) {

      // prevent caching of pages using the extension
      $parser->disableCache();

      // Build the displayHumdrum parameters string from the tag parameters
      // and insert into a <script> element.
      global $tagCounter;
      $source = "";
      $optionContainer = "<script>displayHumdrum({";
      foreach ($argv as $key => $val) {
         $optionContainer .= "\t\"$key\":\t\"$val\",";
         if ($key == "source") {
            $source = $val;
         }
      }
      if ($source == "") {
         // create an automatic name for the notation example
         $randval = rand();
         $source = "humdrum-$randval";
         $optionContainer .= "\t\"source\":\t\"$source\",";
      }
      $optionContainer = preg_replace('/,$/', "", $optionContainer);
      $optionContainer .= "})</script>";

      $humdrumContainer = "<script type=\"text/x-humdrum\" id=\"$source\">\n";
      $humdrumContainer .= $humdrumText;
      $humdrumContainer .= "</script>";

      $initialization = "";
      if ($tagCounter == 100) {
         # Only include this code the first time an example is placed on the page.
         $initialization .= "<script src=\"https://verovio-script.humdrum.org/scripts/verovio-toolkit.js\"></script>";
         $initialization .= "<script src=\"https://plugin.humdrum.org/scripts/humdrum-notation-plugin.js\"></script>";
         $initialization .= "<script>var vrvToolkit = new verovio.toolkit()</script>";
      }
      $tagCounter++;

      return array("$initialization$optionContainer$humdrumContainer", "markerType" => 'nowiki');
   }
}

?>
