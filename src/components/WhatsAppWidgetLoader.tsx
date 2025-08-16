import { useEffect } from 'react';

// TypeScript declaration for WhatsAppWidget
declare global {
  interface Window {
    WhatsAppWidget?: {
      init: (config: { phone: string; message: string }) => void;
    };
  }
}

const WhatsAppWidgetLoader = () => {
  useEffect(() => {
    console.log('WhatsAppWidgetLoader: Starting to load script...');
    
    const script = document.createElement('script');
    // Using a different WhatsApp widget script that should work
    script.src = 'https://cdn.jsdelivr.net/npm/whatsapp-widget@1.0.0/dist/whatsapp-widget.min.js';
    script.async = true;
    
    script.onload = () => {
      console.log('WhatsAppWidgetLoader: Script loaded successfully');
      console.log('WhatsAppWidgetLoader: window.WhatsAppWidget exists?', !!window.WhatsAppWidget);
      
      if (window.WhatsAppWidget) {
        console.log('WhatsAppWidgetLoader: Initializing widget...');
        try {
          window.WhatsAppWidget.init({
            phone: '+27616583827', // Replace with real number
            message: 'Hello! How can I help you?',
          });
          console.log('WhatsAppWidgetLoader: Widget initialized successfully');
        } catch (error) {
          console.error('WhatsAppWidgetLoader: Error initializing widget:', error);
        }
      } else {
        console.log('WhatsAppWidgetLoader: WhatsAppWidget not found on window');
        // Try again after a delay
        setTimeout(() => {
          console.log('WhatsAppWidgetLoader: Retrying after delay...');
          if (window.WhatsAppWidget) {
            window.WhatsAppWidget.init({
              phone: '+27616583827',
              message: 'Hello! How can I help you?',
            });
            console.log('WhatsAppWidgetLoader: Widget initialized on retry');
          } else {
            console.log('WhatsAppWidgetLoader: Still not available after retry');
          }
        }, 1000);
      }
    };
    
    script.onerror = (error) => {
      console.error('WhatsAppWidgetLoader: Script failed to load:', error);
    };
    
    document.body.appendChild(script);
    console.log('WhatsAppWidgetLoader: Script appended to body');
  }, []);

  return null;
};

export default WhatsAppWidgetLoader;
