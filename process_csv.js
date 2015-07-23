var csv = require('csv');
var fs = require('fs');

var input = fs.createReadStream(process.argv[2]);
//var output = fs.createWriteStream('/dev/null');
var parse = csv.parse();
var count = 0;
var headers = [];
seasons = [];

var transform = csv.transform(function(row, callback){
  err = null;
  clubName = row[row.length-1];
  if (count === 0) {
    headers = row;
  } else if (row[0].match(/Clubs|Season/i) ||
             row[1].match(/Season|Clubs/i) || row[0] === '') {
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
            console.log('No position', row[0], row[1]);
          }
        } else {
          var division = parseInt(s[0]);
          var position = parseInt(s[1]);

          if (seasons[fullYear] === undefined) {
            seasons[fullYear] = {};
          }

          if (seasons[fullYear][division] === undefined) {
              seasons[fullYear][division] = {};
              seasons[fullYear][division].teams = [];
              seasons[fullYear][division].teams.push(clubName);
              seasons[fullYear][division].count = 1;
          } else {
              seasons[fullYear][division].count++;
              seasons[fullYear][division].teams.push(clubName);
          }

          clubObject.years.push(
            {
              year: fullYear,
              name: clubName,
              leaguePosition: {
                division: division,
                position: position
              }
            }
          );
        }
      }
    });
    var clubString = JSON.stringify(clubObject);
    var filename = clubName.replace(/\s+/, '-' ).toLowerCase() + '.json';
    fs.writeFile('./out/' + filename, clubString, function(err) {
      if(err) {
          return console.log(err);
      }
      //console.log('The ' + filename + ' was saved!');
    });
    callback(err, clubString);
  }
  count++;
});

input
  .pipe(parse)
  .pipe(transform)
  //.pipe(process.stdout)
  .once('finish', function() {
      seasons.forEach(function(season, i) {
        //console.log(i, season);
        for (var div in season) {
          if (season.hasOwnProperty(div)){
            division = season[div];
            console.log(i, div, division.count, division.teams.length);
          }
        }
      });
      //console.log(JSON.stringify(seasons, null, 2));
      // TODO: Checksum seasons and team counts
      console.log('done');
  });
