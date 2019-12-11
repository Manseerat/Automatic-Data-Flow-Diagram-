/**
 * The $1 Unistroke Recognizer (JavaScript version)
 *
 *  Jacob O. Wobbrock, Ph.D.
 *  The Information School
 *  University of Washington
 *  Seattle, WA 98195-2840
 *  wobbrock@uw.edu
 *
 *  Andrew D. Wilson, Ph.D.
 *  Microsoft Research
 *  One Microsoft Way
 *  Redmond, WA 98052
 *  awilson@microsoft.com
 *
 *  yang Li, Ph.D.
 *  Department of Computer Science and Engineering
 *  University of Washington
 *  Seattle, WA 98195-2840
 *  yangli@cs.washington.edu
 *
 * The academic publication for the $1 recognizer, and what should be
 * used to cite it, is:
 *
 *     Wobbrock, J.O., Wilson, A.D. and Li, y. (2007). Gestures without
 *     libraries, toolkits or training: A $1 recognizer for user interface
 *     prototypes. Proceedings of the ACM Symposium on User Interface
 *     Software and Technology (UIST '07). Newport, Rhode Island (October
 *     7-10, 2007). New york: ACM Press, pp. 159-168.
 *     https://dl.acm.org/citation.cfm?id=1294238
 *
 * The Protractor enhancement was separately published by yang Li and programmed
 * here by Jacob O. Wobbrock:
 *
 *     Li, y. (2010). Protractor: A fast and accurate gesture
 *     recognizer. Proceedings of the ACM Conference on Human
 *     Factors in Computing Systems (CHI '10). Atlanta, Georgia
 *     (April 10-15, 2010). New york: ACM Press, pp. 2169-2172.
 *     https://dl.acm.org/citation.cfm?id=1753654
 *
 * This software is distributed under the "New BSD License" agreement:
 *
 * Copyright (C) 2007-2012, Jacob O. Wobbrock, Andrew D. Wilson and yang Li.
 * All rights reserved. Last updated July 14, 2018.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *    * Redistributions of source code must retain the above copyright
 *      notice, this list of conditions and the following disclaimer.
 *    * Redistributions in binary form must reproduce the above copyright
 *      notice, this list of conditions and the following disclaimer in the
 *      documentation and/or other materials provided with the distribution.
 *    * Neither the names of the University of Washington nor Microsoft,
 *      nor the names of its contributors may be used to endorse or promote
 *      products derived from this software without specific prior written
 *      permission.
 *
 * THIS SOFTWARE IS PROVIDED By THE COPyRIGHT HOLDERS AND CONTRIBUTORS "AS
 * IS" AND ANy ExPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
 * THE IMPLIED WARRANTIES OF MERCHANTABILITy AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL Jacob O. Wobbrock OR Andrew D. Wilson
 * OR yang Li BE LIABLE FOR ANy DIRECT, INDIRECT, INCIDENTAL, SPECIAL, ExEMPLARy,
 * OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANy THEORy OF LIABILITy, WHETHER IN CONTRACT,
 * STRICT LIABILITy, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANy WAy
 * OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITy OF SUCH DAMAGE.
**/
//
// Point class
//
function Point(x, y) // constructor
{
	this.x = x;
	this.y = y;
}
//
// Rectangle class
//
function Rectangle(x, y, width, height) // constructor
{
	this.x = x;
	this.y = y;
	this.Width = width;
	this.Height = height;
}
//
// Unistroke class: a unistroke template
//
function Unistroke(name, points) // constructor
{
	this.Name = name;
	this.Points = Resample(points, NumPoints);
	var radians = IndicativeAngle(this.Points);
	this.Points = RotateBy(this.Points, -radians);
	this.Points = ScaleTo(this.Points, SquareSize);
	this.Points = TranslateTo(this.Points, Origin);
	this.Vector = Vectorize(this.Points); // for Protractor
}
//
// Result class
//
function Result(name, score, ms) // constructor
{
	this.Name = name;
	this.Score = score;
	this.Time = ms;
}
//
// DollarRecognizer constants
//
const NumUnistrokes = 3;
const NumPoints = 64;
const SquareSize = 250.0;
const Origin = new Point(0,0);
const Diagonal = Math.sqrt(SquareSize * SquareSize + SquareSize * SquareSize);
const HalfDiagonal = 0.5 * Diagonal;
const AngleRange = Deg2Rad(45.0);
const AnglePrecision = Deg2Rad(2.0);
const Phi = 0.5 * (-1.0 + Math.sqrt(5.0)); // Golden Ratio
const points_array = [new Array(new Point(110,59),new Point(109,58),new Point(109,56),new Point(109,54),new Point(109,53),new Point(109,51),new Point(108,49),new Point(108,47),new Point(108,46),new Point(107,44),new Point(106,42),new Point(106,41),new Point(105,39),new Point(104,38),new Point(104,36),new Point(103,34),new Point(102,33),new Point(101,32),new Point(100,30),new Point(99,29),new Point(98,27),new Point(97,26),new Point(95,25),new Point(94,24),new Point(93,22),new Point(92,21),new Point(90,20),new Point(89,19),new Point(87,18),new Point(86,17),new Point(85,16),new Point(83,15),new Point(81,15),new Point(80,14),new Point(78,13),new Point(77,13),new Point(75,12),new Point(73,11),new Point(72,11),new Point(70,11),new Point(68,10),new Point(66,10),new Point(65,10),new Point(63,10),new Point(61,10),new Point(59,10),new Point(58,10),new Point(56,10),new Point(54,10),new Point(53,10),new Point(51,10),new Point(49,11),new Point(47,11),new Point(46,11),new Point(44,12),new Point(42,13),new Point(41,13),new Point(39,14),new Point(38,15),new Point(36,15),new Point(34,16),new Point(33,17),new Point(32,18),new Point(30,19),new Point(29,20),new Point(27,21),new Point(26,22),new Point(25,24),new Point(24,25),new Point(22,26),new Point(21,27),new Point(20,29),new Point(19,30),new Point(18,32),new Point(17,33),new Point(16,34),new Point(15,36),new Point(15,38),new Point(14,39),new Point(13,41),new Point(13,42),new Point(12,44),new Point(11,46),new Point(11,47),new Point(11,49),new Point(10,51),new Point(10,53),new Point(10,54),new Point(10,56),new Point(10,58),new Point(10,60),new Point(10,61),new Point(10,63),new Point(10,65),new Point(10,66),new Point(10,68),new Point(11,70),new Point(11,72),new Point(11,73),new Point(12,75),new Point(13,77),new Point(13,78),new Point(14,80),new Point(15,81),new Point(15,83),new Point(16,85),new Point(17,86),new Point(18,87),new Point(19,89),new Point(20,90),new Point(21,92),new Point(22,93),new Point(24,94),new Point(25,95),new Point(26,97),new Point(27,98),new Point(29,99),new Point(30,100),new Point(32,101),new Point(33,102),new Point(35,103),new Point(36,104),new Point(38,104),new Point(39,105),new Point(41,106),new Point(42,106),new Point(44,107),new Point(46,108),new Point(47,108),new Point(49,108),new Point(51,109),new Point(53,109),new Point(54,109),new Point(56,109),new Point(58,109),new Point(60,110),new Point(61,109),new Point(63,109),new Point(65,109),new Point(66,109),new Point(68,109),new Point(70,108),new Point(72,108),new Point(73,108),new Point(75,107),new Point(77,106),new Point(78,106),new Point(80,105),new Point(81,104),new Point(83,104),new Point(85,103),new Point(86,102),new Point(87,101),new Point(89,100),new Point(90,99),new Point(92,98),new Point(93,97),new Point(94,95),new Point(95,94),new Point(97,93),new Point(98,92),new Point(99,90),new Point(100,89),new Point(101,87),new Point(102,86),new Point(103,85),new Point(104,83),new Point(104,81),new Point(105,80),new Point(106,78),new Point(106,77),new Point(107,75),new Point(108,73),new Point(108,72),new Point(108,70),new Point(109,68),new Point(109,66),new Point(109,65),new Point(109,63),new Point(109,61)),
	new Array(new Point(110,60),new Point(109,61),new Point(109,63),new Point(109,65),new Point(109,66),new Point(109,68),new Point(108,70),new Point(108,72),new Point(108,73),new Point(107,75),new Point(106,77),new Point(106,78),new Point(105,80),new Point(104,81),new Point(104,83),new Point(103,85),new Point(102,86),new Point(101,87),new Point(100,89),new Point(99,90),new Point(98,92),new Point(97,93),new Point(95,94),new Point(94,95),new Point(93,97),new Point(92,98),new Point(90,99),new Point(89,100),new Point(87,101),new Point(86,102),new Point(85,103),new Point(83,104),new Point(81,104),new Point(80,105),new Point(78,106),new Point(77,106),new Point(75,107),new Point(73,108),new Point(72,108),new Point(70,108),new Point(68,109),new Point(66,109),new Point(65,109),new Point(63,109),new Point(61,109),new Point(60,110),new Point(58,109),new Point(56,109),new Point(54,109),new Point(53,109),new Point(51,109),new Point(49,108),new Point(47,108),new Point(46,108),new Point(44,107),new Point(42,106),new Point(41,106),new Point(39,105),new Point(38,104),new Point(36,104),new Point(35,103),new Point(33,102),new Point(32,101),new Point(30,100),new Point(29,99),new Point(27,98),new Point(26,97),new Point(25,95),new Point(24,94),new Point(22,93),new Point(21,92),new Point(20,90),new Point(19,89),new Point(18,87),new Point(17,86),new Point(16,85),new Point(15,83),new Point(15,81),new Point(14,80),new Point(13,78),new Point(13,77),new Point(12,75),new Point(11,73),new Point(11,72),new Point(11,70),new Point(10,68),new Point(10,66),new Point(10,65),new Point(10,63),new Point(10,61),new Point(10,60),new Point(10,58),new Point(10,56),new Point(10,54),new Point(10,53),new Point(10,51),new Point(11,49),new Point(11,47),new Point(11,46),new Point(12,44),new Point(13,42),new Point(13,41),new Point(14,39),new Point(15,38),new Point(15,36),new Point(16,34),new Point(17,33),new Point(18,32),new Point(19,30),new Point(20,29),new Point(21,27),new Point(22,26),new Point(24,25),new Point(25,24),new Point(26,22),new Point(27,21),new Point(29,20),new Point(30,19),new Point(32,18),new Point(33,17),new Point(34,16),new Point(36,15),new Point(38,15),new Point(39,14),new Point(41,13),new Point(42,13),new Point(44,12),new Point(46,11),new Point(47,11),new Point(49,11),new Point(51,10),new Point(53,10),new Point(54,10),new Point(56,10),new Point(58,10),new Point(59,10),new Point(61,10),new Point(63,10),new Point(65,10),new Point(66,10),new Point(68,10),new Point(70,11),new Point(72,11),new Point(73,11),new Point(75,12),new Point(77,13),new Point(78,13),new Point(80,14),new Point(81,15),new Point(83,15),new Point(85,16),new Point(86,17),new Point(87,18),new Point(89,19),new Point(90,20),new Point(92,21),new Point(93,22),new Point(94,24),new Point(95,25),new Point(97,26),new Point(98,27),new Point(99,29),new Point(100,30),new Point(101,32),new Point(102,33),new Point(103,34),new Point(104,36),new Point(104,38),new Point(105,39),new Point(106,41),new Point(106,42),new Point(107,44),new Point(108,46),new Point(108,47),new Point(108,49),new Point(109,51),new Point(109,53),new Point(109,54),new Point(109,56),new Point(109,58)),
	new Array(new Point(50,50),new Point(50,51),new Point(50,52),new Point(50,53),new Point(50,54),new Point(50,55),new Point(50,56),new Point(50,57),new Point(50,58),new Point(50,59),new Point(50,60),new Point(50,61),new Point(50,62),new Point(50,63),new Point(50,64),new Point(50,65),new Point(50,66),new Point(50,67),new Point(50,68),new Point(50,69),new Point(50,70),new Point(50,71),new Point(50,72),new Point(50,73),new Point(50,74),new Point(50,75),new Point(50,76),new Point(50,77),new Point(50,78),new Point(50,79),new Point(50,80),new Point(50,81),new Point(50,82),new Point(50,83),new Point(50,84),new Point(50,85),new Point(50,86),new Point(50,87),new Point(50,88),new Point(50,89),new Point(50,90),new Point(50,91),new Point(50,92),new Point(50,93),new Point(50,94),new Point(50,95),new Point(50,96),new Point(50,97),new Point(50,98),new Point(50,99),new Point(50,100),new Point(50,100),new Point(51,100),new Point(52,100),new Point(53,100),new Point(54,100),new Point(55,100),new Point(56,100),new Point(57,100),new Point(58,100),new Point(59,100),new Point(60,100),new Point(61,100),new Point(62,100),new Point(63,100),new Point(64,100),new Point(65,100),new Point(66,100),new Point(67,100),new Point(68,100),new Point(69,100),new Point(70,100),new Point(71,100),new Point(72,100),new Point(73,100),new Point(74,100),new Point(75,100),new Point(76,100),new Point(77,100),new Point(78,100),new Point(79,100),new Point(80,100),new Point(81,100),new Point(82,100),new Point(83,100),new Point(84,100),new Point(85,100),new Point(86,100),new Point(87,100),new Point(88,100),new Point(89,100),new Point(90,100),new Point(91,100),new Point(92,100),new Point(93,100),new Point(94,100),new Point(95,100),new Point(96,100),new Point(97,100),new Point(98,100),new Point(99,100),new Point(100,100),new Point(100,100),new Point(100,99),new Point(100,98),new Point(100,97),new Point(100,96),new Point(100,95),new Point(100,94),new Point(100,93),new Point(100,92),new Point(100,91),new Point(100,90),new Point(100,89),new Point(100,88),new Point(100,87),new Point(100,86),new Point(100,85),new Point(100,84),new Point(100,83),new Point(100,82),new Point(100,81),new Point(100,80),new Point(100,79),new Point(100,78),new Point(100,77),new Point(100,76),new Point(100,75),new Point(100,74),new Point(100,73),new Point(100,72),new Point(100,71),new Point(100,70),new Point(100,69),new Point(100,68),new Point(100,67),new Point(100,66),new Point(100,65),new Point(100,64),new Point(100,63),new Point(100,62),new Point(100,61),new Point(100,60),new Point(100,59),new Point(100,58),new Point(100,57),new Point(100,56),new Point(100,55),new Point(100,54),new Point(100,53),new Point(100,52),new Point(100,51),new Point(100,50),new Point(100,50),new Point(99,50),new Point(98,50),new Point(97,50),new Point(96,50),new Point(95,50),new Point(94,50),new Point(93,50),new Point(92,50),new Point(91,50),new Point(90,50),new Point(89,50),new Point(88,50),new Point(87,50),new Point(86,50),new Point(85,50),new Point(84,50),new Point(83,50),new Point(82,50),new Point(81,50),new Point(80,50),new Point(79,50),new Point(78,50),new Point(77,50),new Point(76,50),new Point(75,50),new Point(74,50),new Point(73,50),new Point(72,50),new Point(71,50),new Point(70,50),new Point(69,50),new Point(68,50),new Point(67,50),new Point(66,50),new Point(65,50),new Point(64,50),new Point(63,50),new Point(62,50),new Point(61,50),new Point(60,50),new Point(59,50),new Point(58,50),new Point(57,50),new Point(56,50),new Point(55,50),new Point(54,50),new Point(53,50),new Point(52,50),new Point(51,50),new Point(50,50)),
	new Array(new Point(50,100),new Point(51,100),new Point(52,100),new Point(53,100),new Point(54,100),new Point(55,100),new Point(56,100),new Point(57,100),new Point(58,100),new Point(59,100),new Point(60,100),new Point(61,100),new Point(62,100),new Point(63,100),new Point(64,100),new Point(65,100),new Point(66,100),new Point(67,100),new Point(68,100),new Point(69,100),new Point(70,100),new Point(71,100),new Point(72,100),new Point(73,100),new Point(74,100),new Point(75,100),new Point(76,100),new Point(77,100),new Point(78,100),new Point(79,100),new Point(80,100),new Point(81,100),new Point(82,100),new Point(83,100),new Point(84,100),new Point(85,100),new Point(86,100),new Point(87,100),new Point(88,100),new Point(89,100),new Point(90,100),new Point(91,100),new Point(92,100),new Point(93,100),new Point(94,100),new Point(95,100),new Point(96,100),new Point(97,100),new Point(98,100),new Point(99,100),new Point(100,100),new Point(99,99),new Point(98,98),new Point(97,97),new Point(96,96),new Point(95,95),new Point(94,94),new Point(93,93),new Point(92,92),new Point(91,91),new Point(90,90),new Point(91,91),new Point(92,92),new Point(93,93),new Point(94,94),new Point(95,95),new Point(96,96),new Point(97,97),new Point(98,98),new Point(99,99),new Point(100,100),new Point(99,101),new Point(98,102),new Point(97,103),new Point(96,104),new Point(95,105),new Point(94,106),new Point(93,107),new Point(92,108),new Point(91,109),new Point(90,110)),
	new Array(new Point(100,100),new Point(99,100),new Point(98,100),new Point(97,100),new Point(96,100),new Point(95,100),new Point(94,100),new Point(93,100),new Point(92,100),new Point(91,100),new Point(90,100),new Point(89,100),new Point(88,100),new Point(87,100),new Point(86,100),new Point(85,100),new Point(84,100),new Point(83,100),new Point(82,100),new Point(81,100),new Point(80,100),new Point(79,100),new Point(78,100),new Point(77,100),new Point(76,100),new Point(75,100),new Point(74,100),new Point(73,100),new Point(72,100),new Point(71,100),new Point(70,100),new Point(69,100),new Point(68,100),new Point(67,100),new Point(66,100),new Point(65,100),new Point(64,100),new Point(63,100),new Point(62,100),new Point(61,100),new Point(60,100),new Point(59,100),new Point(58,100),new Point(57,100),new Point(56,100),new Point(55,100),new Point(54,100),new Point(53,100),new Point(52,100),new Point(51,100),new Point(50,100),new Point(51,99),new Point(52,98),new Point(53,97),new Point(54,96),new Point(55,95),new Point(56,94),new Point(57,93),new Point(58,92),new Point(59,91),new Point(60,90),new Point(59,91),new Point(58,92),new Point(57,93),new Point(56,94),new Point(55,95),new Point(54,96),new Point(53,97),new Point(52,98),new Point(51,99),new Point(50,100),new Point(51,101),new Point(52,102),new Point(53,103),new Point(54,104),new Point(55,105),new Point(56,106),new Point(57,107),new Point(58,108),new Point(59,109),new Point(60,110)),
	new Array(new Point(50,99),new Point(50,98),new Point(50,97),new Point(50,96),new Point(50,95),new Point(50,94),new Point(50,93),new Point(50,92),new Point(50,91),new Point(50,90),new Point(50,89),new Point(50,88),new Point(50,87),new Point(50,86),new Point(50,85),new Point(50,84),new Point(50,83),new Point(50,82),new Point(50,81),new Point(50,80),new Point(50,79),new Point(50,78),new Point(50,77),new Point(50,76),new Point(50,75),new Point(50,74),new Point(50,73),new Point(50,72),new Point(50,71),new Point(50,70),new Point(50,69),new Point(50,68),new Point(50,67),new Point(50,66),new Point(50,65),new Point(50,64),new Point(50,63),new Point(50,62),new Point(50,61),new Point(50,60),new Point(50,59),new Point(50,58),new Point(50,57),new Point(50,56),new Point(50,55),new Point(50,54),new Point(50,53),new Point(50,52),new Point(50,51),new Point(50,50),new Point(49,51),new Point(48,52),new Point(47,53),new Point(46,54),new Point(45,55),new Point(44,56),new Point(43,57),new Point(42,58),new Point(41,59),new Point(40,60),new Point(41,59),new Point(42,58),new Point(43,57),new Point(44,56),new Point(45,55),new Point(46,54),new Point(47,53),new Point(48,52),new Point(49,51),new Point(50,50),new Point(51,51),new Point(52,52),new Point(53,53),new Point(54,54),new Point(55,55),new Point(56,56),new Point(57,57),new Point(58,58),new Point(59,59),new Point(60,60)),
	new Array(new Point(50,51),new Point(50,52),new Point(50,53),new Point(50,54),new Point(50,55),new Point(50,56),new Point(50,57),new Point(50,58),new Point(50,59),new Point(50,60),new Point(50,61),new Point(50,62),new Point(50,63),new Point(50,64),new Point(50,65),new Point(50,66),new Point(50,67),new Point(50,68),new Point(50,69),new Point(50,70),new Point(50,71),new Point(50,72),new Point(50,73),new Point(50,74),new Point(50,75),new Point(50,76),new Point(50,77),new Point(50,78),new Point(50,79),new Point(50,80),new Point(50,81),new Point(50,82),new Point(50,83),new Point(50,84),new Point(50,85),new Point(50,86),new Point(50,87),new Point(50,88),new Point(50,89),new Point(50,90),new Point(50,91),new Point(50,92),new Point(50,93),new Point(50,94),new Point(50,95),new Point(50,96),new Point(50,97),new Point(50,98),new Point(50,99),new Point(50,100),new Point(49,99),new Point(48,98),new Point(47,97),new Point(46,96),new Point(45,95),new Point(44,94),new Point(43,93),new Point(42,92),new Point(41,91),new Point(40,90),new Point(41,91),new Point(42,92),new Point(43,93),new Point(44,94),new Point(45,95),new Point(46,96),new Point(47,97),new Point(48,98),new Point(49,99),new Point(50,100),new Point(51,99),new Point(52,98),new Point(53,97),new Point(54,96),new Point(55,95),new Point(56,94),new Point(57,93),new Point(58,92),new Point(59,91),new Point(60,90))
];

