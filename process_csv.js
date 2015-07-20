var csv = require('csv');
var fs = require('fs');

var input = fs.createReadStream(process.argv[2]);
//var output = fs.createWriteStream('/dev/null');
var parse = csv.parse();
var count = 0;
var headers = [];

var transform = csv.transform(function(row, callback){
  err = null;
  clubName = row[row.length-1];
  if (count === 0) {
    headers = row;
  } else if (row[0].match(/Clubs|Season/i) || row[1].match(/Season|Clubs/i) || row[0] === '') {

  } else {
    var clubObject = {
      years:[]
    };
    var lastYear = 0;
    var century = 1800;
    row.forEach(function(v, i){
      var twoDigitYear = parseInt(headers[i]);
      var fullYear = null;
      if ( (twoDigitYear + century) < lastYear) {
        century = century + 100;
      }
      fullYear = twoDigitYear + century;
      lastYear = fullYear;
      position = v.replace(/\.\s*/, '.');
      if (!isNaN(Number(position))) {
        s = position.split('.');
        if (s.length !== 2) {
          if (s[0] !== '') {
            console.log(row[0], row[0].match(/Clubs|Season/i), row[1], row[1].match(/Season|Clubs/i));

          }

        } else {
          clubObject.years.push(
            {
              year: fullYear,
              name: clubName,
              leaguePosition: {
                division: parseInt(s[0]),
                position: parseInt(s[1])
              }
            }
          );
        }
      }
    });
    var clubString = JSON.stringify(clubObject);
    var filename = clubName.replace(/\s+/, '-' ).toLowerCase() + '.json';
    fs.writeFile(filename, clubString, function(err) {
      if(err) {
          return console.log(err);
      }
      console.log("The " + filename + " was saved!");
    });
    callback(err, clubString);
  }
  count++;
});

input
  .pipe(parse)
  .pipe(transform)
  //.pipe(process.stdout)
  .once('finish',function() {
      console.log('done');
  });
