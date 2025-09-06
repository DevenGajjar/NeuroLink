import { useState } from 'react';
import { Calendar, Clock, User, MapPin, Star, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Therapist {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  location: string;
  image: string;
  experience: string;
  languages: string[];
}

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
  therapistId: string;
  date: string;
}

interface BookingStep {
  step: number;
  title: string;
  description: string;
}

const TherapistBooking = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const steps: BookingStep[] = [
    { step: 1, title: 'Choose Therapist', description: 'Select from available mental health professionals' },
    { step: 2, title: 'Pick Date & Time', description: 'Choose your preferred appointment slot' },
    { step: 3, title: 'Confirm Booking', description: 'Review and confirm your session' },
  ];

  const therapists: Therapist[] = [
    {
      id: 'th1',
      name: 'Dr. Sarah Johnson',
      specialty: 'Anxiety & Depression',
      rating: 4.9,
      reviews: 127,
      location: 'Campus Health Center - Room 201',
      image: '/placeholder-therapist-1.jpg',
      experience: '8 years',
      languages: ['English', 'Spanish']
    },
    {
      id: 'th2',
      name: 'Dr. Michael Chen',
      specialty: 'Academic Stress & ADHD',
      rating: 4.8,
      reviews: 93,
      location: 'Student Counseling - Building A',
      image: '/placeholder-therapist-2.jpg',
      experience: '6 years',
      languages: ['English', 'Mandarin']
    },
    {
      id: 'th3',
      name: 'Dr. Priya Sharma',
      specialty: 'Trauma & PTSD',
      rating: 4.9,
      reviews: 156,
      location: 'Wellness Center - 3rd Floor',
      image: '/placeholder-therapist-3.jpg',
      experience: '12 years',
      languages: ['English', 'Hindi', 'Telugu']
    },
    {
      id: 'th4',
      name: 'Dr. James Wilson',
      specialty: 'Relationship & Social Issues',
      rating: 4.7,
      reviews: 84,
      location: 'Psychology Department',
      image: '/placeholder-therapist-4.jpg',
      experience: '5 years',
      languages: ['English']
    },
    {
      id: 'th5',
      name: 'Dr. Maria Rodriguez',
      specialty: 'Eating Disorders & Body Image',
      rating: 4.8,
      reviews: 112,
      location: 'Health Services - Suite 105',
      image: '/placeholder-therapist-5.jpg',
      experience: '9 years',
      languages: ['English', 'Spanish', 'Portuguese']
    },
    {
      id: 'th6',
      name: 'Dr. Ahmed Hassan',
      specialty: 'Cultural Adjustment & Identity',
      rating: 4.9,
      reviews: 98,
      location: 'International Student Center',
      image: '/placeholder-therapist-6.jpg',
      experience: '7 years',
      languages: ['English', 'Arabic', 'French']
    }
  ];

  // Generate available dates for the next 14 days
  const generateDates = () => {
    const dates = [];
    for (let i = 1; i <= 14; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push({
        id: date.toISOString().split('T')[0],
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        date: date.getDate(),
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        full: date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
      });
    }
    return dates;
  };

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
  ];

  const dates = generateDates();

  const handleTherapistSelect = (therapist: Therapist) => {
    setSelectedTherapist(therapist);
    setCurrentStep(2);
  };

  const handleDateTimeSelect = (date: string, time: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
    setCurrentStep(3);
  };

  const handleBookingConfirm = () => {
    setBookingConfirmed(true);
    // Here you would typically send the booking data to your backend
  };

  const resetBooking = () => {
    setCurrentStep(1);
    setSelectedTherapist(null);
    setSelectedDate('');
    setSelectedTime('');
    setBookingConfirmed(false);
  };

  if (bookingConfirmed) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <div className="w-20 h-20 mx-auto booking-gradient rounded-full flex items-center justify-center animate-pulse-gentle">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-poppins font-bold text-gradient-primary">Booking Confirmed!</h1>
              <p className="text-xl text-muted-foreground">Your therapy session has been successfully scheduled</p>
            </div>
            
            <Card className="therapeutic-card text-left max-w-2xl mx-auto">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <User className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-poppins font-semibold">{selectedTherapist?.name}</h3>
                    <p className="text-muted-foreground">{selectedTherapist?.specialty}</p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">Date</p>
                      <p className="text-sm text-muted-foreground">
                        {dates.find(d => d.id === selectedDate)?.full}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">Time</p>
                      <p className="text-sm text-muted-foreground">{selectedTime}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 md:col-span-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-sm text-muted-foreground">{selectedTherapist?.location}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-accent/30 rounded-xl p-4">
                  <h4 className="font-semibold mb-2">Important Reminders:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Please arrive 10 minutes early for your appointment</li>
                    <li>• Bring a valid student ID</li>
                    <li>• You can reschedule up to 24 hours before your session</li>
                    <li>• A confirmation email has been sent to your student email</li>
                  </ul>
                </div>
              </div>
            </Card>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="therapeutic" size="lg">
                Add to Calendar
              </Button>
              <Button variant="outline" size="lg" onClick={resetBooking}>
                Book Another Session
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="booking-gradient py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Calendar className="w-10 h-10" />
          </div>
          <h1 className="text-4xl md:text-5xl font-poppins font-bold mb-4">
            Book Your Therapy Session
          </h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            Schedule an appointment with qualified mental health professionals on campus
          </p>
        </div>
      </section>

      {/* Progress Steps */}
      <section className="py-8 bg-secondary/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-8">
            {steps.map((step, index) => (
              <div key={step.step} className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-therapeutic",
                    currentStep >= step.step
                      ? "bg-primary text-primary-foreground shadow-therapeutic"
                      : "bg-muted text-muted-foreground"
                  )}>
                    {currentStep > step.step ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      step.step
                    )}
                  </div>
                  <div className="hidden md:block">
                    <p className="font-medium text-sm">{step.title}</p>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <ChevronRight className="w-4 h-4 text-muted-foreground hidden sm:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Step 1: Choose Therapist */}
          {currentStep === 1 && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-poppins font-bold mb-2">Choose Your Therapist</h2>
                <p className="text-muted-foreground">Select a mental health professional that matches your needs</p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {therapists.map((therapist) => (
                  <Card 
                    key={therapist.id} 
                    className="therapeutic-card cursor-pointer group hover:scale-[1.02] transition-therapeutic"
                    onClick={() => handleTherapistSelect(therapist)}
                  >
                    <div className="space-y-4">
                      <div className="flex items-start space-x-4">
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                          <User className="w-8 h-8 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-poppins font-semibold text-lg">{therapist.name}</h3>
                          <p className="text-primary font-medium">{therapist.specialty}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Star className="w-4 h-4 fill-warning text-warning" />
                            <span className="text-sm font-medium">{therapist.rating}</span>
                            <span className="text-sm text-muted-foreground">({therapist.reviews} reviews)</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">{therapist.location}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">{therapist.experience} experience</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {therapist.languages.map((lang) => (
                          <Badge key={lang} variant="secondary" className="text-xs">
                            {lang}
                          </Badge>
                        ))}
                      </div>
                      
                      <Button variant="therapeutic" className="w-full group-hover:shadow-large">
                        Select Therapist
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Pick Date & Time */}
          {currentStep === 2 && selectedTherapist && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-poppins font-bold mb-2">Select Date & Time</h2>
                <p className="text-muted-foreground">
                  Booking with <span className="font-medium text-primary">{selectedTherapist.name}</span>
                </p>
              </div>
              
              <div className="max-w-4xl mx-auto space-y-8">
                {/* Date Selection */}
                <div>
                  <h3 className="text-xl font-poppins font-semibold mb-4">Choose Date</h3>
                  <div className="grid grid-cols-7 gap-3">
                    {dates.map((date) => (
                      <button
                        key={date.id}
                        onClick={() => setSelectedDate(date.id)}
                        className={cn(
                          "p-3 rounded-xl text-center transition-therapeutic border-2",
                          selectedDate === date.id
                            ? "border-primary bg-primary/10 shadow-therapeutic"
                            : "border-border hover:border-primary/40 hover:bg-accent/30"
                        )}
                      >
                        <div className="text-xs text-muted-foreground">{date.day}</div>
                        <div className="text-lg font-semibold">{date.date}</div>
                        <div className="text-xs text-muted-foreground">{date.month}</div>
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Time Selection */}
                {selectedDate && (
                  <div>
                    <h3 className="text-xl font-poppins font-semibold mb-4">Choose Time</h3>
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                      {timeSlots.map((time) => (
                        <button
                          key={time}
                          onClick={() => handleDateTimeSelect(selectedDate, time)}
                          className={cn(
                            "p-3 rounded-xl text-center transition-therapeutic border-2 font-medium",
                            "border-border hover:border-primary/40 hover:bg-accent/30 hover:shadow-soft"
                          )}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex justify-center">
                <Button variant="outline" onClick={() => setCurrentStep(1)}>
                  <ChevronLeft className="w-4 h-4" />
                  Back to Therapists
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Confirm Booking */}
          {currentStep === 3 && selectedTherapist && selectedDate && selectedTime && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-poppins font-bold mb-2">Confirm Your Booking</h2>
                <p className="text-muted-foreground">Review your appointment details before confirming</p>
              </div>
              
              <Card className="therapeutic-card max-w-2xl mx-auto">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <User className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-poppins font-semibold">{selectedTherapist.name}</h3>
                      <p className="text-primary font-medium">{selectedTherapist.specialty}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Star className="w-4 h-4 fill-warning text-warning" />
                        <span className="text-sm font-medium">{selectedTherapist.rating}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium">Date</p>
                        <p className="text-sm text-muted-foreground">
                          {dates.find(d => d.id === selectedDate)?.full}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium">Time</p>
                        <p className="text-sm text-muted-foreground">{selectedTime}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 md:col-span-2">
                      <MapPin className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium">Location</p>
                        <p className="text-sm text-muted-foreground">{selectedTherapist.location}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline" onClick={() => setCurrentStep(2)}>
                  <ChevronLeft className="w-4 h-4" />
                  Change Time
                </Button>
                <Button variant="therapeutic" size="lg" onClick={handleBookingConfirm}>
                  Confirm Booking
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default TherapistBooking;