//
// DollarRecognizer class
//
export default class DollarRecognizer // constructor
{
	//
	// one built-in unistroke per gesture type
	//
	constructor(){
		
		this.Unistrokes = new Array(NumUnistrokes);
		this.Unistrokes[0] = new Unistroke("circle1",new Array(new Point(110,59),new Point(109,58),new Point(109,56),new Point(109,54),new Point(109,53),new Point(109,51),new Point(108,49),new Point(108,47),new Point(108,46),new Point(107,44),new Point(106,42),new Point(106,41),new Point(105,39),new Point(104,38),new Point(104,36),new Point(103,34),new Point(102,33),new Point(101,32),new Point(100,30),new Point(99,29),new Point(98,27),new Point(97,26),new Point(95,25),new Point(94,24),new Point(93,22),new Point(92,21),new Point(90,20),new Point(89,19),new Point(87,18),new Point(86,17),new Point(85,16),new Point(83,15),new Point(81,15),new Point(80,14),new Point(78,13),new Point(77,13),new Point(75,12),new Point(73,11),new Point(72,11),new Point(70,11),new Point(68,10),new Point(66,10),new Point(65,10),new Point(63,10),new Point(61,10),new Point(59,10),new Point(58,10),new Point(56,10),new Point(54,10),new Point(53,10),new Point(51,10),new Point(49,11),new Point(47,11),new Point(46,11),new Point(44,12),new Point(42,13),new Point(41,13),new Point(39,14),new Point(38,15),new Point(36,15),new Point(34,16),new Point(33,17),new Point(32,18),new Point(30,19),new Point(29,20),new Point(27,21),new Point(26,22),new Point(25,24),new Point(24,25),new Point(22,26),new Point(21,27),new Point(20,29),new Point(19,30),new Point(18,32),new Point(17,33),new Point(16,34),new Point(15,36),new Point(15,38),new Point(14,39),new Point(13,41),new Point(13,42),new Point(12,44),new Point(11,46),new Point(11,47),new Point(11,49),new Point(10,51),new Point(10,53),new Point(10,54),new Point(10,56),new Point(10,58),new Point(10,60),new Point(10,61),new Point(10,63),new Point(10,65),new Point(10,66),new Point(10,68),new Point(11,70),new Point(11,72),new Point(11,73),new Point(12,75),new Point(13,77),new Point(13,78),new Point(14,80),new Point(15,81),new Point(15,83),new Point(16,85),new Point(17,86),new Point(18,87),new Point(19,89),new Point(20,90),new Point(21,92),new Point(22,93),new Point(24,94),new Point(25,95),new Point(26,97),new Point(27,98),new Point(29,99),new Point(30,100),new Point(32,101),new Point(33,102),new Point(35,103),new Point(36,104),new Point(38,104),new Point(39,105),new Point(41,106),new Point(42,106),new Point(44,107),new Point(46,108),new Point(47,108),new Point(49,108),new Point(51,109),new Point(53,109),new Point(54,109),new Point(56,109),new Point(58,109),new Point(60,110),new Point(61,109),new Point(63,109),new Point(65,109),new Point(66,109),new Point(68,109),new Point(70,108),new Point(72,108),new Point(73,108),new Point(75,107),new Point(77,106),new Point(78,106),new Point(80,105),new Point(81,104),new Point(83,104),new Point(85,103),new Point(86,102),new Point(87,101),new Point(89,100),new Point(90,99),new Point(92,98),new Point(93,97),new Point(94,95),new Point(95,94),new Point(97,93),new Point(98,92),new Point(99,90),new Point(100,89),new Point(101,87),new Point(102,86),new Point(103,85),new Point(104,83),new Point(104,81),new Point(105,80),new Point(106,78),new Point(106,77),new Point(107,75),new Point(108,73),new Point(108,72),new Point(108,70),new Point(109,68),new Point(109,66),new Point(109,65),new Point(109,63),new Point(109,61)));
		this.Unistrokes[1] = new Unistroke("circle2",new Array(new Point(110,60),new Point(109,61),new Point(109,63),new Point(109,65),new Point(109,66),new Point(109,68),new Point(108,70),new Point(108,72),new Point(108,73),new Point(107,75),new Point(106,77),new Point(106,78),new Point(105,80),new Point(104,81),new Point(104,83),new Point(103,85),new Point(102,86),new Point(101,87),new Point(100,89),new Point(99,90),new Point(98,92),new Point(97,93),new Point(95,94),new Point(94,95),new Point(93,97),new Point(92,98),new Point(90,99),new Point(89,100),new Point(87,101),new Point(86,102),new Point(85,103),new Point(83,104),new Point(81,104),new Point(80,105),new Point(78,106),new Point(77,106),new Point(75,107),new Point(73,108),new Point(72,108),new Point(70,108),new Point(68,109),new Point(66,109),new Point(65,109),new Point(63,109),new Point(61,109),new Point(60,110),new Point(58,109),new Point(56,109),new Point(54,109),new Point(53,109),new Point(51,109),new Point(49,108),new Point(47,108),new Point(46,108),new Point(44,107),new Point(42,106),new Point(41,106),new Point(39,105),new Point(38,104),new Point(36,104),new Point(35,103),new Point(33,102),new Point(32,101),new Point(30,100),new Point(29,99),new Point(27,98),new Point(26,97),new Point(25,95),new Point(24,94),new Point(22,93),new Point(21,92),new Point(20,90),new Point(19,89),new Point(18,87),new Point(17,86),new Point(16,85),new Point(15,83),new Point(15,81),new Point(14,80),new Point(13,78),new Point(13,77),new Point(12,75),new Point(11,73),new Point(11,72),new Point(11,70),new Point(10,68),new Point(10,66),new Point(10,65),new Point(10,63),new Point(10,61),new Point(10,60),new Point(10,58),new Point(10,56),new Point(10,54),new Point(10,53),new Point(10,51),new Point(11,49),new Point(11,47),new Point(11,46),new Point(12,44),new Point(13,42),new Point(13,41),new Point(14,39),new Point(15,38),new Point(15,36),new Point(16,34),new Point(17,33),new Point(18,32),new Point(19,30),new Point(20,29),new Point(21,27),new Point(22,26),new Point(24,25),new Point(25,24),new Point(26,22),new Point(27,21),new Point(29,20),new Point(30,19),new Point(32,18),new Point(33,17),new Point(34,16),new Point(36,15),new Point(38,15),new Point(39,14),new Point(41,13),new Point(42,13),new Point(44,12),new Point(46,11),new Point(47,11),new Point(49,11),new Point(51,10),new Point(53,10),new Point(54,10),new Point(56,10),new Point(58,10),new Point(59,10),new Point(61,10),new Point(63,10),new Point(65,10),new Point(66,10),new Point(68,10),new Point(70,11),new Point(72,11),new Point(73,11),new Point(75,12),new Point(77,13),new Point(78,13),new Point(80,14),new Point(81,15),new Point(83,15),new Point(85,16),new Point(86,17),new Point(87,18),new Point(89,19),new Point(90,20),new Point(92,21),new Point(93,22),new Point(94,24),new Point(95,25),new Point(97,26),new Point(98,27),new Point(99,29),new Point(100,30),new Point(101,32),new Point(102,33),new Point(103,34),new Point(104,36),new Point(104,38),new Point(105,39),new Point(106,41),new Point(106,42),new Point(107,44),new Point(108,46),new Point(108,47),new Point(108,49),new Point(109,51),new Point(109,53),new Point(109,54),new Point(109,56),new Point(109,58)));
		this.Unistrokes[2] = new Unistroke("rectangle", new Array(new Point(50,50),new Point(50,51),new Point(50,52),new Point(50,53),new Point(50,54),new Point(50,55),new Point(50,56),new Point(50,57),new Point(50,58),new Point(50,59),new Point(50,60),new Point(50,61),new Point(50,62),new Point(50,63),new Point(50,64),new Point(50,65),new Point(50,66),new Point(50,67),new Point(50,68),new Point(50,69),new Point(50,70),new Point(50,71),new Point(50,72),new Point(50,73),new Point(50,74),new Point(50,75),new Point(50,76),new Point(50,77),new Point(50,78),new Point(50,79),new Point(50,80),new Point(50,81),new Point(50,82),new Point(50,83),new Point(50,84),new Point(50,85),new Point(50,86),new Point(50,87),new Point(50,88),new Point(50,89),new Point(50,90),new Point(50,91),new Point(50,92),new Point(50,93),new Point(50,94),new Point(50,95),new Point(50,96),new Point(50,97),new Point(50,98),new Point(50,99),new Point(50,100),new Point(50,100),new Point(51,100),new Point(52,100),new Point(53,100),new Point(54,100),new Point(55,100),new Point(56,100),new Point(57,100),new Point(58,100),new Point(59,100),new Point(60,100),new Point(61,100),new Point(62,100),new Point(63,100),new Point(64,100),new Point(65,100),new Point(66,100),new Point(67,100),new Point(68,100),new Point(69,100),new Point(70,100),new Point(71,100),new Point(72,100),new Point(73,100),new Point(74,100),new Point(75,100),new Point(76,100),new Point(77,100),new Point(78,100),new Point(79,100),new Point(80,100),new Point(81,100),new Point(82,100),new Point(83,100),new Point(84,100),new Point(85,100),new Point(86,100),new Point(87,100),new Point(88,100),new Point(89,100),new Point(90,100),new Point(91,100),new Point(92,100),new Point(93,100),new Point(94,100),new Point(95,100),new Point(96,100),new Point(97,100),new Point(98,100),new Point(99,100),new Point(100,100),new Point(100,100),new Point(100,99),new Point(100,98),new Point(100,97),new Point(100,96),new Point(100,95),new Point(100,94),new Point(100,93),new Point(100,92),new Point(100,91),new Point(100,90),new Point(100,89),new Point(100,88),new Point(100,87),new Point(100,86),new Point(100,85),new Point(100,84),new Point(100,83),new Point(100,82),new Point(100,81),new Point(100,80),new Point(100,79),new Point(100,78),new Point(100,77),new Point(100,76),new Point(100,75),new Point(100,74),new Point(100,73),new Point(100,72),new Point(100,71),new Point(100,70),new Point(100,69),new Point(100,68),new Point(100,67),new Point(100,66),new Point(100,65),new Point(100,64),new Point(100,63),new Point(100,62),new Point(100,61),new Point(100,60),new Point(100,59),new Point(100,58),new Point(100,57),new Point(100,56),new Point(100,55),new Point(100,54),new Point(100,53),new Point(100,52),new Point(100,51),new Point(100,50),new Point(100,50),new Point(99,50),new Point(98,50),new Point(97,50),new Point(96,50),new Point(95,50),new Point(94,50),new Point(93,50),new Point(92,50),new Point(91,50),new Point(90,50),new Point(89,50),new Point(88,50),new Point(87,50),new Point(86,50),new Point(85,50),new Point(84,50),new Point(83,50),new Point(82,50),new Point(81,50),new Point(80,50),new Point(79,50),new Point(78,50),new Point(77,50),new Point(76,50),new Point(75,50),new Point(74,50),new Point(73,50),new Point(72,50),new Point(71,50),new Point(70,50),new Point(69,50),new Point(68,50),new Point(67,50),new Point(66,50),new Point(65,50),new Point(64,50),new Point(63,50),new Point(62,50),new Point(61,50),new Point(60,50),new Point(59,50),new Point(58,50),new Point(57,50),new Point(56,50),new Point(55,50),new Point(54,50),new Point(53,50),new Point(52,50),new Point(51,50),new Point(50,50)));
		this.Unistrokes[3] = new Unistroke("arrow-right", new Array(new Point(50,100),new Point(51,100),new Point(52,100),new Point(53,100),new Point(54,100),new Point(55,100),new Point(56,100),new Point(57,100),new Point(58,100),new Point(59,100),new Point(60,100),new Point(61,100),new Point(62,100),new Point(63,100),new Point(64,100),new Point(65,100),new Point(66,100),new Point(67,100),new Point(68,100),new Point(69,100),new Point(70,100),new Point(71,100),new Point(72,100),new Point(73,100),new Point(74,100),new Point(75,100),new Point(76,100),new Point(77,100),new Point(78,100),new Point(79,100),new Point(80,100),new Point(81,100),new Point(82,100),new Point(83,100),new Point(84,100),new Point(85,100),new Point(86,100),new Point(87,100),new Point(88,100),new Point(89,100),new Point(90,100),new Point(91,100),new Point(92,100),new Point(93,100),new Point(94,100),new Point(95,100),new Point(96,100),new Point(97,100),new Point(98,100),new Point(99,100),new Point(100,100),new Point(99,99),new Point(98,98),new Point(97,97),new Point(96,96),new Point(95,95),new Point(94,94),new Point(93,93),new Point(92,92),new Point(91,91),new Point(90,90),new Point(91,91),new Point(92,92),new Point(93,93),new Point(94,94),new Point(95,95),new Point(96,96),new Point(97,97),new Point(98,98),new Point(99,99),new Point(100,100),new Point(99,101),new Point(98,102),new Point(97,103),new Point(96,104),new Point(95,105),new Point(94,106),new Point(93,107),new Point(92,108),new Point(91,109),new Point(90,110)));
		this.Unistrokes[4] = new Unistroke("arrow-left",new Array(new Point(100,100),new Point(99,100),new Point(98,100),new Point(97,100),new Point(96,100),new Point(95,100),new Point(94,100),new Point(93,100),new Point(92,100),new Point(91,100),new Point(90,100),new Point(89,100),new Point(88,100),new Point(87,100),new Point(86,100),new Point(85,100),new Point(84,100),new Point(83,100),new Point(82,100),new Point(81,100),new Point(80,100),new Point(79,100),new Point(78,100),new Point(77,100),new Point(76,100),new Point(75,100),new Point(74,100),new Point(73,100),new Point(72,100),new Point(71,100),new Point(70,100),new Point(69,100),new Point(68,100),new Point(67,100),new Point(66,100),new Point(65,100),new Point(64,100),new Point(63,100),new Point(62,100),new Point(61,100),new Point(60,100),new Point(59,100),new Point(58,100),new Point(57,100),new Point(56,100),new Point(55,100),new Point(54,100),new Point(53,100),new Point(52,100),new Point(51,100),new Point(50,100),new Point(51,99),new Point(52,98),new Point(53,97),new Point(54,96),new Point(55,95),new Point(56,94),new Point(57,93),new Point(58,92),new Point(59,91),new Point(60,90),new Point(59,91),new Point(58,92),new Point(57,93),new Point(56,94),new Point(55,95),new Point(54,96),new Point(53,97),new Point(52,98),new Point(51,99),new Point(50,100),new Point(51,101),new Point(52,102),new Point(53,103),new Point(54,104),new Point(55,105),new Point(56,106),new Point(57,107),new Point(58,108),new Point(59,109),new Point(60,110)));
		this.Unistrokes[5] = new Unistroke("arrow-up",new Array(new Point(50,99),new Point(50,98),new Point(50,97),new Point(50,96),new Point(50,95),new Point(50,94),new Point(50,93),new Point(50,92),new Point(50,91),new Point(50,90),new Point(50,89),new Point(50,88),new Point(50,87),new Point(50,86),new Point(50,85),new Point(50,84),new Point(50,83),new Point(50,82),new Point(50,81),new Point(50,80),new Point(50,79),new Point(50,78),new Point(50,77),new Point(50,76),new Point(50,75),new Point(50,74),new Point(50,73),new Point(50,72),new Point(50,71),new Point(50,70),new Point(50,69),new Point(50,68),new Point(50,67),new Point(50,66),new Point(50,65),new Point(50,64),new Point(50,63),new Point(50,62),new Point(50,61),new Point(50,60),new Point(50,59),new Point(50,58),new Point(50,57),new Point(50,56),new Point(50,55),new Point(50,54),new Point(50,53),new Point(50,52),new Point(50,51),new Point(50,50),new Point(49,51),new Point(48,52),new Point(47,53),new Point(46,54),new Point(45,55),new Point(44,56),new Point(43,57),new Point(42,58),new Point(41,59),new Point(40,60),new Point(41,59),new Point(42,58),new Point(43,57),new Point(44,56),new Point(45,55),new Point(46,54),new Point(47,53),new Point(48,52),new Point(49,51),new Point(50,50),new Point(51,51),new Point(52,52),new Point(53,53),new Point(54,54),new Point(55,55),new Point(56,56),new Point(57,57),new Point(58,58),new Point(59,59),new Point(60,60)));
		this.Unistrokes[6] = new Unistroke("arrow-down",new Array(new Point(50,51),new Point(50,52),new Point(50,53),new Point(50,54),new Point(50,55),new Point(50,56),new Point(50,57),new Point(50,58),new Point(50,59),new Point(50,60),new Point(50,61),new Point(50,62),new Point(50,63),new Point(50,64),new Point(50,65),new Point(50,66),new Point(50,67),new Point(50,68),new Point(50,69),new Point(50,70),new Point(50,71),new Point(50,72),new Point(50,73),new Point(50,74),new Point(50,75),new Point(50,76),new Point(50,77),new Point(50,78),new Point(50,79),new Point(50,80),new Point(50,81),new Point(50,82),new Point(50,83),new Point(50,84),new Point(50,85),new Point(50,86),new Point(50,87),new Point(50,88),new Point(50,89),new Point(50,90),new Point(50,91),new Point(50,92),new Point(50,93),new Point(50,94),new Point(50,95),new Point(50,96),new Point(50,97),new Point(50,98),new Point(50,99),new Point(50,100),new Point(49,99),new Point(48,98),new Point(47,97),new Point(46,96),new Point(45,95),new Point(44,94),new Point(43,93),new Point(42,92),new Point(41,91),new Point(40,90),new Point(41,91),new Point(42,92),new Point(43,93),new Point(44,94),new Point(45,95),new Point(46,96),new Point(47,97),new Point(48,98),new Point(49,99),new Point(50,100),new Point(51,99),new Point(52,98),new Point(53,97),new Point(54,96),new Point(55,95),new Point(56,94),new Point(57,93),new Point(58,92),new Point(59,91),new Point(60,90)));
	}
	
