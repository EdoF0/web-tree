
var paper = document.getElementById("Tree");
const X = 1000; // max width in pixels
const Y = 1000; // max height in pixels
var basi = [
	// lista di gruppi di coppie coordinate
		[
			// lista di coppie di coordinate
			// [[0,0],[0,0]],
			// base coords
			[[450,0],[550,0]]
		]
	];

//alert(basi[0][1]-basi[1][1]);
////draw(paper,create_square(basi[0][0]));
//draw(paper,create_circle(basi[1][0]));
////draw(paper,create_triangle(basi[1][0]));
//draw(paper,create_square(basi[2][0]));
//draw(paper,create_square(basi[2][1]));

paper.style.backgroundColor = "rgba(" + getRandom(0,255) + "," + getRandom(0,255) + "," + getRandom(0,255) + ",0.75)";

var i = 0;
var j = 0;
//var jumped = 0;
function grow() {
	console.log("growing");
	if (i==0) {
		draw(paper,create_first_square(basi[i][j],i,j));
		i++;
		console.log("[grow] basi", basi);
		return undefined;
	}
	console.log("[grow]  drawing elements " + i);
	for (j=0; j<basi[i].length; j++) {
		if (basi[i][j][0][0] != null) {
			if (i%2==0) {
				draw(paper,create_square(basi[i][j],i,j));
			} else {
				draw(paper,create_triangle(basi[i][j],i,j));
			}
		} else {
			console.log("[grow]   basi drawing null " + j);
			create_null(i);
		}
	}
	
	i++;
	console.log("[grow] basi", basi);
	return undefined;
}

function create_null(index) {
	
	if (index%2==0) {
		if (basi[index+1]==null) {
			basi[index+1] = ([[[null,null],[null,null]]]);
		} else {
			basi[index+1].push([[null,null],[null,null]]);
		}
	} else {
		if (basi[index+1]==null) {
			basi[index+1] = ([[[null,null],[null,null]],[[null,null],[null,null]]]);
		} else {
			basi[index+1].push([[null,null],[null,null]]);
			basi[index+1].push([[null,null],[null,null]]);
		}
	}
	
	return undefined;
}

function create_triangle(base,index1,index2) {
	console.log("[create_triangle]   drawing triangle " + index2);
	// Crea l'elemento svg dalle coordinate
	var points = triangle_points(base);
	var case1 = points[0];
	var case2 = points[1];
	var coords;
	
	//scegli le coordinate giuste
	var R = rect_variables(base[0],base[1]); // = case1[0],case1[1] = case2[0],case2[1]
	var origin_index2 = index2; // l'index della base precedente è lo stesso del quadrato precedente perchè ha solo una base
	var origin_third_coord = 0; //convenzione - dopo verrà verificato
	var reference_coords = basi[index1-1][origin_index2][origin_third_coord];
	console.log("[create_triangle]    refering to basi [" + (index1-1) + "][" + origin_index2 + "][" + origin_third_coord + "] = " + reference_coords);
	if (!is_on_same_side(R,reference_coords,case1[2])) {
		coords = case1;
			var ghost = case2;
			console.log("[create_triangle]    choosing case1 - " + case1);
	} else {
		coords = case2;
			var ghost = case1;
			console.log("[create_triangle]    choosing case2 - " + case2);
	}
	if (outside(coords[2])) {
		console.warn("[create_triangle]    is outside -> ignoring drawing");
		//return "<text x='" + coords[1][0] + "' y='" + (Y-coords[1][1]) + "' >"+
		//	"outside_triangle_" + index1 + "." + index2 + 
		//	"</text>";
		if (basi[index1+1]==null) {
			basi[index1+1] = ([[coords[0],coords[2]],[coords[1],coords[2]]]);
		} else {
			basi[index1+1].push([coords[0],coords[2]]);
			basi[index1+1].push([coords[1],coords[2]]);
		}
		
		return "";
	}
	
	//aggiungi a basi le coordinate delle due nuove basi
	if (basi[index1+1]==null) {
		basi[index1+1] = ([[coords[0],coords[2]],[coords[1],coords[2]]]);
	} else {
		basi[index1+1].push([coords[0],coords[2]]);
		basi[index1+1].push([coords[1],coords[2]]);
	}
	
	return "<polygon class='triangle' points='" + 
		coords[0][0] + "," + (Y-coords[0][1]) + " " + 
		coords[1][0] + "," + (Y-coords[1][1]) + " " + 
		coords[2][0] + "," + (Y-coords[2][1]) + " " + 
		"' />" + "<polygon class='ghost-triangle' points='" + 
		ghost[0][0] + "," + (Y-ghost[0][1]) + " " + 
		ghost[1][0] + "," + (Y-ghost[1][1]) + " " + 
		ghost[2][0] + "," + (Y-ghost[2][1]) + " " + 
		"' />" + "<line class='ghost-line' " + 
		"x1='" + coords[2][0] + "' y1='" + (Y-coords[2][1]) + "' " + 
		"x2='" + reference_coords[0] + "' y2='" + (Y-reference_coords[1]) + 
		"' />" + //"<text x='" + coords[2][0] + "' y='" + (Y-coords[2][1]) + "' >" + 
		//"triangle_" + index1 + "." + index2 + "</text>";
		"";
}

