import csv
from itertools import izip
import json

f = open( 'nsw.csv', 'r' )
reader = csv.reader( f )
keys = ( "id","name", "2001","2002","2003","2004","2005","2006","2007","2008","2009","2010","2011","2012","change % (2007-2012)","change no.","area","density" )

out = []
for property in reader:
    property = iter( property )
    data = {}
    out = [dict(zip(keys, property)) for property in reader]
    out += [ data ]

print json.dumps(out)