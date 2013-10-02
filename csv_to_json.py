import csv
from itertools import izip
import json
import sys

args = sys.argv[1:]
f = open(args[0], 'r')
jsonOut = open(args[1], 'w+')

reader = csv.reader( f )
keys = ( "lga_name", "number_aboriginal_tsi", "non_indigenous", "not_stated", "total", "indigenous_total_percentage" )

out = []
for property in reader:
    property = iter( property )
    data = {}
    out = [dict(zip(keys, property)) for property in reader]
    out += [ data ]

jsonOut.write(json.dumps(out));