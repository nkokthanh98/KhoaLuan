import RPi.GPIO as GPIO
import Adafruit_DHT
import time

dhtPin = 4

GPIO.setwarnings(False) # Ignore warning for now
GPIO.setmode(GPIO.BOARD) # Use physical pin numbering
GPIO.setup(dhtPin, GPIO.INPUT)

dhtType = Adafruit_DHT.DHT22

if __name__ == "__main__": 
    try:
        while True: 
            humidity, temperature = Adafruit_DHT.read_retry(dhtType, dhtPin)
            time.sleep(1)
    except KeyboardInterrupt:
            print('Interruped !')