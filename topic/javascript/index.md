---
vim:	ts=3
---

# Integration with Javascript #

<html>
<head>
<title>An example</title>
</head>
<body>

{% include_relative style-local.html %}
{% include_relative listeners.html %}
{% include_relative scripts-local.html %}

Below is a musical dice game attributed to Mozart (K<sup>6</sup> 516f).  The <a
href="https://kern.humdrum.org/cgi-bin/ksdata?file=k516f.krn&l=users/craig/dice/mozart&format=pdf"
target="_new">original score</a> was printed in a musical magazine
in Berlin around 1790.  Click on measure numbers in the following
grid to construct a score, which will be displayed under the measure
grid.  When no measures are selected, all of the input measures are
displayed.  To play the game, roll two dice at a time to select a specific row
in the grid.  Do this sixteen times to generate a randomized score.

<div id="measure-grid"></div>

<script>
	var HnpOptions = {
		/* uri: "h://dice/mozart/k516f.krn", */
		source: "dice",
		postFunctionHumdrum: displayHumdrumData
	}

	displayHumdrum(HnpOptions);
</script>

<script type="text/x-humdrum" id="dice">
!!!COA: Mozart, Wolfgang Amadeus
!!!OTL@@DE: Musikalisches Würfelspiel
!!!OTL@EN: Musical Dice Game
!!!SCA1: K<sup>6</sup> 516f
!!!SCA2: K<sup>3</sup> Anh.294d
!!!ODT: 1787
!!!PDT: ~1790
!!!PPP: Berlin
!!!PTL: Rellstabschen Musikhandlung, Op. 142
!!!ONB1@EN: Instruction To compose without the least knowledge of Music
!!!ONB2@EN: so much German Walzer or Schleifer as one pleases, by throwing a
!!!ONB3@EN: certain Number with two Dice.
!!
!! The following table gives the rules to construct a composition from the list of measures
!! that follow.  The leftmost column gives the numbers from 2 to 12 that represent the roll
!! of two six-sided dice.  The numbers on the top row represent the measure number in the 
!! output composition.  For example, if you roll a 7 for measure one in the output score,
!! then select measure 104 of the input score.
!!
!!     |   1    2    3    4    5    6    7    8    9   10   11   12   13   14   15   16
!!  ===|===============================================================================
!!   2 |  96   22  141   41  105  122   11   30   70  121   26    9  112   49  109   14
!!   3 |  32    6  128   63  146   46  134   81  117   39  126   56  174   18  116   83
!!   4 |  69   95  158   13  153   55  110   24   66  139   15  132   73   58  145   79
!!   5 |  40   17  113   85  161    2  159  100   90  176    7   34   67  160   52  170
!!   6 | 148   74  163   45   80   97   36  107   25  143   64  125   76  136    1   93
!!   7 | 104  157   27  167  154   68  118   91  138   71  150   29  101  162   23  151
!!   8 | 152   60  171   53   99  133   21  127   16  155   57  175   43  168   89  172
!!   9 | 119   84  114   50  140   86  169   94  120   88   48  166   51  115   72  111
!!  10 |  98  142   42  156   75  129   62  123   65   77   19   82  137   38  149    8
!!  11 |   3   87  165   61  135   47  147   33  102    4   31  164  144   59  173   78
!!  12 |  54  130   10  103   28   37  106    5   35   20  108   92   12  124   44  131
!!
!! To build a score in VHV (https://verovio.humdrum.org) using the myank filter, type a
!! line like this (with the three exclamation marks starting at the beginning of the line):
!!          !!!filter: myank -m 104,95,158,13,161,47,11,100,90,77,15,9,112,49,109,8
!! Do not add spaces between the measure numbers (or place the list in quotes if you do).
!!
!! It is also interesting to place all measures for a particular output measure side-by-side,
!! such as all of the options for measure  8:
!!          !!!filter: myank -m 30,81,24,100.107,91,127,94,123,33,5
!! or measure 13:
!!          !!!filter: myank -m 112,174,73,67,76,101,43,51,137,144,12
!!
!! Type alt-p (or option-p in MacOS) in VHV to view a PDF of the original score.
!!
**kern	**kern
*oclefF4	*oclefC1
*clefF4	*clefG2
*k[]	*k[]
*M3/8	*M3/8
*MM80	*MM80
!!LO:PB:g=z:page=1:loc=top-right
=1	=1
8GL	8ffL
8D	8dd
8GJ	8ggJ
=2	=2
4BB 4G	8aL
.	16f#L
.	16g
8r	16b
.	16ggJJ
=3	=3
*^	*
4E	4C	8ggL
.	.	8cc
*v	*v	*
8r	8eeJ
=4	=4
16GGLL	8gg
16BBJ	.
8G	4ddT
8BBJ	.
=5	=5
*^	*^
!LO:TX:b:t=1st repeat	!LO:TX:a:t=2nd repeat	!	!
8GGL	8GGL	4dd 4gg	4g 4b
16BL	16GL	.	.
16G	16Fn	.	.
*	*	*v	*v
16F#	16E	8r
16EJJ	16DJJ	.
*v	*v	*
=6	=6
*^	*
4E	4C	8gL
.	.	8cc
*v	*v	*
8r	8eeJ
=7	=7
*^	*
4G	4C	16eeLL
.	.	16cc
.	.	16ee
.	.	16ff
*v	*v	*
8r	16ccc
.	16ggJJ
=8	=8
8CL	4cc
8GG	.
8CCJ	8r
!!LO:LB:g=z
=9	=9
4G	8ccL 8ee
.	8bJ 8dd
8GG	8r
=10	=10
4G	16bLL
.	16a
.	16b
.	16cc
8r	16dd
.	16bJJ
=11	=11
8CL	16eeLL
.	16cc
8D	16b
.	16a
8DDJ	16g
.	16f#JJ
=12	=12
8CL	8eL 8cc
8C	8e 8cc
8CJ	8eJ 8cc
=13	=13
4E 4G	(8ccL
.	8g
8r	8eJ)
=14	=14
8CL	4cc
8GG	.
8CCJ	8r
=15	=15
*^	*
4G	4C	8eeL
.	.	16ggL
.	.	16eeJ
8E	8C	8ccJ
*v	*v	*
=16	=16
*^	*
4F#	4D	8aaL
.	.	(8ff#
8F#	8C	8ddJ)
*v	*v	*
!!LO:LB:g=z
=17	=17
*^	*
4G	4E	16ccLL
.	.	16g
.	.	16cc
.	.	16ee
*v	*v	*
8r	16g
.	16ccJJ
=18	=18
*^	*
4E	4C	(8gL
.	.	8cc
8G	8C	8eeJ)
*v	*v	*
=19	=19
*^	*
4G	4C	16eeLL
.	.	16ccJ
.	.	8ee
8E	8C	8ggJ
*v	*v	*
=20	=20
4BB	8ggL
.	16bbL
.	16dddJ
8r	8ddJ
=21	=21
8CL	16ccLL
.	16ee
8D	16gg
.	16dd
8DDJ	16a
.	16ff#JJ
=22	=22
4C	8eeL
.	8cc
8r	8gJ
=23	=23
16FLL	16ffLL
16E	16ee
16D	16dd
16E	16ee
16F	16ff
16GJJ	16ggJJ
=24	=24
*^	*^
!LO:TX:b:t=1st repeat	!LO:TX:a:t=2nd repeat	!	!
8GGL	8GGL	4gg 4dd	4g 4b
16BL	16GL	.	.
16G	16Fn	.	.
*	*	*v	*v
16F#	16E	8r
16EJJ	16DJJ	.
*v	*v	*
!!LO:PB:g=z:page=2:loc=top-left
=25	=25
4D	16dLL
.	16f#
.	16a
.	16dd
8C	16ff#
.	16aaJJ
=26	=26
16CLL	8ccL 8ee
16E	.
16G	8cc 8ee
16E	.
16c	8ccJ 8ee
16CJJ	.
=27	=27
4G 4B	16ffLL
.	16ee
.	16ff
.	16dd
8r	16cc
.	16bJJ
=28	=28
4C 4A	16ff#LL
.	16dd
.	16cc
.	16aa
8r	16ff#
.	16ddJJ
=29	=29
4G	16bLL
.	16dd
.	16gg
.	16ddJ
8GG	8bJ
=30	=30
*^	*^
!LO:TX:b:t=1st repeat	!LO:TX:a:t=2nd repeat	!	!
8GGL	8GGL	4gg 4dd	4g 4b
16BL	16GL	.	.
16G	16Fn	.	.
*	*	*v	*v
16F#	16E	8r
16EJJ	16DJJ	.
*v	*v	*
=31	=31
4C 4G	16eeLL
.	16ccJ
.	8g
8C 8G	8eeJ
!!LO:LB:g=z
=32	=32
4C 4E	8gL
.	8cc
8r	8eeJ
=33	=33
*^	*^
!LO:TX:b:t=1st repeat	!LO:TX:a:t=2nd repeat	!	!
8GGL	8GGL	4gg 4dd	4g 4b
16BL	16GL	.	.
16G	16Fn	.	.
*	*	*v	*v
16F#	16E	8r
16EJJ	16DJJ	.
*v	*v	*
=34	=34
4G	16eeLL
.	16cc
.	16dd
.	16bJ
8r	8gJ
=35	=35
4D 4F#	8aL
.	8dd
8C 8A	8ff#J
=36	=36
8CL	16dLL
.	16f#
8D	16a
.	16dd
8DDJ	16ff#
.	16aaJJ
=37	=37
*^	*
4D	4BB	16ggLL
.	.	16bb
.	.	16gg
.	.	16ddJ
*v	*v	*
8r	8bJ
=38	=38
16CLL 16E	(8ccL
16G	.
16C 16E	8g
16G	.
16C 16E	8eeJ)
16GJJ	.
!!LO:LB:g=z
=39	=39
16BBLL	8ggL
16D	.
16G	8g
16D	.
16BB	8gJ
16GGJJ	.
=40	=40
*^	*
4E	4C	16ccLL
.	.	16b
.	.	16cc
.	.	16ee
*v	*v	*
8r	16g
.	16ccJJ
=41	=41
*^	*
4E	4C	16ccLL
.	.	16b
.	.	16cc
.	.	16eeJ
*v	*v	*
8r	8gJ
=42	=42
4GG	16bLL
.	16cc
.	16dd
.	16b
8r	16a
.	16gJJ
=43	=43
*^	*
4E	4C	8ggL
.	.	16ffL
.	.	16ee
*v	*v	*
8r	16dd
.	16ccJJ
=44	=44
4F	8aL
.	16ffL
.	16dd
8G	16a
.	16bJJ
=45	=45
4E 4G	16ccLL
.	16b
.	16cc
.	16g
8r	16e
.	16cJJ
=46	=46
4BB 4D	8ggL
.	16bbL
.	16gg
8r	16dd
.	16bJJ
!!LO:PB:g=z:page=3:loc=top-right
=47	=47
4BB 4D	8ggL
.	16ggL
.	16ddJ
8r	8bbJ
=48	=48
4C 4G	8eeL
.	16ccL
.	16ee
8C 8E	16gg
.	16cccJJ
=49	=49
16CLL 16E	(8eeL
16G	.
16C 16E	8cc
16G	.
16C 16E	8gJ)
16GJJ	.
=50	=50
4E 4G	8ccL
.	16eeL
.	16ccJ
8r	8gJ
=51	=51
*^	*
4E	4C	16ccLL
.	.	16g
.	.	16ee
.	.	16cc
*v	*v	*
8r	16gg
.	16eeJJ
=52	=52
4F	16ddLL
.	16cc#
.	16dd
.	16ff
8G	16g
.	16bJJ
=53	=53
4C	8cc 8eeL
.	16cc 16eeL
.	16dd 16ffJJ
8r	8ee 8gg
=54	=54
8CL	8eL 8cc
8C	8e 8cc
8CJ	8eJ 8cc
=55	=55
4BB 4D	8ggL
.	8bb
8r	8ddJ
!!LO:LB:g=z
=56	=56
4GG	16ddLL
.	16bJ
.	8gJ
8G	8r
=57	=57
16CLL 16E	8eeL
16G	.
16C 16E	8cc
16G	.
16C 16E	8gJ
16GJJ	.
=58	=58
16CLL 16E	8ggL
16G	.
16C 16E	8ee
16G	.
16C 16E	8ccJ
16GJJ	.
=59	=59
16CLL 16E	8ggL
16G	.
16C 16E	8cc
16G	.
16C 16E	8eeJ
16GJJ	.
=60	=60
*^	*
4E	4C	8ggL
.	.	16ffL
.	.	16ee
*v	*v	*
8r	16dd
.	16ccJJ
=61	=61
4E 4G	8ccL
.	16eeL
.	16ccJ
8r	8ggJ
=62	=62
8CL	16eeLL
.	16cc
8D	16b
.	16g
8DDJ	16a
.	16f#JJ
!!LO:LB:g=z
=63	=63
4C	16eeLL
.	16cc
.	16b
.	16ccJ
8r	8gJ
=64	=64
*^	*
4G	4C	16eeLL
.	.	16gg
.	.	16ccc
.	.	16gg
8G	8C	16ee
.	.	16ccJJ
*v	*v	*
=65	=65
*^	*
4F#	4D	16ddLL
.	.	16gJ
.	.	8dd
*v	*v	*
8r	8ff#J
=66	=66
*^	*
8AL	8DL	8ff#L
8F#	8D	8aa
8DJ	8CJ	8ff#J
*v	*v	*
=67	=67
*^	*
!!LO:TX:b:t=* 2
4E	4C	16ccLL
.	.	16b
.	.	16cc
.	.	16ee
8G	8E	16g
.	.	16ccJJ
*v	*v	*
=68	=68
4BB	8ggL
.	16bbL
.	16gg
8r	16dd
.	16ggJJ
=69	=69
*^	*
4E	4C	8ggL
.	.	(8ee
*v	*v	*
8r	8bJ)
=70	=70
4D	8ff#L
.	16aaL
.	16ff#
8C	16dd
.	16ff#JJ
!!LO:LB:g=z
=71	=71
*^	*
4D	4BB	16ggLL
.	.	16bb
.	.	16ddd
.	.	16bbJ
8D	8BB	8ggJ
*v	*v	*
=72	=72
4F	16ffLL
.	16ee
.	16dd
.	16cc
8G	16b
.	16ddJJ
=73	=73
16CLL 16E	8ggL
16G	.
16C 16E	8ee
16G	.
16C 16E	8ccJ
16GJJ	.
=74	=74
*^	*
4E	4C	16cccLL
.	.	16bb
.	.	16ccc
.	.	16gg
*v	*v	*
8r	16ee
.	16ccJJ
=75	=75
8CL	8ddL 8ff#
8C	8dd 8ff#
8CJ	8ddJ 8ff#
=76	=76
*^	*
4E	4C	16cccLL
.	.	16bb
.	.	16ccc
.	.	16gg
8G	8C	16ee
.	.	16ccJJ
*v	*v	*
=77	=77
*^	*
4D	4BB	16ggLL
.	.	16bbJ
.	.	8gg
8G	8BB	8ddJ
*v	*v	*
=78	=78
4C	8ccL
.	8cJ
8CC	8r
!!LO:LB:g=z
=79	=79
8CL	4dd
8GG	.
8CCJ	8r
=80	=80
4C	8ddL
.	8as$SS
8r	8ff#J``
=81	=81
*^	*^
!LO:TX:b:t=1st repeat	!LO:TX:a:t=2nd repeat	!	!
8GGL	8GGL	4dd 4gg	4g 4b
16BL	16GL	.	.
16G	16Fn	.	.
*	*	*v	*v
16F#	16E	8r
16EJJ	16DJJ	.
*v	*v	*
=82	=82
*^	*
4G	4BB	16ddLL
.	.	16bJ
.	.	8g
8D	8BB	8ggJ
*v	*v	*
=83	=83
8CL	4cc
8GG	.
8CCJ	8r
=84	=84
*^	*
4E	4C	16ccLL
.	.	16g
.	.	16ee
.	.	16cc
*v	*v	*
8r	16gg
.	16eeJJ
=85	=85
4E 4G	8ccL
.	8ee
8r	8gJ
!!LO:LB:g=z
=86	=86
4BB 4G	8ccL
.	16ddL
.	16ggJ
8r	8bbJ
=87	=87
*^	*
4E	4C	8ggL
.	.	8cc
8G	8C	8eeJ
*v	*v	*
=88	=88
*^	*
4D	4BB	16ggLL
.	.	16dd
.	.	16gg
.	.	16bb
8D	8BB	16gg
.	.	16ddJJ
*v	*v	*
=89	=89
!!LO:TX:t=proofread up to this measure
16FLL	16ffLL
16EJ	16eeJ
8D	8dd
8GJ	8ggJ
=90	=90
4C 4A	16ff#LL
.	16aa
.	16ddd
.	16aa
8C 8A	16ff#
.	16aaJJ
=91	=91
*^	*
8GGL	8GGL	4g 4b 4dd 4gg
16BL	16GL	.
16G	16Fn	.
16F#	16E	8r
16EJJ	16DJJ	.
*v	*v	*
=92	=92
4GG 4G	8bL 8dd
.	16ggL
.	16bbJ
8G	8ddJ
!!LO:LB:g=z
=93	=93
8CL	4cc
8GG	.
8CCJ	8r
=94	=94
*^	*
8GGL	8GGL	4g 4b 4dd 4gg
16BL	16GL	.
16G	16Fn	.
16F#	16E	8r
16EJJ	16DJJ	.
*v	*v	*
=95	=95
*^	*
4E	4C	8ggL
.	.	8ee
*v	*v	*
8rBB	8ccJ
=96	=96
4C	8eeL
.	8cc
8r	8gJ
=97	=97
4BB 4D	16ggLL
.	16ff#
.	16gg
.	16dd
8BB 8G	16b
.	16gJJ
=98	=98
16CLL 16E	8ccL
16G	.
16C 16E	8g
16G	.
16C 16E	8eeJ
16GJJ	.
=99	=99
4C 4A	8ff#L
.	8aa
8C 8A	8ddJ
!!LO:LB:g=z
=100	=100
*^	*
8GGL	8GGL	4g 4b 4dd 4gg
16BL	16GL	.
16G	16Fn	.
16F#	16E	8r
16EJJ	16DJJ	.
*v	*v	*
=101	=101
*^	*
4G	4C	16eeLL
.	.	16dd
.	.	16ee
.	.	16gg
8E	8C	16ccc
.	.	16ggJJ
*v	*v	*
=102	=102
4C 4A	16gg#LL
.	16ddJ
.	8cc
8C 8A	8ffJ
=103	=103
4E 4G	16ccLL
.	16ee
.	16cc
.	16aJ
8r	8eJ
=104	=104
4C	16eeLL
.	16dd
.	16ee
.	16gg
8r	16ccc
.	16ggJJ
=105	=105
4C	8ff#L
.	16aaL
.	16ff#
8r	16dd
.	16ff#JJ
=106	=106
8CL	8aL
8D	16ddL
.	16cc
8DDJ	16b
.	16aJJ
!!LO:LB:g=z
=107	=107
*^	*
8GGL	8GGL	4g 4b 4dd 4gg
16BL	16GL	.
16G	16Fn	.
16F#	16E	8r
16EJJ	16DJJ	.
*v	*v	*
=108	=108
4C 4G	(8eeL
.	8gg
8C 8E	8cccJ)
=109	=109
4F 4A	16ddLL
.	16ff
.	16dd
.	16ff
8E 8d	16b
.	16ddJJ
=110	=110
8CL	(16aLL 16dd
.	16a) 16cc
8D	(16a 16cc
.	16g) 16b
8DDJ	(16g 16b
.	16f#JJ) 16a
=111	=111
8CL	4ee
8GG	.
8CCJ	8r
=112	=112
16CLL 16E	8eeL
16G	.
16C 16E	8cc
16G	.
16C 16E	8gJ
16GJJ	.
=113	=113
4G 4B	8ffL
.	8dd
8r	8bJ
=114	=114
8GL	8bL 8dd
8G	8b 8dd
8GJ	8bJ 8dd
!!LO:PB:g=z:page=6:loc=top-left
=115	=115
4C 4E	16ccLL
.	16g
.	16ee
.	16cc
8r	16gg
.	16eeJJ
=116	=116
4F	16ddLL
.	16ff
.	16aa
.	16ff
8G	16dd
.	16bJJ
=117	=117
4D 4F#	16ddLL
.	16a
.	16dd
.	16ff#
8r	16aa
.	16ff#JJ
=118	=118
8CL	16eeLL
.	16aa
8D	16gg
.	16bb
8DDJ	16ff#
.	16aaJJ
=119	=119
4C 4E	16eeLL
.	16cc
.	16gg
.	16ee
8r	16ccc
.	16ggJJ
=120	=120
4D 4F#	8dddL
.	16aaL
.	16ff#
8C 8F#	16dd
.	16aJJ
=121	=121
4BB 4G	8ggL
.	16bbL
.	16ggJ
8r	8ddJ
=122	=122
8BBL 8D	16ggLL
.	16ff#
8BB 8D	16gg
.	16bbJ
8BBJ 8D	8ddJ
!!LO:LB:g=z
=123	=123
*^	*
8GGL	8GGL	4g 4b 4dd 4gg
16BL	16GL	.
16G	16Fn	.
16F#	16E	8r
16EJJ	16DJJ	.
*v	*v	*
=124	=124
8CL	8aL 8cc
8C	8a 8cc
8CJ	8aJ 8cc
=125	=125
8GL	16ggLL
.	16ee
8GGJ	16dd
.	16ddJ
8r	8gJ
=126	=126
4E	16ccLL
.	16g
.	16cc
.	16ee
16ELL	16gg
16CJJ	16ccJJ 16ee
=127	=127
*^	*
8GGL	8GGL	4g 4b 4dd 4gg
16BL	16GL	.
16G	16Fn	.
16F#	16E	8r
16EJJ	16DJJ	.
*v	*v	*
=128	=128
4GG	8bL
.	8dd
8r	8ggJ
=129	=129
8BBL 8D	16aaLL
.	16gg
8BB 8D	16ff#
.	16ggJ
8BBJ 8G	8ddJ
!!LO:LB:g=z
=130	=130
8CL	8eL 8cc
8C	8e 8cc
8CJ	8eJ 8cc
=131	=131
8CL	4cc
8GG	.
8CCJ	8r
=132	=132
8GL	8ccL 8ee
8GGJ	16bL 16dd
.	16gJ 16b
8r	8gJ
=133	=133
4BB 4G	8ddL
.	16ggL
.	16dd
8r	16b
.	16ddJJ
=134	=134
8CL	16aLL
.	16ee
8D	16b 16dd
.	16a 16cc
8DDJ	16g 16b
.	16f#JJ 16a
=135	=135
*^	*
8DL	8CL	8ff#L
8D	8C	16ff#L
.	.	16ddJ
8DJ	8CJ	8aaJ
*v	*v	*
=136	=136
*^	*
4E	4C	16cccLL
.	.	16bb
.	.	16ccc
.	.	16gg
*v	*v	*
8rBB	16ff
.	16ccJJ
=137	=137
16CLL 16E	8ccL
16G	.
16C 16E	8g
16G	.
16C 16E	8eeJ
16GJJ	.
!!LO:PB:g=z:page=7:loc=top-right
=138	=138
16DDLL	8a 8dd 8ff#
16D	.
16C#	4ff#t
16D	.
16Cn	.
16DJJ	.
=139	=139
4BB	16ggLL
.	16bb
.	16gg
.	16bbJ
8r	8ddJ
=140	=140
8CL 8F#	8aL
8C 8F#	16aL
.	16ddJ
8CJ 8A	8ff#J
=141	=141
4BB 4G	16ddLL
.	16ee
.	16ff
.	16dd
8GG	16cc
.	16bJJ
=142	=142
4C 4E	8ccL
.	8g
8r	8eeJ
=143	=143
4BB 4D	8ggL
.	16ddL
.	16bJ
8BB 8D	8gJ
=144	=144
16CLL 16E	8ggL
16G	.
16C 16E	8cc
16G	.
16C 16E	8eeJ
16GJJ	.
=145	=145
4F	16ddLL
.	16ff
.	16a
.	16dd
8G	16b
.	16ddJJ
!!LO:LB:g=z
=146	=146
8CL	8f#L 8dd
8C	8dd 8ff#
8CJ	8ff#J 8aa
=147	=147
8CL	16eeLL
.	16ccc
8D	16bb
.	16gg
8DDJ	16aa
.	16ff#JJ
=148	=148
4C 4E	16cccLL
.	16bb
.	16ccc
.	16gg
8r	16ee
.	16ccJJ
=149	=149
4F	16ffLL
.	16ddJ
.	8cc
8G	8ddJ
=150	=150
16CLL	8g 8cc 8ee
16BB	.
16C	4eet
16D	.
16E	.
16F#JJ	.
=151	=151
8CL	4cc
8GG	.
8CCJ	8r
=152	=152
4C 4E	8ggL
.	16ffL
.	16ee
8r	16dd
.	16ccJJ
=153	=153
4C	16ddLL
.	16a
.	16ff#
.	16dd
8r	16aa
.	16ff#JJ
!!LO:LB:g=z
=154	=154
4C	16ddLL
.	16cc#
.	16dd
.	16ff#
8r	16aa
.	16ff#JJ
=155	=155
4BB 4D	16ggLL
.	16bb
.	16gg
.	16dd
8r	16b
.	16gJJ
=156	=156
4E 4G	16ccLL
.	16g
.	16ee
.	16ccJ
8r	8ggJ
=157	=157
4C	16eeLL
.	16dd
.	16ee
.	16gg
8r	16ccc
.	16ggJJ
=158	=158
4GG	8bL
.	16ddL
.	16b
8r	16a
.	16gJJ
=159	=159
8CL	16eeLL
.	16gg
8D	16dd
.	16cc
8DDJ	16b
.	16aJJ
=160	=160
4C 4E	16ccLL
.	16b
.	16cc
.	16ee
8C 8E	16g
.	16ccJJ
!!LO:PB:g=z:page=8:loc=top-left
=161	=161
8CL	8f#L 8cc
8C	8f# 8cc
8CJ	8f#J 8cc
=162	=162
4C 4G	16eeLL
.	16dd
.	16ee
.	16gg
8C 8E	16ccc
.	16ggJJ
=163	=163
4BB 4D	16ggLL
.	16ff#
.	16gg#
.	16dd
8r	16b
.	16gJJ
=164	=164
16GLL	8dd
16F#	.
16G	4g
16D	.
16BB	.
16GGJJ	.
=165	=165
4BB	(8ddL
.	8b
8r	8gJ)
=166	=166
4G 4B	16ddLL
.	16bb
.	16gg
.	16ddJ
8r	8bJ
!!LO:LB:g=z
=167	=167
4C 4E	8ccL
.	16ccL
.	16ddJ
8r	8eeJ
=168	=168
4C 4E	8ggL
.	16ffL
.	16ee
8E 8G	16dd
.	16ccJJ
=169	=169
8CL	16eeLL
.	16gg
8F	16dd
.	16gg
8DDJ	16a
.	16ff#JJ
=170	=170
8CL	4cc
8GG	.
8CCJ	8r
=171	=171
4GG 4G	16bLL
.	16cc
.	16dd
.	16ee
8BB 8G	16ff
.	16ddJJ
=172	=172
8CL	4cc
8GG	.
8CCJ	8r
!!LO:LB:g=z
=173	=173
4F	16ffLL
.	16aaJJ
.	8a
8G	16bLL
.	16ddJJ
=174	=174
16CLL 16E	8gL
16G	.
16C 16E	8cc
16G	.
16C 16E	8eeJ
16GJJ	.
=175	=175
8GL	16eeLL
.	16cc
8GGJ	16b
.	16ddJ
8r	8ddJ
=176	=176
4BB 4D	16aaLL
.	16gg
.	16bb
.	16gg
8BB 8D	16dd
.	16ggJJ
=	=
*-	*-
!!!EED: Craig Stuart Sapp
!!!EEV: 2020/08/19
!!!URL-vhv: http://verovio.humdrum.org/?file=dice/mozart/k516f.krn
!!!URL-imslp: https://imslp.org/wiki/Musikalisches_W%C3%BCrfelspiel,_K.516f_(Mozart,_Wolfgang_Amadeus)
!!!URL-pdf: http://conquest.imslp.info/files/imglnks/usimg/4/44/IMSLP595848-PMLP47543-mozart_wurfelspiel_rellstab_PPN1672431816.pdf
!!!title: @{OTL}, (Mozart? @{SCA1})
</script>



<div style="display:none" id="humdrum-link"></div>
<pre style="display:none; tab-size:12; -moz-tab-size:12;" id="humdrum-score"></pre>




<div style="display:none" id="title-notation-source">
!!!title: A realization of <i>Musikalisches Würfelspiel</i> (Mozart?, K<sup>6</sup>. 516f)
{% include banner-scores/mozart-516f.krn %}
</div>


</body>
</html>