	//
	// The $1 Gesture Recognizer API begins here -- 3 methods: Recognize(), AddGesture(), and DeleteUserGestures()
	//
	Recognize(points, useProtractor)
	{

		var t0 = Date.now();
		var candidate = new Unistroke("", points);
		//console.log('hello',this.Unistrokes[0]);
		var u = -1;
		var b = +Infinity;
		for (var i = 0; i < this.Unistrokes.length; i++) // for each unistroke template
		{
			var d;
			if (useProtractor)
				d = OptimalCosineDistance(this.Unistrokes[i].Vector, candidate.Vector); // Protractor
			else
				d = DistanceAtBestAngle(candidate.Points, this.Unistrokes[i], -AngleRange, +AngleRange, AnglePrecision); // Golden Section Search (original $1)
			if (d < b) {
				b = d; // best (least) distance
				u = i; // unistroke index
			}
		}

		//console.log('hello',this.Unistrokes[0]);
		var t1 = Date.now();
		return (u == -1) ? null : points_array[u];
		//return (u == -1) ? new Result(null,"No match.", 0.0, t1-t0) : new Result(this.Unistrokes[u],this.Unistrokes[u].Name, useProtractor ? (1.0 - b) : (1.0 - b / HalfDiagonal), t1-t0);
	}
	AddGesture(name, points)
	{
		this.Unistrokes[this.Unistrokes.length] = new Unistroke(name, points); // append new unistroke
		//console.log(points);
		var num = 0;
		for (var i = 0; i < this.Unistrokes.length; i++) {
			if (this.Unistrokes[i].Name == name)
				num++;
		}
		return num;
	}
	DeleteUserGestures()
	{
		this.Unistrokes.length = NumUnistrokes; // clear any beyond the original set
		return NumUnistrokes;
	}
}
//
// Private helper functions from here on down
//
function Resample(points, n)
{
	var I = PathLength(points) / (n - 1); // interval length
	var D = 0.0;
	var newpoints = new Array(points[0]);
	for (var i = 1; i < points.length; i++)
	{
		var d = Distance(points[i-1], points[i]);
		if ((D + d) >= I)
		{
			var qx = points[i-1].x + ((I - D) / d) * (points[i].x - points[i-1].x);
			var qy = points[i-1].y + ((I - D) / d) * (points[i].y - points[i-1].y);
			var q = new Point(qx, qy);
			newpoints[newpoints.length] = q; // append new point 'q'
			points.splice(i, 0, q); // insert 'q' at position i in points s.t. 'q' will be the next i
			D = 0.0;
		}
		else D += d;
	}
	if (newpoints.length == n - 1) // somtimes we fall a rounding-error short of adding the last point, so add it if so
		newpoints[newpoints.length] = new Point(points[points.length - 1].x, points[points.length - 1].y);
	return newpoints;
}
function IndicativeAngle(points)
{
	var c = Centroid(points);
	return Math.atan2(c.y - points[0].y, c.x - points[0].x);
}
function RotateBy(points, radians) // rotates points around centroid
{
	var c = Centroid(points);
	var cos = Math.cos(radians);
	var sin = Math.sin(radians);
	var newpoints = new Array();
	for (var i = 0; i < points.length; i++) {
		var qx = (points[i].x - c.x) * cos - (points[i].y - c.y) * sin + c.x
		var qy = (points[i].x - c.x) * sin + (points[i].y - c.y) * cos + c.y;
		newpoints[newpoints.length] = new Point(qx, qy);
	}
	return newpoints;
}
function ScaleTo(points, size) // non-uniform scale; assumes 2D gestures (i.e., no lines)
{
	var B = BoundingBox(points);
	var newpoints = new Array();
	for (var i = 0; i < points.length; i++) {
		var qx = points[i].x * (size / B.Width);
		var qy = points[i].y * (size / B.Height);
		newpoints[newpoints.length] = new Point(qx, qy);
	}
	return newpoints;
}
function TranslateTo(points, pt) // translates points' centroid
{
	var c = Centroid(points);
	var newpoints = new Array();
	for (var i = 0; i < points.length; i++) {
		var qx = points[i].x + pt.x - c.x;
		var qy = points[i].y + pt.y - c.y;
		newpoints[newpoints.length] = new Point(qx, qy);
	}
	return newpoints;
}
function Vectorize(points) // for Protractor
{
	var sum = 0.0;
	var vector = new Array();
	for (var i = 0; i < points.length; i++) {
		vector[vector.length] = points[i].x;
		vector[vector.length] = points[i].y;
		sum += points[i].x * points[i].x + points[i].y * points[i].y;
	}
	var magnitude = Math.sqrt(sum);
	for (var i = 0; i < vector.length; i++)
		vector[i] /= magnitude;
	return vector;
}
function OptimalCosineDistance(v1, v2) // for Protractor
{
	var a = 0.0;
	var b = 0.0;
	for (var i = 0; i < v1.length; i += 2) {
		a += v1[i] * v2[i] + v1[i+1] * v2[i+1];
		b += v1[i] * v2[i+1] - v1[i+1] * v2[i];
	}
	var angle = Math.atan(b / a);
	return Math.acos(a * Math.cos(angle) + b * Math.sin(angle));
}
function DistanceAtBestAngle(points, T, a, b, threshold)
{
	var x1 = Phi * a + (1.0 - Phi) * b;
	var f1 = DistanceAtAngle(points, T, x1);
	var x2 = (1.0 - Phi) * a + Phi * b;
	var f2 = DistanceAtAngle(points, T, x2);
	while (Math.abs(b - a) > threshold)
	{
		if (f1 < f2) {
			b = x2;
			x2 = x1;
			f2 = f1;
			x1 = Phi * a + (1.0 - Phi) * b;
			f1 = DistanceAtAngle(points, T, x1);
		} else {
			a = x1;
			x1 = x2;
			f1 = f2;
			x2 = (1.0 - Phi) * a + Phi * b;
			f2 = DistanceAtAngle(points, T, x2);
		}
	}
	return Math.min(f1, f2);
}
function DistanceAtAngle(points, T, radians)
{
	var newpoints = RotateBy(points, radians);
	return PathDistance(newpoints, T.Points);
}
function Centroid(points)
{
	var x = 0.0, y = 0.0;
	for (var i = 0; i < points.length; i++) {
		x += points[i].x;
		y += points[i].y;
	}
	x /= points.length;
	y /= points.length;
	return new Point(x, y);
}
function BoundingBox(points)
{
	var minx = +Infinity, maxx = -Infinity, miny = +Infinity, maxy = -Infinity;
	for (var i = 0; i < points.length; i++) {
		minx = Math.min(minx, points[i].x);
		miny = Math.min(miny, points[i].y);
		maxx = Math.max(maxx, points[i].x);
		maxy = Math.max(maxy, points[i].y);
	}
	return new Rectangle(minx, miny, maxx - minx, maxy - miny);
}
function PathDistance(pts1, pts2)
{
	var d = 0.0;
	for (var i = 0; i < pts1.length; i++) // assumes pts1.length == pts2.length
		d += Distance(pts1[i], pts2[i]);
	return d / pts1.length;
}
function PathLength(points)
{
	var d = 0.0;
	for (var i = 1; i < points.length; i++)
		d += Distance(points[i - 1], points[i]);
	return d;
}
function Distance(p1, p2)
{
	var dx = p2.x - p1.x;
	var dy = p2.y - p1.y;
	return Math.sqrt(dx * dx + dy * dy);
}
function Deg2Rad(d) { return (d * Math.PI / 180.0); }