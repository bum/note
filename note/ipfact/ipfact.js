var thumbnail_mode = "no-float";
summary_noimg = 685;
summary_img = 585;
img_thumb_height = 200;
img_thumb_width = 250;

function removeHtmlTag(strx, chop) {
	if (strx.indexOf("<") != -1) {
		var s = strx.split("<");
		for (var i = 0; i < s.length; i++) {
			if (s[i].indexOf(">") != -1) {
				s[i] = s[i].substring(s[i].indexOf(">") + 1, s[i].length)
			}
		}
		strx = s.join("")
	}
	chop = (chop < strx.length - 1) ? chop : strx.length - 2;
	while (strx.charAt(chop - 1) != ' ' && strx.indexOf(' ', chop) != -1)
		chop++;
	strx = strx.substring(0, chop - 1);
	return strx + '...'
}

function createSummaryAndThumb(pID, url) {
	var div = document.getElementById(pID);
	var imgtag = "";
	var img = div.getElementsByTagName("img");
	var summ = summary_noimg;
	if (img.length >= 1) {
		imgtag = ' <a href = "' + url + '" ><span style = "float:left;margin-right: 10px;width:250px;height:200px;background: url(' + img[0].src
				+ ') center 0 no-repeat transparent;background-size: 250px auto;" ></span> </a > ';
		summ = summary_img
	}
	var summary = imgtag + ' <div>' + removeHtmlTag(div.innerHTML, summ) + ' </div>';
	div.innerHTML = summary
}
var relatedTitles = new Array();
var relatedTitlesNum = 0;
var relatedUrls = new Array();
var thumburl = new Array();

function related_results_labels_thumbs(json) {
	for (var i = 0; i < json.feed.entry.length; i++) {
		var entry = json.feed.entry[i];
		relatedTitles[relatedTitlesNum] = entry.title.$t;
		try {
			thumburl[relatedTitlesNum] = entry.media$thumbnail.url;
			thumburl = thumburl.replace("/s72-c/", "/s300-a/")
		} catch (error) {
			s = entry.content.$t;
			a = s.indexOf("<img");
			b = s.indexOf("src=\"", a);
			c = s.indexOf("\"", b + 5);
			d = s.substr(b + 5, c - b - 5);
			if ((a != -1) && (b != -1) && (c != -1) && (d != "")) {
				thumburl[relatedTitlesNum] = d
			} else {
				if (typeof (defaultnoimage) !== 'undefined')
					thumburl[relatedTitlesNum] = defaultnoimage;
				else
					thumburl[relatedTitlesNum] = "//3.bp.blogspot.com/-PpjfsStySz0/UF91FE7rxfI/AAAAAAAACl8/092MmUHSFQ0/s1600/no_image.jpg"
			}
		}
		if (relatedTitles[relatedTitlesNum].length > 35)
			relatedTitles[relatedTitlesNum] = relatedTitles[relatedTitlesNum].substring(0, 35) + "...";
		for (var k = 0; k < entry.link.length; k++) {
			if (entry.link[k].rel == 'alternate') {
				relatedUrls[relatedTitlesNum] = entry.link[k].href;
				relatedTitlesNum++
			}
		}
	}
}

function removeRelatedDuplicates() {
	var tmp = new Array(0);
	var tmp2 = new Array(0);
	var tmp3 = new Array(0);
	for (var i = 0; i < relatedUrls.length; i++) {
		if (!contains_thumbs(tmp, relatedUrls[i])) {
			tmp.length += 1;
			tmp[tmp.length - 1] = relatedUrls[i];
			tmp2.length += 1;
			tmp3.length += 1;
			tmp2[tmp2.length - 1] = relatedTitles[i];
			tmp3[tmp3.length - 1] = thumburl[i]
		}
	}
	relatedTitles = tmp2;
	relatedUrls = tmp;
	thumburl = tmp3
}

function contains_thumbs(a, e) {
	for (var j = 0; j < a.length; j++)
		if (a[j] == e)
			return true;
	return false
}

function printRelatedLabels(current) {
	var splitbarcolor;
	if (typeof (splittercolor) !== 'undefined')
		splitbarcolor = splittercolor;
	else
		splitbarcolor = "#DDDDDD";
	for (var i = 0; i < relatedUrls.length; i++) {
		if ((relatedUrls[i] == current) || (!relatedTitles[i])) {
			relatedUrls.splice(i, 1);
			relatedTitles.splice(i, 1);
			thumburl.splice(i, 1);
			i--
		}
	}
	var r = Math.floor((relatedTitles.length - 1) * Math.random());
	var i = 0;
	if (relatedTitles.length == 0) {
		document.write('<h3>No similar posts</h3>')
	}
	;
	if (relatedTitles.length > 0)
		document.write(' <h3>' + relatedpoststitle + ' </h3>');
	document.write(' <div style = "clear: both;" / >');
	while (i < relatedTitles.length && i < 20 && i < maxresults) {
		document.write('<a style="text-decoration:none;float:left;');
		if (i != 0)
			document.write('"');
		else
			document.write('"');
		document.write(' href="' + relatedUrls[r] + '"><img class="img-home-thumb" src="' + thumburl[r] + '"/><br/><div class="imgpost">' + relatedTitles[r] + '</div></a>');
		i++;
		if (r < relatedTitles.length - 1) {
			r++
		} else {
			r = 0
		}
	}
	document.write('</div>');
	relatedUrls.splice(0, relatedUrls.length);
	thumburl.splice(0, thumburl.length);
	relatedTitles.splice(0, relatedTitles.length)
}