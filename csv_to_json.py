import csv
from itertools import izip
import json
import sys

args = sys.argv[1:]



f = open(args[0], 'r')
jsonOut = open(args[1], 'w+')

reader = csv.reader( f )
keys = ( "lga_id", "lga_name", "population", "score", "national_rank", "national_decile", "national_percentile", "state", "state_rank", "state_decile", "state_percentile" )

out = []
for property in reader:
    property = iter( property )
    data = {}
    out = [dict(zip(keys, property)) for property in reader]
    out += [ data ]

print json.dumps(out)
jsonOut.write(json.dumps(out));