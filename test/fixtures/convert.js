var fs = require('fs')
  , path = require('path')
  , test = require('tape')

test('convert fixtures from octave text to js', function (t) {
  t.plan(12)

  function convert (infile, expectedDims) {
    var outfile = path.join(__dirname, 'js', infile.slice(0, infile.length - path.extname(infile).length) + '.js')
      , buffer = fs.readFileSync(path.join(__dirname, 'raw', infile)).toString()
      , columns = buffer.slice(0, buffer.indexOf('\n')).trim().split(' ').length
      , rows = buffer.trim().match(/\n/g).length + 1
      , test

    buffer = JSON.stringify(JSON.parse('[' + buffer.replace(/\n/g, '').trim().replace(/ /g, ',') + ']'))
    buffer = 'module.exports = require(\'ndarray\')(new Float64Array(' + buffer + '),[' + rows + ',' + columns + '])'

    fs.writeFileSync(outfile, buffer)

    test = require(outfile)

    t.equal(test._shape0, rows, 'Shape0 should still have ' + rows + ' rows (' + infile + ')')
    t.equal(test._shape0, expectedDims[0], 'Expected ' + expectedDims[0] + ' rows (' + infile + ')')
    t.equal(test._shape1, columns, 'Shape0 should have ' + columns + ' columns (' + infile + ')')
    t.equal(test._shape1, expectedDims[1], 'Expected ' + expectedDims[1] + ' rows (' + infile + ')')
  }

  convert('theta1.txt', [25, 401])
  convert('theta2.txt', [10, 26])
  convert('input.txt', [5000, 400])
})