function triangle_points(base) {
	//Individua il terzo punto su una circonferenza con centro il punto medio della base
	var circle = circle_variables(base);
	var xc = circle[0];
	var yc = circle[1];
	var r = circle[2];
	//Duplica i dati in modo da non intervenire su base che è un puntatore a basi[i][j]
	var base1 = base.slice(0);
	var base2 = base.slice(0);
	
	
	var y1 = getRandom(yc-r,yc+r);
	//formula ricavata da (x-xc)^2 + (y-yc)^2 = r^2 - formula del cerchio sul piano cartesiano
	var x1 = (2*xc + Math.sqrt( (-2*xc)**2 - 4*(y1**2-2*yc*y1+xc**2+yc**2-r**2) ) )/2;
	while ( r_distance( rect_variables(base[0],base[1]) , [x1,y1] ) < r/3 ) {
		//elimina la probabilità di triangoli schiacciati
		y1 = getRandom(yc-r,yc+r);
		x1 = (2*xc + Math.sqrt( (-2*xc)**2 - 4*(y1**2-2*yc*y1+xc**2+yc**2-r**2) ) )/2;
	}
	//simmetrico rispetto al centro
	var y2 = (yc*2)-y1;
	var x2 = (xc*2)-x1;
	
	//Evita soluzioni simili tra loro causate dal fatto che base1 è sempre preso in considerazione per primo
	if (Math.random()<0.5) {
		base1.push([x1,y1]);
		base2.push([x2,y2]);
	} else {
		base1.push([x2,y2]);
		base2.push([x1,y1]);
	}
	
	return [base1,base2];
}

