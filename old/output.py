import binascii
import sys
#import time
import os
sys.path.insert(1, os.path.split(sys.path[0])[0])
import nfc

service_code = 0x090f

def connected(tag):
	print tag

	if isinstance(tag, nfc.tag.tt3.Type3Tag):
		try:
			print "blockl %s" % binascii.hexlify(tag.read([0], srvice_code))
		except Exception as e:
			print "error: %s" % e
	else:
		print "error: tag isn't Type3Tag"

clf = nfc.ContactlessFrontend('usb')
clf.connect(rdwr={'on-connect': connected})
