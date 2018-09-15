import binascii
import sys
#import time
import os
sys.path.insert(1, os.path.split(sys.path[0])[0])
import nfc

service_code = 0x090f

print "** Waiting for a Tag ... **"

def connected(tag):
	print tag
	tagdata = '%s' %tag
	index = tagdata.find('ID=')+3
	print "index = %d" % index
	idmdata = tagdata[index:index+16]
	print "idmdata = %s" %idmdata
	IDm = int(idmdata,16)
	print "IDm = %x" % IDm


clf = nfc.ContactlessFrontend('usb')
clf.connect(rdwr={'on-connect': connected})