function create_square(base,index1,index2) {
	console.log("[create_square]   drawing square " + index2);
	//Crea l'elemento svg dalle coordinate
	var points = square_points(base);
	var case1 = points[0];
	var case2 = points[1];
	var coords;
	
	//scegli le coordinate giuste
	var R = rect_variables(base[0],base[1]); // = case1[0],case1[1] = case2[0],case2[1]
	var origin_index2 = Math.floor(index2/2); // ricava l'index della base precedente che era un triangolo con due basi
	var origin_third_coord = 0;
	var reference_coords = basi[index1-1][origin_index2][origin_third_coord];
	console.log("[create_square]    refering to basi [" + (index1-1) + "][" + origin_index2 + "][" + origin_third_coord + "] = " + reference_coords);
	if (!(is_on_same_side(R,reference_coords,case1[2])||is_on_same_side(R,reference_coords,case1[3]))) {
		coords = case1;
			var ghost = case2;
			console.log("[create_square]    choosing case1 - " + case1);
	} else {
		coords = case2;
			var ghost = case1;
			console.log("[create_square]    choosing case2 - " + case2);
	}
	//capisci qual è il terzo angolo del triangolo che il quadrato ha come base: se era sbagliato ripeti tutto
	if ((reference_coords==coords[0]) || (reference_coords==coords[1])) {
		origin_third_coord = 1;
		var reference_coords = basi[index1-1][origin_index2][origin_third_coord];
		console.log("[create_square]    refering to basi [" + (index1-1) + "][" + origin_index2 + "][" + origin_third_coord + "] = " + reference_coords);
		if (!(is_on_same_side(R,reference_coords,case1[2])||is_on_same_side(R,reference_coords,case1[3]))) {
			coords = case1;
					ghost = case2;
				console.log("[create_square]    choosing case1 - " + case1);
		} else {
			coords = case2;
					ghost = case1;
				console.log("[create_square]    choosing case2 - " + case2);
		}
	}
	if (outside(coords[2])||outside(coords[3])) {
		console.log("[create_square]    is outside -> ignoring drawing");
		//return "<text x='" + coords[1][0] + "' y='" + (Y-coords[1][1]) + "' >"+
		//	"outside_square_" + index1 + "." + index2 + 
		//	"</text>";
		if (p_distance(coords[2],coords[3])>20) {
			if (basi[index1+1]==null) {
				basi[index1+1] = ([[coords[2],coords[3]]]);
			} else {
				basi[index1+1].push([coords[2],coords[3]]);
			}
		} else {
				console.log("[create_square]    square too small: ignoring new base coordinates");
			if (basi[index1+1]==null) {
				basi[index1+1] = ([[[null,null],[null,null]]]);
			} else {
				basi[index1+1].push([[null,null],[null,null]]);
			}
		}
		
		return "";
	}
	
	//aggiungi a basi le coordinate della base generata dal quadrato
	if (p_distance(coords[2],coords[3])>20) {
		if (basi[index1+1]==null) {
			basi[index1+1] = ([[coords[2],coords[3]]]);
		} else {
			basi[index1+1].push([coords[2],coords[3]]);
		}
	} else {
			console.log("[create_square]    square too small: ignoring new base coordinates");
		if (basi[index1+1]==null) {
			basi[index1+1] = ([[[null,null],[null,null]]]);
		} else {
			basi[index1+1].push([[null,null],[null,null]]);
		}
	}
	
	return "<polygon class='square' points='" + 
		coords[0][0] + "," + (Y-coords[0][1]) + " " + 
		coords[1][0] + "," + (Y-coords[1][1]) + " " + 
		coords[2][0] + "," + (Y-coords[2][1]) + " " + 
		coords[3][0] + "," + (Y-coords[3][1]) + " " + 
		"' />" + "<polygon class='ghost-square' points='" + 
		ghost[0][0] + "," + (Y-ghost[0][1]) + " " + 
		ghost[1][0] + "," + (Y-ghost[1][1]) + " " + 
		ghost[2][0] + "," + (Y-ghost[2][1]) + " " + 
		ghost[3][0] + "," + (Y-ghost[3][1]) + " " + 
		"' />" + "<line class='ghost-line' " + 
		"x1='" + coords[2][0] + "' y1='" + (Y-coords[2][1]) + "' " + 
		"x2='" + reference_coords[0] + "' y2='" + (Y-reference_coords[1]) + 
		"' />" + //"<text x='" + coords[2][0] + "' y='" + (Y-coords[2][1]) + "' >" + 
		//"square_" + index1 + "." + index2 + "</text>";
		"";
}

function create_first_square(base,index1,index2) {
		console.log("[create_first_square]  drawing first square");
	//Crea l'elemento svg dalle coordinate
	var points = square_points(base);
	var case1 = points[0];
	var case2 = points[1];
	var coords;
	
	//scegli le coordinate giuste
	if ( !(outside(case1[2])||outside(case1[3])) ) {
		coords = case1;
			console.log("[create_first_square]    choosing case1 - " + case1);
	} else {
		coords = case2;
			console.log("[create_first_square]    choosing case2 - " + case2);
	}
	
	//aggiungi a basi le coordinate della base generata dal quadrato per la prssima costrzione
	if (basi[index1+1]==null) {
		basi[index1+1] = ([[coords[2],coords[3]]]);
	} else {
		basi[index1+1].push([coords[2],coords[3]]);
	}
	
	return "<polygon class='square' points='" + 
		coords[0][0] + "," + (Y-coords[0][1]) + " " + 
		coords[1][0] + "," + (Y-coords[1][1]) + " " + 
		coords[2][0] + "," + (Y-coords[2][1]) + " " + 
		coords[3][0] + "," + (Y-coords[3][1]) + " " + 
		"' />" + //"<text x='" + coords[2][0] + "' y='" + (Y-coords[2][1]) + "' >" + 
		//"square_" + index1 + "." + index2 + "</text>";
		"";
}

