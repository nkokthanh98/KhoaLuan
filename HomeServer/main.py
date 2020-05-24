import RPi.GPIO as GPIO
import Adafruit_DHT
import time

dhtPin = 4

dhtType = Adafruit_DHT.DHT22

if __name__ == "__main__": 
    try:
        while True: 
            humidity, temperature = Adafruit_DHT.read_retry(dhtType, dhtPin)
            print("Humidity: " + str(humidity) + " Temperature: " + str(temperature))
            time.sleep(1)
    except KeyboardInterrupt:
            print('Interruped !')