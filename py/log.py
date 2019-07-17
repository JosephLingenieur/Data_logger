#!/usr/bin/env python
"""
================================================
ADC Differential Pi 8-Channel InfluxDB log script

Requires python smbus to be installed
================================================

Initialise the ADC device using the default addresses and sample rate,
change this value if you have changed the address selection jumpers

Sample rate can be 12,14, 16 or 18
"""


from __future__ import absolute_import, division, print_function, \
                                                    unicode_literals
#from ADCDifferentialPi import ADCDifferentialPi
import psutil
import time
import collections
import os
import sys
import glob

import logging

import sqlite3

from influxdb import InfluxDBClient
from influxdb.client import InfluxDBClientError

# InfluxDB variables
USER = 'root'
PASSWORD = 'root'
DBNAME = 'loggerdb'
HOST = 'localhost'
PORT = 8086

try:
    from ADCDifferentialPi import ADCDifferentialPi
except ImportError:
    print("Failed to import ADCDifferentialPi from python system path")
    print("Importing from parent folder instead")
    try:
        import sys
        sys.path.append('..')
        from ADCDifferentialPi import ADCDifferentialPi
    except ImportError:
        raise ImportError(
            "Failed to import library from parent folder")


def main():

	# constants for interval
	intervalMid = 5
	intervalLong = 10

	# adc object -> only works if board is attached
	adc = ADCDifferentialPi(0x68, 0x69, 18)
	adc.set_conversion_mode(1)

	# keep repeating until false
	while (1):

		# decrement timers
		intervalMid -= 1
		intervalLong -= 1

		# client object of Influxdb database
		client = InfluxDBClient(HOST, PORT, USER, PASSWORD, DBNAME, False, False, 3, 0)

		# connection to the datbase
		conn = sqlite3.connect('/var/www/html/db/channels.db')

		cursor = conn.execute("SELECT * from Channels")
		for row in cursor:
			# get al the variables out of the database
			index = int(row[0])
			name = row[1]
			gain = int(row[2])
			interval = int(row[3])
			shunt = float(row[4])
			unit = row[5]
			var = row[6]
			PID = int(row[7])

			# make the measurement name
			measurement = "channel_" + str(row[0])

			print(PID)

			post = False
			log = False

			if PID == 1:
				log = True
			else:
				log = False

			if interval == 1:
				post = True
			elif interval == 5:
				if intervalMid == 0:
					post = True
			elif interval == 10:
				if intervalLong == 0:
					post = True

			if log and post:

				log = False
				post = False

				# set the gain level of the adc (total chip) and read the voltage
				adc.set_pga(gain)
				voltage = adc.read_voltage(index)

		        # conversion of the voltage to a human readable voltage.
		        # if no shunt is present and you want the present value use value 1
				post_value = voltage / shunt
				print(post_value)
				# JSON format
				log_put = [
					{
						"measurement": measurement,
						"tags": {
							"data": name,
						},
						"fields": {
							"voltage": post_value,
						}
					}
				]

				# write JSON to InfluxDB
				client.write_points(log_put)

		# close all connections correctly
		conn.close()
		client.close()

		if intervalMid == 0:
			intervalMid = 5

		if intervalLong == 0:
			intervalLong = 10

		# sleep interval
		time.sleep(1)

FORMAT = '%(asctime)-15s %(message)s'
logging.basicConfig(format=FORMAT, level=logging.ERROR, filename='/var/www/html/script.log')

if __name__ == '__main__':
	try:
		main()
	except:
		logging.exception("Log:")
