interface Location {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

interface EmergencyContact {
  name: string;
  phone: string;
}

class SOSService {
  private getCurrentLocation(): Promise<Location> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    });
  }

  private makeEmergencyCall(number: string): void {
    // Create a hidden link to trigger phone call
    const link = document.createElement('a');
    link.href = `tel:${number}`;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  private sendSMS(phoneNumber: string, message: string): void {
    // Create SMS link
    const smsLink = document.createElement('a');
    smsLink.href = `sms:${phoneNumber}?body=${encodeURIComponent(message)}`;
    smsLink.style.display = 'none';
    document.body.appendChild(smsLink);
    smsLink.click();
    document.body.removeChild(smsLink);
  }

  private createLocationMessage(location: Location, passengerName: string, passengerPhone: string): string {
    const googleMapsUrl = `https://maps.google.com/?q=${location.latitude},${location.longitude}`;
    
    return `🚨 EMERGENCY ALERT 🚨
Passenger: ${passengerName}
Phone: ${passengerPhone}
Location: ${googleMapsUrl}
Time: ${new Date().toLocaleString()}
Please respond immediately!`;
  }

  public async triggerSOS(emergencyContact: EmergencyContact, passengerName: string, passengerPhone: string): Promise<void> {
    try {
      // Get current location
      const location = await this.getCurrentLocation();
      
      // Create emergency message
      const emergencyMessage = this.createLocationMessage(location, passengerName, passengerPhone);
      
      // Make emergency calls
      setTimeout(() => this.makeEmergencyCall('100'), 100); // Police
      setTimeout(() => this.makeEmergencyCall('108'), 1000); // Ambulance
      
      // Send SMS to emergency contact
      setTimeout(() => {
        this.sendSMS(emergencyContact.phone, emergencyMessage);
      }, 2000);
      
      // Send notification (in real app, this would be push notification)
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('SOS Alert Sent', {
          body: `Emergency alert sent to ${emergencyContact.name}`,
          icon: '/icon-192.png'
        });
      }
      
    } catch (error) {
      console.error('SOS Error:', error);
      throw error;
    }
  }

  public async requestNotificationPermission(): Promise<void> {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  }
}

export const sosService = new SOSService();