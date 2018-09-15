import binascii
import sys
import time
import os
sys.path.insert(1, os.path.split(sys.path[0])[0])
import nfc

def main(registered_ids_csv_filename):
	with open(registered_ids_csv_filename, 'a') as registered_ids_csv_file:
		clf = nfc.ContactlessFrontend('usb')
		print "Press ^C to quit ..."
		while True:
			time.sleep(1)

			tag = clf.connect(rdwr={'on-connect': None})
			if not isinstance(tag, nfc.tag.Type3Tag):
				print "Invalid card type"
				continue

			idm = binascii.hexlify(tag.idm)
			print "ID: " + idm
			name = raw_input("Input your name >")
			registered_ids_csv_file.write("{},{}\n".format(idm, name))

if __name__ == '__main__':
	main(sys.argv[1])
