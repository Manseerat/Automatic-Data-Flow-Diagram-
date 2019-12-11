/**
 * The $P Point-Cloud Recognizer (JavaScript version)
 *
 *  Radu-Daniel Vatavu, Ph.D.
 *  University Stefan cel Mare of Suceava
 *  Suceava 720229, Romania
 *  vatavu@eed.usv.ro
 *
 *  Lisa Anthony, Ph.D.
 *  UMBC
 *  Information Systems Department
 *  1000 Hilltop Circle
 *  Baltimore, MD 21250
 *  lanthony@umbc.edu
 *
 *  Jacob O. Wobbrock, Ph.D.
 *  The Information School
 *  University of Washington
 *  Seattle, WA 98195-2840
 *  wobbrock@uw.edu
 *
 * The academic publication for the $P recognizer, and what should be
 * used to cite it, is:
 *
 *     Vatavu, R.-D., Anthony, L. and Wobbrock, J.O. (2012).
 *     Gestures as point clouds: A $P recognizer for user interface
 *     prototypes. Proceedings of the ACM Int'l Conference on
 *     Multimodal Interfaces (ICMI '12). Santa Monica, California
 *     (October 22-26, 2012). New york: ACM Press, pp. 273-280.
 *     https://dl.acm.org/citation.cfm?id=2388732
 *
 * This software is distributed under the "New BSD License" agreement:
 *
 * Copyright (C) 2012, Radu-Daniel Vatavu, Lisa Anthony, and
 * Jacob O. Wobbrock. All rights reserved. Last updated July 14, 2018.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *    * Redistributions of source code must retain the above copyright
 *      notice, this list of conditions and the following disclaimer.
 *    * Redistributions in binary form must reproduce the above copyright
 *      notice, this list of conditions and the following disclaimer in the
 *      documentation and/or other materials provided with the distribution.
 *    * Neither the names of the University Stefan cel Mare of Suceava,
 *	University of Washington, nor UMBC, nor the names of its contributors
 *	may be used to endorse or promote products derived from this software
 *	without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED By THE COPyRIGHT HOLDERS AND CONTRIBUTORS "AS
 * IS" AND ANy ExPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
 * THE IMPLIED WARRANTIES OF MERCHANTABILITy AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL Radu-Daniel Vatavu OR Lisa Anthony
 * OR Jacob O. Wobbrock BE LIABLE FOR ANy DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * ExEMPLARy, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT
 * OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANy THEORy OF LIABILITy, WHETHER IN CONTRACT,
 * STRICT LIABILITy, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANy WAy
 * OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITy OF
 * SUCH DAMAGE.
**/
//
// Point class
//
function Point(x, y, id) // constructor
{
	this.x = x;
	this.y = y;
	this.ID = id; // stroke ID to which this point belongs (1,2,3,etc.)
}
//
// PointCloud class: a point-cloud template
//
function PointCloud(name, points) // constructor
{
	this.Name = name;
	this.Points = Resample(points, NumPoints);
	this.Points = Scale(this.Points);
	this.Points = TranslateTo(this.Points, Origin);
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
// PDollarRecognizer constants
//
const NumPointClouds = 16;
const NumPoints = 32;
const Origin = new Point(0,0,0);
const points_array = [
	new Array(new Point(110,59),new Point(109,58),new Point(109,56),new Point(109,54),new Point(109,53),new Point(109,51),new Point(108,49),new Point(108,47),new Point(108,46),new Point(107,44),new Point(106,42),new Point(106,41),new Point(105,39),new Point(104,38),new Point(104,36),new Point(103,34),new Point(102,33),new Point(101,32),new Point(100,30),new Point(99,29),new Point(98,27),new Point(97,26),new Point(95,25),new Point(94,24),new Point(93,22),new Point(92,21),new Point(90,20),new Point(89,19),new Point(87,18),new Point(86,17),new Point(85,16),new Point(83,15),new Point(81,15),new Point(80,14),new Point(78,13),new Point(77,13),new Point(75,12),new Point(73,11),new Point(72,11),new Point(70,11),new Point(68,10),new Point(66,10),new Point(65,10),new Point(63,10),new Point(61,10),new Point(59,10),new Point(58,10),new Point(56,10),new Point(54,10),new Point(53,10),new Point(51,10),new Point(49,11),new Point(47,11),new Point(46,11),new Point(44,12),new Point(42,13),new Point(41,13),new Point(39,14),new Point(38,15),new Point(36,15),new Point(34,16),new Point(33,17),new Point(32,18),new Point(30,19),new Point(29,20),new Point(27,21),new Point(26,22),new Point(25,24),new Point(24,25),new Point(22,26),new Point(21,27),new Point(20,29),new Point(19,30),new Point(18,32),new Point(17,33),new Point(16,34),new Point(15,36),new Point(15,38),new Point(14,39),new Point(13,41),new Point(13,42),new Point(12,44),new Point(11,46),new Point(11,47),new Point(11,49),new Point(10,51),new Point(10,53),new Point(10,54),new Point(10,56),new Point(10,58),new Point(10,60),new Point(10,61),new Point(10,63),new Point(10,65),new Point(10,66),new Point(10,68),new Point(11,70),new Point(11,72),new Point(11,73),new Point(12,75),new Point(13,77),new Point(13,78),new Point(14,80),new Point(15,81),new Point(15,83),new Point(16,85),new Point(17,86),new Point(18,87),new Point(19,89),new Point(20,90),new Point(21,92),new Point(22,93),new Point(24,94),new Point(25,95),new Point(26,97),new Point(27,98),new Point(29,99),new Point(30,100),new Point(32,101),new Point(33,102),new Point(35,103),new Point(36,104),new Point(38,104),new Point(39,105),new Point(41,106),new Point(42,106),new Point(44,107),new Point(46,108),new Point(47,108),new Point(49,108),new Point(51,109),new Point(53,109),new Point(54,109),new Point(56,109),new Point(58,109),new Point(60,110),new Point(61,109),new Point(63,109),new Point(65,109),new Point(66,109),new Point(68,109),new Point(70,108),new Point(72,108),new Point(73,108),new Point(75,107),new Point(77,106),new Point(78,106),new Point(80,105),new Point(81,104),new Point(83,104),new Point(85,103),new Point(86,102),new Point(87,101),new Point(89,100),new Point(90,99),new Point(92,98),new Point(93,97),new Point(94,95),new Point(95,94),new Point(97,93),new Point(98,92),new Point(99,90),new Point(100,89),new Point(101,87),new Point(102,86),new Point(103,85),new Point(104,83),new Point(104,81),new Point(105,80),new Point(106,78),new Point(106,77),new Point(107,75),new Point(108,73),new Point(108,72),new Point(108,70),new Point(109,68),new Point(109,66),new Point(109,65),new Point(109,63),new Point(109,61)),
	new Array(new Point(110,60),new Point(109,61),new Point(109,63),new Point(109,65),new Point(109,66),new Point(109,68),new Point(108,70),new Point(108,72),new Point(108,73),new Point(107,75),new Point(106,77),new Point(106,78),new Point(105,80),new Point(104,81),new Point(104,83),new Point(103,85),new Point(102,86),new Point(101,87),new Point(100,89),new Point(99,90),new Point(98,92),new Point(97,93),new Point(95,94),new Point(94,95),new Point(93,97),new Point(92,98),new Point(90,99),new Point(89,100),new Point(87,101),new Point(86,102),new Point(85,103),new Point(83,104),new Point(81,104),new Point(80,105),new Point(78,106),new Point(77,106),new Point(75,107),new Point(73,108),new Point(72,108),new Point(70,108),new Point(68,109),new Point(66,109),new Point(65,109),new Point(63,109),new Point(61,109),new Point(60,110),new Point(58,109),new Point(56,109),new Point(54,109),new Point(53,109),new Point(51,109),new Point(49,108),new Point(47,108),new Point(46,108),new Point(44,107),new Point(42,106),new Point(41,106),new Point(39,105),new Point(38,104),new Point(36,104),new Point(35,103),new Point(33,102),new Point(32,101),new Point(30,100),new Point(29,99),new Point(27,98),new Point(26,97),new Point(25,95),new Point(24,94),new Point(22,93),new Point(21,92),new Point(20,90),new Point(19,89),new Point(18,87),new Point(17,86),new Point(16,85),new Point(15,83),new Point(15,81),new Point(14,80),new Point(13,78),new Point(13,77),new Point(12,75),new Point(11,73),new Point(11,72),new Point(11,70),new Point(10,68),new Point(10,66),new Point(10,65),new Point(10,63),new Point(10,61),new Point(10,60),new Point(10,58),new Point(10,56),new Point(10,54),new Point(10,53),new Point(10,51),new Point(11,49),new Point(11,47),new Point(11,46),new Point(12,44),new Point(13,42),new Point(13,41),new Point(14,39),new Point(15,38),new Point(15,36),new Point(16,34),new Point(17,33),new Point(18,32),new Point(19,30),new Point(20,29),new Point(21,27),new Point(22,26),new Point(24,25),new Point(25,24),new Point(26,22),new Point(27,21),new Point(29,20),new Point(30,19),new Point(32,18),new Point(33,17),new Point(34,16),new Point(36,15),new Point(38,15),new Point(39,14),new Point(41,13),new Point(42,13),new Point(44,12),new Point(46,11),new Point(47,11),new Point(49,11),new Point(51,10),new Point(53,10),new Point(54,10),new Point(56,10),new Point(58,10),new Point(59,10),new Point(61,10),new Point(63,10),new Point(65,10),new Point(66,10),new Point(68,10),new Point(70,11),new Point(72,11),new Point(73,11),new Point(75,12),new Point(77,13),new Point(78,13),new Point(80,14),new Point(81,15),new Point(83,15),new Point(85,16),new Point(86,17),new Point(87,18),new Point(89,19),new Point(90,20),new Point(92,21),new Point(93,22),new Point(94,24),new Point(95,25),new Point(97,26),new Point(98,27),new Point(99,29),new Point(100,30),new Point(101,32),new Point(102,33),new Point(103,34),new Point(104,36),new Point(104,38),new Point(105,39),new Point(106,41),new Point(106,42),new Point(107,44),new Point(108,46),new Point(108,47),new Point(108,49),new Point(109,51),new Point(109,53),new Point(109,54),new Point(109,56),new Point(109,58)),
	new Array(new Point(50,50),new Point(50,51),new Point(50,52),new Point(50,53),new Point(50,54),new Point(50,55),new Point(50,56),new Point(50,57),new Point(50,58),new Point(50,59),new Point(50,60),new Point(50,61),new Point(50,62),new Point(50,63),new Point(50,64),new Point(50,65),new Point(50,66),new Point(50,67),new Point(50,68),new Point(50,69),new Point(50,70),new Point(50,71),new Point(50,72),new Point(50,73),new Point(50,74),new Point(50,75),new Point(50,76),new Point(50,77),new Point(50,78),new Point(50,79),new Point(50,80),new Point(50,81),new Point(50,82),new Point(50,83),new Point(50,84),new Point(50,85),new Point(50,86),new Point(50,87),new Point(50,88),new Point(50,89),new Point(50,90),new Point(50,91),new Point(50,92),new Point(50,93),new Point(50,94),new Point(50,95),new Point(50,96),new Point(50,97),new Point(50,98),new Point(50,99),new Point(50,100),new Point(50,100),new Point(51,100),new Point(52,100),new Point(53,100),new Point(54,100),new Point(55,100),new Point(56,100),new Point(57,100),new Point(58,100),new Point(59,100),new Point(60,100),new Point(61,100),new Point(62,100),new Point(63,100),new Point(64,100),new Point(65,100),new Point(66,100),new Point(67,100),new Point(68,100),new Point(69,100),new Point(70,100),new Point(71,100),new Point(72,100),new Point(73,100),new Point(74,100),new Point(75,100),new Point(76,100),new Point(77,100),new Point(78,100),new Point(79,100),new Point(80,100),new Point(81,100),new Point(82,100),new Point(83,100),new Point(84,100),new Point(85,100),new Point(86,100),new Point(87,100),new Point(88,100),new Point(89,100),new Point(90,100),new Point(91,100),new Point(92,100),new Point(93,100),new Point(94,100),new Point(95,100),new Point(96,100),new Point(97,100),new Point(98,100),new Point(99,100),new Point(100,100),new Point(100,100),new Point(100,99),new Point(100,98),new Point(100,97),new Point(100,96),new Point(100,95),new Point(100,94),new Point(100,93),new Point(100,92),new Point(100,91),new Point(100,90),new Point(100,89),new Point(100,88),new Point(100,87),new Point(100,86),new Point(100,85),new Point(100,84),new Point(100,83),new Point(100,82),new Point(100,81),new Point(100,80),new Point(100,79),new Point(100,78),new Point(100,77),new Point(100,76),new Point(100,75),new Point(100,74),new Point(100,73),new Point(100,72),new Point(100,71),new Point(100,70),new Point(100,69),new Point(100,68),new Point(100,67),new Point(100,66),new Point(100,65),new Point(100,64),new Point(100,63),new Point(100,62),new Point(100,61),new Point(100,60),new Point(100,59),new Point(100,58),new Point(100,57),new Point(100,56),new Point(100,55),new Point(100,54),new Point(100,53),new Point(100,52),new Point(100,51),new Point(100,50),new Point(100,50),new Point(99,50),new Point(98,50),new Point(97,50),new Point(96,50),new Point(95,50),new Point(94,50),new Point(93,50),new Point(92,50),new Point(91,50),new Point(90,50),new Point(89,50),new Point(88,50),new Point(87,50),new Point(86,50),new Point(85,50),new Point(84,50),new Point(83,50),new Point(82,50),new Point(81,50),new Point(80,50),new Point(79,50),new Point(78,50),new Point(77,50),new Point(76,50),new Point(75,50),new Point(74,50),new Point(73,50),new Point(72,50),new Point(71,50),new Point(70,50),new Point(69,50),new Point(68,50),new Point(67,50),new Point(66,50),new Point(65,50),new Point(64,50),new Point(63,50),new Point(62,50),new Point(61,50),new Point(60,50),new Point(59,50),new Point(58,50),new Point(57,50),new Point(56,50),new Point(55,50),new Point(54,50),new Point(53,50),new Point(52,50),new Point(51,50),new Point(50,50)),
	new Array(new Point(50,100),new Point(51,100),new Point(52,100),new Point(53,100),new Point(54,100),new Point(55,100),new Point(56,100),new Point(57,100),new Point(58,100),new Point(59,100),new Point(60,100),new Point(61,100),new Point(62,100),new Point(63,100),new Point(64,100),new Point(65,100),new Point(66,100),new Point(67,100),new Point(68,100),new Point(69,100),new Point(70,100),new Point(71,100),new Point(72,100),new Point(73,100),new Point(74,100),new Point(75,100),new Point(76,100),new Point(77,100),new Point(78,100),new Point(79,100),new Point(80,100),new Point(81,100),new Point(82,100),new Point(83,100),new Point(84,100),new Point(85,100),new Point(86,100),new Point(87,100),new Point(88,100),new Point(89,100),new Point(90,100),new Point(91,100),new Point(92,100),new Point(93,100),new Point(94,100),new Point(95,100),new Point(96,100),new Point(97,100),new Point(98,100),new Point(99,100),new Point(100,100),new Point(99,99),new Point(98,98),new Point(97,97),new Point(96,96),new Point(95,95),new Point(94,94),new Point(93,93),new Point(92,92),new Point(91,91),new Point(90,90),new Point(91,91),new Point(92,92),new Point(93,93),new Point(94,94),new Point(95,95),new Point(96,96),new Point(97,97),new Point(98,98),new Point(99,99),new Point(100,100),new Point(99,101),new Point(98,102),new Point(97,103),new Point(96,104),new Point(95,105),new Point(94,106),new Point(93,107),new Point(92,108),new Point(91,109),new Point(90,110)),
	new Array(new Point(100,100),new Point(99,100),new Point(98,100),new Point(97,100),new Point(96,100),new Point(95,100),new Point(94,100),new Point(93,100),new Point(92,100),new Point(91,100),new Point(90,100),new Point(89,100),new Point(88,100),new Point(87,100),new Point(86,100),new Point(85,100),new Point(84,100),new Point(83,100),new Point(82,100),new Point(81,100),new Point(80,100),new Point(79,100),new Point(78,100),new Point(77,100),new Point(76,100),new Point(75,100),new Point(74,100),new Point(73,100),new Point(72,100),new Point(71,100),new Point(70,100),new Point(69,100),new Point(68,100),new Point(67,100),new Point(66,100),new Point(65,100),new Point(64,100),new Point(63,100),new Point(62,100),new Point(61,100),new Point(60,100),new Point(59,100),new Point(58,100),new Point(57,100),new Point(56,100),new Point(55,100),new Point(54,100),new Point(53,100),new Point(52,100),new Point(51,100),new Point(50,100),new Point(51,99),new Point(52,98),new Point(53,97),new Point(54,96),new Point(55,95),new Point(56,94),new Point(57,93),new Point(58,92),new Point(59,91),new Point(60,90),new Point(59,91),new Point(58,92),new Point(57,93),new Point(56,94),new Point(55,95),new Point(54,96),new Point(53,97),new Point(52,98),new Point(51,99),new Point(50,100),new Point(51,101),new Point(52,102),new Point(53,103),new Point(54,104),new Point(55,105),new Point(56,106),new Point(57,107),new Point(58,108),new Point(59,109),new Point(60,110)),
	new Array(new Point(50,99),new Point(50,98),new Point(50,97),new Point(50,96),new Point(50,95),new Point(50,94),new Point(50,93),new Point(50,92),new Point(50,91),new Point(50,90),new Point(50,89),new Point(50,88),new Point(50,87),new Point(50,86),new Point(50,85),new Point(50,84),new Point(50,83),new Point(50,82),new Point(50,81),new Point(50,80),new Point(50,79),new Point(50,78),new Point(50,77),new Point(50,76),new Point(50,75),new Point(50,74),new Point(50,73),new Point(50,72),new Point(50,71),new Point(50,70),new Point(50,69),new Point(50,68),new Point(50,67),new Point(50,66),new Point(50,65),new Point(50,64),new Point(50,63),new Point(50,62),new Point(50,61),new Point(50,60),new Point(50,59),new Point(50,58),new Point(50,57),new Point(50,56),new Point(50,55),new Point(50,54),new Point(50,53),new Point(50,52),new Point(50,51),new Point(50,50),new Point(49,51),new Point(48,52),new Point(47,53),new Point(46,54),new Point(45,55),new Point(44,56),new Point(43,57),new Point(42,58),new Point(41,59),new Point(40,60),new Point(41,59),new Point(42,58),new Point(43,57),new Point(44,56),new Point(45,55),new Point(46,54),new Point(47,53),new Point(48,52),new Point(49,51),new Point(50,50),new Point(51,51),new Point(52,52),new Point(53,53),new Point(54,54),new Point(55,55),new Point(56,56),new Point(57,57),new Point(58,58),new Point(59,59),new Point(60,60)),
	new Array(new Point(50,51),new Point(50,52),new Point(50,53),new Point(50,54),new Point(50,55),new Point(50,56),new Point(50,57),new Point(50,58),new Point(50,59),new Point(50,60),new Point(50,61),new Point(50,62),new Point(50,63),new Point(50,64),new Point(50,65),new Point(50,66),new Point(50,67),new Point(50,68),new Point(50,69),new Point(50,70),new Point(50,71),new Point(50,72),new Point(50,73),new Point(50,74),new Point(50,75),new Point(50,76),new Point(50,77),new Point(50,78),new Point(50,79),new Point(50,80),new Point(50,81),new Point(50,82),new Point(50,83),new Point(50,84),new Point(50,85),new Point(50,86),new Point(50,87),new Point(50,88),new Point(50,89),new Point(50,90),new Point(50,91),new Point(50,92),new Point(50,93),new Point(50,94),new Point(50,95),new Point(50,96),new Point(50,97),new Point(50,98),new Point(50,99),new Point(50,100),new Point(49,99),new Point(48,98),new Point(47,97),new Point(46,96),new Point(45,95),new Point(44,94),new Point(43,93),new Point(42,92),new Point(41,91),new Point(40,90),new Point(41,91),new Point(42,92),new Point(43,93),new Point(44,94),new Point(45,95),new Point(46,96),new Point(47,97),new Point(48,98),new Point(49,99),new Point(50,100),new Point(51,99),new Point(52,98),new Point(53,97),new Point(54,96),new Point(55,95),new Point(56,94),new Point(57,93),new Point(58,92),new Point(59,91),new Point(60,90))
];
//
// PDollarRecognizer class
//
export default class PDollarRecognizer // constructor
{
	//
	// one predefined point-cloud for each gesture
	//
	constructor(){
		this.PointClouds = new Array(NumPointClouds);
	this.PointClouds[0] = new PointCloud("circle1", new Array(
		new Point(110,59),new Point(109,58),new Point(109,56),new Point(109,54),new Point(109,53),new Point(109,51),new Point(108,49),new Point(108,47),new Point(108,46),new Point(107,44),new Point(106,42),new Point(106,41),new Point(105,39),new Point(104,38),new Point(104,36),new Point(103,34),new Point(102,33),new Point(101,32),new Point(100,30),new Point(99,29),new Point(98,27),new Point(97,26),new Point(95,25),new Point(94,24),new Point(93,22),new Point(92,21),new Point(90,20),new Point(89,19),new Point(87,18),new Point(86,17),new Point(85,16),new Point(83,15),new Point(81,15),new Point(80,14),new Point(78,13),new Point(77,13),new Point(75,12),new Point(73,11),new Point(72,11),new Point(70,11),new Point(68,10),new Point(66,10),new Point(65,10),new Point(63,10),new Point(61,10),new Point(59,10),new Point(58,10),new Point(56,10),new Point(54,10),new Point(53,10),new Point(51,10),new Point(49,11),new Point(47,11),new Point(46,11),new Point(44,12),new Point(42,13),new Point(41,13),new Point(39,14),new Point(38,15),new Point(36,15),new Point(34,16),new Point(33,17),new Point(32,18),new Point(30,19),new Point(29,20),new Point(27,21),new Point(26,22),new Point(25,24),new Point(24,25),new Point(22,26),new Point(21,27),new Point(20,29),new Point(19,30),new Point(18,32),new Point(17,33),new Point(16,34),new Point(15,36),new Point(15,38),new Point(14,39),new Point(13,41),new Point(13,42),new Point(12,44),new Point(11,46),new Point(11,47),new Point(11,49),new Point(10,51),new Point(10,53),new Point(10,54),new Point(10,56),new Point(10,58),new Point(10,60),new Point(10,61),new Point(10,63),new Point(10,65),new Point(10,66),new Point(10,68),new Point(11,70),new Point(11,72),new Point(11,73),new Point(12,75),new Point(13,77),new Point(13,78),new Point(14,80),new Point(15,81),new Point(15,83),new Point(16,85),new Point(17,86),new Point(18,87),new Point(19,89),new Point(20,90),new Point(21,92),new Point(22,93),new Point(24,94),new Point(25,95),new Point(26,97),new Point(27,98),new Point(29,99),new Point(30,100),new Point(32,101),new Point(33,102),new Point(35,103),new Point(36,104),new Point(38,104),new Point(39,105),new Point(41,106),new Point(42,106),new Point(44,107),new Point(46,108),new Point(47,108),new Point(49,108),new Point(51,109),new Point(53,109),new Point(54,109),new Point(56,109),new Point(58,109),new Point(60,110),new Point(61,109),new Point(63,109),new Point(65,109),new Point(66,109),new Point(68,109),new Point(70,108),new Point(72,108),new Point(73,108),new Point(75,107),new Point(77,106),new Point(78,106),new Point(80,105),new Point(81,104),new Point(83,104),new Point(85,103),new Point(86,102),new Point(87,101),new Point(89,100),new Point(90,99),new Point(92,98),new Point(93,97),new Point(94,95),new Point(95,94),new Point(97,93),new Point(98,92),new Point(99,90),new Point(100,89),new Point(101,87),new Point(102,86),new Point(103,85),new Point(104,83),new Point(104,81),new Point(105,80),new Point(106,78),new Point(106,77),new Point(107,75),new Point(108,73),new Point(108,72),new Point(108,70),new Point(109,68),new Point(109,66),new Point(109,65),new Point(109,63),new Point(109,61))
	);
	this.PointClouds[1] = new PointCloud("circle2", new Array(
		new Point(110,60),new Point(109,61),new Point(109,63),new Point(109,65),new Point(109,66),new Point(109,68),new Point(108,70),new Point(108,72),new Point(108,73),new Point(107,75),new Point(106,77),new Point(106,78),new Point(105,80),new Point(104,81),new Point(104,83),new Point(103,85),new Point(102,86),new Point(101,87),new Point(100,89),new Point(99,90),new Point(98,92),new Point(97,93),new Point(95,94),new Point(94,95),new Point(93,97),new Point(92,98),new Point(90,99),new Point(89,100),new Point(87,101),new Point(86,102),new Point(85,103),new Point(83,104),new Point(81,104),new Point(80,105),new Point(78,106),new Point(77,106),new Point(75,107),new Point(73,108),new Point(72,108),new Point(70,108),new Point(68,109),new Point(66,109),new Point(65,109),new Point(63,109),new Point(61,109),new Point(60,110),new Point(58,109),new Point(56,109),new Point(54,109),new Point(53,109),new Point(51,109),new Point(49,108),new Point(47,108),new Point(46,108),new Point(44,107),new Point(42,106),new Point(41,106),new Point(39,105),new Point(38,104),new Point(36,104),new Point(35,103),new Point(33,102),new Point(32,101),new Point(30,100),new Point(29,99),new Point(27,98),new Point(26,97),new Point(25,95),new Point(24,94),new Point(22,93),new Point(21,92),new Point(20,90),new Point(19,89),new Point(18,87),new Point(17,86),new Point(16,85),new Point(15,83),new Point(15,81),new Point(14,80),new Point(13,78),new Point(13,77),new Point(12,75),new Point(11,73),new Point(11,72),new Point(11,70),new Point(10,68),new Point(10,66),new Point(10,65),new Point(10,63),new Point(10,61),new Point(10,60),new Point(10,58),new Point(10,56),new Point(10,54),new Point(10,53),new Point(10,51),new Point(11,49),new Point(11,47),new Point(11,46),new Point(12,44),new Point(13,42),new Point(13,41),new Point(14,39),new Point(15,38),new Point(15,36),new Point(16,34),new Point(17,33),new Point(18,32),new Point(19,30),new Point(20,29),new Point(21,27),new Point(22,26),new Point(24,25),new Point(25,24),new Point(26,22),new Point(27,21),new Point(29,20),new Point(30,19),new Point(32,18),new Point(33,17),new Point(34,16),new Point(36,15),new Point(38,15),new Point(39,14),new Point(41,13),new Point(42,13),new Point(44,12),new Point(46,11),new Point(47,11),new Point(49,11),new Point(51,10),new Point(53,10),new Point(54,10),new Point(56,10),new Point(58,10),new Point(59,10),new Point(61,10),new Point(63,10),new Point(65,10),new Point(66,10),new Point(68,10),new Point(70,11),new Point(72,11),new Point(73,11),new Point(75,12),new Point(77,13),new Point(78,13),new Point(80,14),new Point(81,15),new Point(83,15),new Point(85,16),new Point(86,17),new Point(87,18),new Point(89,19),new Point(90,20),new Point(92,21),new Point(93,22),new Point(94,24),new Point(95,25),new Point(97,26),new Point(98,27),new Point(99,29),new Point(100,30),new Point(101,32),new Point(102,33),new Point(103,34),new Point(104,36),new Point(104,38),new Point(105,39),new Point(106,41),new Point(106,42),new Point(107,44),new Point(108,46),new Point(108,47),new Point(108,49),new Point(109,51),new Point(109,53),new Point(109,54),new Point(109,56),new Point(109,58)
	));
	this.PointClouds[2] = new PointCloud("rectangle", new Array(
		new Point(50,50),new Point(50,51),new Point(50,52),new Point(50,53),new Point(50,54),new Point(50,55),new Point(50,56),new Point(50,57),new Point(50,58),new Point(50,59),new Point(50,60),new Point(50,61),new Point(50,62),new Point(50,63),new Point(50,64),new Point(50,65),new Point(50,66),new Point(50,67),new Point(50,68),new Point(50,69),new Point(50,70),new Point(50,71),new Point(50,72),new Point(50,73),new Point(50,74),new Point(50,75),new Point(50,76),new Point(50,77),new Point(50,78),new Point(50,79),new Point(50,80),new Point(50,81),new Point(50,82),new Point(50,83),new Point(50,84),new Point(50,85),new Point(50,86),new Point(50,87),new Point(50,88),new Point(50,89),new Point(50,90),new Point(50,91),new Point(50,92),new Point(50,93),new Point(50,94),new Point(50,95),new Point(50,96),new Point(50,97),new Point(50,98),new Point(50,99),new Point(50,100),new Point(50,100),new Point(51,100),new Point(52,100),new Point(53,100),new Point(54,100),new Point(55,100),new Point(56,100),new Point(57,100),new Point(58,100),new Point(59,100),new Point(60,100),new Point(61,100),new Point(62,100),new Point(63,100),new Point(64,100),new Point(65,100),new Point(66,100),new Point(67,100),new Point(68,100),new Point(69,100),new Point(70,100),new Point(71,100),new Point(72,100),new Point(73,100),new Point(74,100),new Point(75,100),new Point(76,100),new Point(77,100),new Point(78,100),new Point(79,100),new Point(80,100),new Point(81,100),new Point(82,100),new Point(83,100),new Point(84,100),new Point(85,100),new Point(86,100),new Point(87,100),new Point(88,100),new Point(89,100),new Point(90,100),new Point(91,100),new Point(92,100),new Point(93,100),new Point(94,100),new Point(95,100),new Point(96,100),new Point(97,100),new Point(98,100),new Point(99,100),new Point(100,100),new Point(100,100),new Point(100,99),new Point(100,98),new Point(100,97),new Point(100,96),new Point(100,95),new Point(100,94),new Point(100,93),new Point(100,92),new Point(100,91),new Point(100,90),new Point(100,89),new Point(100,88),new Point(100,87),new Point(100,86),new Point(100,85),new Point(100,84),new Point(100,83),new Point(100,82),new Point(100,81),new Point(100,80),new Point(100,79),new Point(100,78),new Point(100,77),new Point(100,76),new Point(100,75),new Point(100,74),new Point(100,73),new Point(100,72),new Point(100,71),new Point(100,70),new Point(100,69),new Point(100,68),new Point(100,67),new Point(100,66),new Point(100,65),new Point(100,64),new Point(100,63),new Point(100,62),new Point(100,61),new Point(100,60),new Point(100,59),new Point(100,58),new Point(100,57),new Point(100,56),new Point(100,55),new Point(100,54),new Point(100,53),new Point(100,52),new Point(100,51),new Point(100,50),new Point(100,50),new Point(99,50),new Point(98,50),new Point(97,50),new Point(96,50),new Point(95,50),new Point(94,50),new Point(93,50),new Point(92,50),new Point(91,50),new Point(90,50),new Point(89,50),new Point(88,50),new Point(87,50),new Point(86,50),new Point(85,50),new Point(84,50),new Point(83,50),new Point(82,50),new Point(81,50),new Point(80,50),new Point(79,50),new Point(78,50),new Point(77,50),new Point(76,50),new Point(75,50),new Point(74,50),new Point(73,50),new Point(72,50),new Point(71,50),new Point(70,50),new Point(69,50),new Point(68,50),new Point(67,50),new Point(66,50),new Point(65,50),new Point(64,50),new Point(63,50),new Point(62,50),new Point(61,50),new Point(60,50),new Point(59,50),new Point(58,50),new Point(57,50),new Point(56,50),new Point(55,50),new Point(54,50),new Point(53,50),new Point(52,50),new Point(51,50),new Point(50,50))
		);
	this.PointClouds[3] = new PointCloud("arrow-right", new Array(new Point(50,100),new Point(51,100),new Point(52,100),new Point(53,100),new Point(54,100),new Point(55,100),new Point(56,100),new Point(57,100),new Point(58,100),new Point(59,100),new Point(60,100),new Point(61,100),new Point(62,100),new Point(63,100),new Point(64,100),new Point(65,100),new Point(66,100),new Point(67,100),new Point(68,100),new Point(69,100),new Point(70,100),new Point(71,100),new Point(72,100),new Point(73,100),new Point(74,100),new Point(75,100),new Point(76,100),new Point(77,100),new Point(78,100),new Point(79,100),new Point(80,100),new Point(81,100),new Point(82,100),new Point(83,100),new Point(84,100),new Point(85,100),new Point(86,100),new Point(87,100),new Point(88,100),new Point(89,100),new Point(90,100),new Point(91,100),new Point(92,100),new Point(93,100),new Point(94,100),new Point(95,100),new Point(96,100),new Point(97,100),new Point(98,100),new Point(99,100),new Point(100,100),new Point(99,99),new Point(98,98),new Point(97,97),new Point(96,96),new Point(95,95),new Point(94,94),new Point(93,93),new Point(92,92),new Point(91,91),new Point(90,90),new Point(91,91),new Point(92,92),new Point(93,93),new Point(94,94),new Point(95,95),new Point(96,96),new Point(97,97),new Point(98,98),new Point(99,99),new Point(100,100),new Point(99,101),new Point(98,102),new Point(97,103),new Point(96,104),new Point(95,105),new Point(94,106),new Point(93,107),new Point(92,108),new Point(91,109),new Point(90,110))
	);
	this.PointClouds[4] = new PointCloud("arrow-left", new Array(new Point(100,100),new Point(99,100),new Point(98,100),new Point(97,100),new Point(96,100),new Point(95,100),new Point(94,100),new Point(93,100),new Point(92,100),new Point(91,100),new Point(90,100),new Point(89,100),new Point(88,100),new Point(87,100),new Point(86,100),new Point(85,100),new Point(84,100),new Point(83,100),new Point(82,100),new Point(81,100),new Point(80,100),new Point(79,100),new Point(78,100),new Point(77,100),new Point(76,100),new Point(75,100),new Point(74,100),new Point(73,100),new Point(72,100),new Point(71,100),new Point(70,100),new Point(69,100),new Point(68,100),new Point(67,100),new Point(66,100),new Point(65,100),new Point(64,100),new Point(63,100),new Point(62,100),new Point(61,100),new Point(60,100),new Point(59,100),new Point(58,100),new Point(57,100),new Point(56,100),new Point(55,100),new Point(54,100),new Point(53,100),new Point(52,100),new Point(51,100),new Point(50,100),new Point(51,99),new Point(52,98),new Point(53,97),new Point(54,96),new Point(55,95),new Point(56,94),new Point(57,93),new Point(58,92),new Point(59,91),new Point(60,90),new Point(59,91),new Point(58,92),new Point(57,93),new Point(56,94),new Point(55,95),new Point(54,96),new Point(53,97),new Point(52,98),new Point(51,99),new Point(50,100),new Point(51,101),new Point(52,102),new Point(53,103),new Point(54,104),new Point(55,105),new Point(56,106),new Point(57,107),new Point(58,108),new Point(59,109),new Point(60,110)
	));
	this.PointClouds[5] = new PointCloud("arrow-up", new Array(new Point(50,99),new Point(50,98),new Point(50,97),new Point(50,96),new Point(50,95),new Point(50,94),new Point(50,93),new Point(50,92),new Point(50,91),new Point(50,90),new Point(50,89),new Point(50,88),new Point(50,87),new Point(50,86),new Point(50,85),new Point(50,84),new Point(50,83),new Point(50,82),new Point(50,81),new Point(50,80),new Point(50,79),new Point(50,78),new Point(50,77),new Point(50,76),new Point(50,75),new Point(50,74),new Point(50,73),new Point(50,72),new Point(50,71),new Point(50,70),new Point(50,69),new Point(50,68),new Point(50,67),new Point(50,66),new Point(50,65),new Point(50,64),new Point(50,63),new Point(50,62),new Point(50,61),new Point(50,60),new Point(50,59),new Point(50,58),new Point(50,57),new Point(50,56),new Point(50,55),new Point(50,54),new Point(50,53),new Point(50,52),new Point(50,51),new Point(50,50),new Point(49,51),new Point(48,52),new Point(47,53),new Point(46,54),new Point(45,55),new Point(44,56),new Point(43,57),new Point(42,58),new Point(41,59),new Point(40,60),new Point(41,59),new Point(42,58),new Point(43,57),new Point(44,56),new Point(45,55),new Point(46,54),new Point(47,53),new Point(48,52),new Point(49,51),new Point(50,50),new Point(51,51),new Point(52,52),new Point(53,53),new Point(54,54),new Point(55,55),new Point(56,56),new Point(57,57),new Point(58,58),new Point(59,59),new Point(60,60)
	));
	this.PointClouds[6] = new PointCloud("arrow-down", new Array(new Point(50,51),new Point(50,52),new Point(50,53),new Point(50,54),new Point(50,55),new Point(50,56),new Point(50,57),new Point(50,58),new Point(50,59),new Point(50,60),new Point(50,61),new Point(50,62),new Point(50,63),new Point(50,64),new Point(50,65),new Point(50,66),new Point(50,67),new Point(50,68),new Point(50,69),new Point(50,70),new Point(50,71),new Point(50,72),new Point(50,73),new Point(50,74),new Point(50,75),new Point(50,76),new Point(50,77),new Point(50,78),new Point(50,79),new Point(50,80),new Point(50,81),new Point(50,82),new Point(50,83),new Point(50,84),new Point(50,85),new Point(50,86),new Point(50,87),new Point(50,88),new Point(50,89),new Point(50,90),new Point(50,91),new Point(50,92),new Point(50,93),new Point(50,94),new Point(50,95),new Point(50,96),new Point(50,97),new Point(50,98),new Point(50,99),new Point(50,100),new Point(49,99),new Point(48,98),new Point(47,97),new Point(46,96),new Point(45,95),new Point(44,94),new Point(43,93),new Point(42,92),new Point(41,91),new Point(40,90),new Point(41,91),new Point(42,92),new Point(43,93),new Point(44,94),new Point(45,95),new Point(46,96),new Point(47,97),new Point(48,98),new Point(49,99),new Point(50,100),new Point(51,99),new Point(52,98),new Point(53,97),new Point(54,96),new Point(55,95),new Point(56,94),new Point(57,93),new Point(58,92),new Point(59,91),new Point(60,90)
	));
	}
	
	//
	// The $P Point-Cloud Recognizer API begins here -- 3 methods: Recognize(), AddGesture(), DeleteUserGestures()
	//
	Recognize(points)
	{
		var t0 = Date.now();
		var candidate = new PointCloud("", points);

		var u = -1;
		var b = +Infinity;
		for (var i = 0; i < this.PointClouds.length; i++) // for each point-cloud template
		{
			var d = GreedyCloudMatch(points, this.PointClouds[i]);
			if (d < b) {
				b = d; // best (least) distance
				u = i; // point-cloud index
			}
		}
		var t1 = Date.now();
		return (u == -1) ? null : points_array[u];
		//return (u == -1) ? new Result("No match.", 0.0, t1-t0) : new Result(this.PointClouds[u].Name, b > 1.0 ? 1.0 / b : 1.0, t1-t0);
	}
	AddGesture(name, points)
	{
		this.PointClouds[this.PointClouds.length] = new PointCloud(name, points);
		var num = 0;
		for (var i = 0; i < this.PointClouds.length; i++) {
			if (this.PointClouds[i].Name == name)
				num++;
		}
		return num;
	}
	DeleteUserGestures()
	{
		this.PointClouds.length = NumPointClouds; // clears any beyond the original set
		return NumPointClouds;
	}
}
//
// Private helper functions from here on down
//
function GreedyCloudMatch(points, P)
{
	var e = 0.50;
	var step = Math.floor(Math.pow(points.length, 1.0 - e));
	var min = +Infinity;
	for (var i = 0; i < points.length; i += step) {
		var d1 = CloudDistance(points, P.Points, i);
		var d2 = CloudDistance(P.Points, points, i);
		min = Math.min(min, Math.min(d1, d2)); // min3
	}
	return min;
}
function CloudDistance(pts1, pts2, start)
{
	var matched = new Array(pts1.length); // pts1.length == pts2.length
	for (var k = 0; k < pts1.length; k++)
		matched[k] = false;
	var sum = 0;
	var i = start;
	do
	{
		var index = -1;
		var min = +Infinity;
		for (var j = 0; j < matched.length; j++)
		{
			if (!matched[j]) {
				var d = Distance(pts1[i], pts2[j]);
				if (d < min) {
					min = d;
					index = j;
				}
			}
		}
		matched[index] = true;
		var weight = 1 - ((i - start + pts1.length) % pts1.length) / pts1.length;
		sum += weight * min;
		i = (i + 1) % pts1.length;
	} while (i != start);
	return sum;
}
function Resample(points, n)
{
	var I = PathLength(points) / (n - 1); // interval length
	var D = 0.0;
	var newpoints = new Array(points[0]);
	for (var i = 1; i < points.length; i++)
	{
		if (points[i].ID == points[i-1].ID)
		{
			var d = Distance(points[i-1], points[i]);
			if ((D + d) >= I)
			{
				var qx = points[i-1].x + ((I - D) / d) * (points[i].x - points[i-1].x);
				var qy = points[i-1].y + ((I - D) / d) * (points[i].y - points[i-1].y);
				var q = new Point(qx, qy, points[i].ID);
				newpoints[newpoints.length] = q; // append new point 'q'
				points.splice(i, 0, q); // insert 'q' at position i in points s.t. 'q' will be the next i
				D = 0.0;
			}
			else D += d;
		}
	}
	if (newpoints.length == n - 1) // sometimes we fall a rounding-error short of adding the last point, so add it if so
		newpoints[newpoints.length] = new Point(points[points.length - 1].x, points[points.length - 1].y, points[points.length - 1].ID);
	return newpoints;
}
function Scale(points)
{
	var minx = +Infinity, maxx = -Infinity, miny = +Infinity, maxy = -Infinity;
	for (var i = 0; i < points.length; i++) {
		minx = Math.min(minx, points[i].x);
		miny = Math.min(miny, points[i].y);
		maxx = Math.max(maxx, points[i].x);
		maxy = Math.max(maxy, points[i].y);
	}
	var size = Math.max(maxx - minx, maxy - miny);
	var newpoints = new Array();
	for (var i = 0; i < points.length; i++) {
		var qx = (points[i].x - minx) / size;
		var qy = (points[i].y - miny) / size;
		newpoints[newpoints.length] = new Point(qx, qy, points[i].ID);
	}
	return newpoints;
}
function TranslateTo(points, pt) // translates points' centroid to pt
{
	var c = Centroid(points);
	var newpoints = new Array();
	for (var i = 0; i < points.length; i++) {
		var qx = points[i].x + pt.x - c.x;
		var qy = points[i].y + pt.y - c.y;
		newpoints[newpoints.length] = new Point(qx, qy, points[i].ID);
	}
	return newpoints;
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
	return new Point(x, y, 0);
}
function PathLength(points) // length traversed by a point path
{
	var d = 0.0;
	for (var i = 1; i < points.length; i++) {
		if (points[i].ID == points[i-1].ID)
			d += Distance(points[i-1], points[i]);
	}
	return d;
}
function Distance(p1, p2) // Euclidean distance between two points
{	console.log(p1,p2);
	var dx = p2.x - p1.x;
	var dy = p2.y - p1.y;
	return Math.sqrt(dx * dx + dy * dy);
}