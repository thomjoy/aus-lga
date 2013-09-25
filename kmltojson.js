// using togeojson in nodejs

var tj = require('togeojson'),
    fs = require('fs'),
    jsdom = require('jsdom').jsdom;

var kml = jsdom(fs.readFileSync('./test.kml', 'utf8'));
var converted = tj.kml(kml);
var converted_with_styles = tj.kml(kml, { styles: true });

fs.writeFile("./out.json", kml, function(err) {
    if(err) {
        console.log(err);
    } else {
        console.log("The file was saved!");
    }
}); 