function square_points(base) {
	//Definisci gli altri due punti a partire da ciascuno avanzando di distanza x sull'asse y e di distanza y sull'asse x (distanza x e y sono la distanza sui rispettivi assi dei due punti noti) - i segni si conciliano da soli
	var x_delta = base[1][0]-base[0][0];
	var y_delta = base[0][1]-base[1][1];
	//Duplica i dati in modo da non intervenire su base che è un puntatore a basi[i][j]
	var base1 = base.slice(0);
	var base2 = base.slice(0);
	
	//Evita soluzioni simili tra loro causate dal fatto che base1 è sempre preso in considerazione per primo
	if (Math.random()<0.5) {
		base1.push([ base[1][0]+y_delta ,  base[1][1]+x_delta ]);
		base1.push([ base[0][0]+y_delta ,  base[0][1]+x_delta ]);
		base2.push([ base[1][0]-y_delta ,  base[1][1]-x_delta ]);
		base2.push([ base[0][0]-y_delta ,  base[0][1]-x_delta ]);
	} else {
		base2.push([ base[1][0]+y_delta ,  base[1][1]+x_delta ]);
		base2.push([ base[0][0]+y_delta ,  base[0][1]+x_delta ]);
		base1.push([ base[1][0]-y_delta ,  base[1][1]-x_delta ]);
		base1.push([ base[0][0]-y_delta ,  base[0][1]-x_delta ]);
	}
	
	return [base1,base2];
}

function create_circle(base) {
	//Crea l'elemento svg dalle coordinate
	var points = circle_variables(base);
	//awmgrlg
	return "<circle class='circle'" + 
		" cx='" + points[0] + "'" + 
		" cy='" + (Y-points[1]) + "'" + 
		" r='" + points[2] + "' />";
}

function circle_variables(base) {
	//ritorna x del centro, y del centro, raggio
	var centro = middle(base[0],base[1]);
	return [centro[0],centro[1],p_distance(base[0],base[1])/2];
}

function rect_variables(p1,p2) {
	//Equazione della retta dati due punti - y = mx + q
	if (p1[0]==p2[0]) {
		//x = k
		return [p1[0],null];
	}
	if (p1[1]==p2[1]) {
		//y = k
		return [null,p1[1]];
	}
	var m = (p2[1]-p1[1])/(p2[0]-p1[0]);
	var q = p1[1] - m*p1[0];
	return [m,q];
}

function is_on_same_side(rect,p1,p2) {
	return is_on_that_side(rect,p1) == is_on_that_side(rect,p2);
}

function is_on_that_side(rect,p) {
	if (rect[0]==null) {
		//y = k
		return p[1]>rect[1];
	}
	if (rect[1]==null) {
		//x = k
		return p[0]>rect[0];
	}
	return (p[1] - rect[0]*p[0]) > rect[1];
}

function r_distance(rect,p) {
	//Distanza tra una retta e un punto nel piano cartesiano
	if (rect[0]==null) {
		//y = k
		return Math.abs(rect[1]-p[1]);
	}
	if (rect[1]==null) {
		//x = k
		return Math.abs(rect[0]-p[0]);
	}
	//formula
	return Math.abs(p[1]-(rect[0]*p[0]+rect[1]))/Math.sqrt(1+rect[0]**2);
}

function p_distance(p1,p2) {
	//Distanza tra due punti nel piano cartesiano attraverso Pitagora
	return Math.sqrt(((p1[0]-p2[0])**2) + ((p1[1]-p2[1])**2));
}

function middle(p1,p2) {
	//Somma all'offset dei un punto la metà della distanza - i segni si conciliano da soli
	return [ p1[0]+(p2[0]-p1[0])/2 , p1[1]+(p2[1]-p1[1])/2 ];
}

function outside(p) {
	//X e Y sono costanti pari alle dimensioni del foglio svg
	return (p[0]<0)||(p[1]<0)||(p[0]>X)||(p[1]>Y);
}

function draw(el,new_content) {
	el.innerHTML = el.innerHTML + new_content;
	return undefined;
}

function getRandom(min, max) {
	//min e max inclusi nel sorteggio
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

/*
setInterval(grow, 1000);
*/