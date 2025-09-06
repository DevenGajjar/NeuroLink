import { useState } from 'react';
import { ChevronRight, ChevronLeft, AlertTriangle, CheckCircle, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface Question {
  id: number;
  text: string;
  options: { value: number; label: string }[];
}

interface AssessmentResult {
  score: number;
  level: 'low' | 'moderate' | 'high';
  title: string;
  description: string;
  recommendations: string[];
  resources: string[];
}

const SelfAssessment = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const questions: Question[] = [
    {
      id: 1,
      text: "Over the past two weeks, how often have you felt down, depressed, or hopeless?",
      options: [
        { value: 0, label: "Not at all" },
        { value: 1, label: "Several days" },
        { value: 2, label: "More than half the days" },
        { value: 3, label: "Nearly every day" }
      ]
    },
    {
      id: 2,
      text: "How often have you had little interest or pleasure in doing things?",
      options: [
        { value: 0, label: "Not at all" },
        { value: 1, label: "Several days" },
        { value: 2, label: "More than half the days" },
        { value: 3, label: "Nearly every day" }
      ]
    },
    {
      id: 3,
      text: "How often have you felt nervous, anxious, or on edge?",
      options: [
        { value: 0, label: "Not at all" },
        { value: 1, label: "Several days" },
        { value: 2, label: "More than half the days" },
        { value: 3, label: "Nearly every day" }
      ]
    },
    {
      id: 4,
      text: "How often have you been unable to stop or control worrying?",
      options: [
        { value: 0, label: "Not at all" },
        { value: 1, label: "Several days" },
        { value: 2, label: "More than half the days" },
        { value: 3, label: "Nearly every day" }
      ]
    },
    {
      id: 5,
      text: "How often have you had trouble falling or staying asleep?",
      options: [
        { value: 0, label: "Not at all" },
        { value: 1, label: "Several days" },
        { value: 2, label: "More than half the days" },
        { value: 3, label: "Nearly every day" }
      ]
    },
    {
      id: 6,
      text: "How often have you felt tired or had little energy?",
      options: [
        { value: 0, label: "Not at all" },
        { value: 1, label: "Several days" },
        { value: 2, label: "More than half the days" },
        { value: 3, label: "Nearly every day" }
      ]
    },
    {
      id: 7,
      text: "How often have you had trouble concentrating on things like schoolwork or reading?",
      options: [
        { value: 0, label: "Not at all" },
        { value: 1, label: "Several days" },
        { value: 2, label: "More than half the days" },
        { value: 3, label: "Nearly every day" }
      ]
    },
    {
      id: 8,
      text: "How often have you felt that you are a failure or have let yourself or your family down?",
      options: [
        { value: 0, label: "Not at all" },
        { value: 1, label: "Several days" },
        { value: 2, label: "More than half the days" },
        { value: 3, label: "Nearly every day" }
      ]
    }
  ];

  const calculateResults = (): AssessmentResult => {
    const totalScore = answers.reduce((sum, score) => sum + score, 0);
    const maxScore = questions.length * 3;
    const percentage = (totalScore / maxScore) * 100;

    if (percentage <= 25) {
      return {
        score: totalScore,
        level: 'low',
        title: 'Low Risk Level',
        description: 'Your responses suggest minimal symptoms of depression and anxiety. This is positive, but remember that mental health can change over time.',
        recommendations: [
          'Continue practicing good mental health habits',
          'Maintain regular exercise and sleep schedules',
          'Stay connected with friends and family',
          'Consider preventive resources in our Wellness Hub'
        ],
        resources: [
          'Wellness Hub - Daily mindfulness practices',
          'Campus mental health workshops',
          'Peer support groups for general wellbeing'
        ]
      };
    } else if (percentage <= 50) {
      return {
        score: totalScore,
        level: 'moderate',
        title: 'Moderate Risk Level',
        description: 'Your responses indicate some symptoms that may be affecting your daily life. Early intervention can be very helpful.',
        recommendations: [
          'Consider speaking with a counselor or therapist',
          'Practice stress management techniques',
          'Maintain social connections',
          'Monitor your symptoms and seek help if they worsen'
        ],
        resources: [
          'Book a session with campus counseling services',
          'Join our peer support community',
          'Access guided relaxation and coping resources',
          'Consider our AI chat support for ongoing help'
        ]
      };
    } else {
      return {
        score: totalScore,
        level: 'high',
        title: 'High Risk Level - Immediate Support Recommended',
        description: 'Your responses suggest significant symptoms that are likely impacting your daily functioning. Professional support is strongly recommended.',
        recommendations: [
          'Schedule an appointment with a mental health professional immediately',
          'Reach out to campus crisis support services',
          'Consider contacting a trusted friend or family member',
          'Call emergency services if you are having thoughts of self-harm'
        ],
        resources: [
          'Emergency: Call 988 (Suicide & Crisis Lifeline)',
          'Campus Crisis Line: Available 24/7',
          'Schedule immediate counseling appointment',
          'Crisis support chat available now'
        ]
      };
    }
  };

  const handleAnswerSelect = (value: number) => {
    setSelectedAnswer(value);
  };

  const handleNext = () => {
    if (selectedAnswer !== null) {
      const newAnswers = [...answers];
      newAnswers[currentQuestion] = selectedAnswer;
      setAnswers(newAnswers);
      setSelectedAnswer(null);

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setShowResults(true);
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(answers[currentQuestion - 1] || null);
    }
  };

  const resetAssessment = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
    setSelectedAnswer(null);
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const result = showResults ? calculateResults() : null;

  if (showResults && result) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Brain className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-poppins font-bold mb-2">Assessment Results</h1>
            <p className="text-muted-foreground">Based on your responses, here's your personalized report</p>
          </div>

          <div className="space-y-6">
            {/* Results Card */}
            <Card className={cn(
              "p-8 border-2",
              result.level === 'low' && "border-success/20 bg-success/5",
              result.level === 'moderate' && "border-warning/20 bg-warning/5",
              result.level === 'high' && "border-destructive/20 bg-destructive/5"
            )}>
              <div className="flex items-start space-x-4">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center",
                  result.level === 'low' && "bg-success/20",
                  result.level === 'moderate' && "bg-warning/20",
                  result.level === 'high' && "bg-destructive/20"
                )}>
                  {result.level === 'low' && <CheckCircle className="w-6 h-6 text-success" />}
                  {result.level === 'moderate' && <AlertTriangle className="w-6 h-6 text-warning" />}
                  {result.level === 'high' && <AlertTriangle className="w-6 h-6 text-destructive" />}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-poppins font-bold mb-2">{result.title}</h2>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {result.description}
                  </p>
                  <div className="text-sm text-muted-foreground">
                    Score: {result.score} / {questions.length * 3}
                  </div>
                </div>
              </div>
            </Card>

            {/* Recommendations */}
            <Card className="p-6">
              <h3 className="text-xl font-poppins font-semibold mb-4">Recommended Actions</h3>
              <ul className="space-y-3">
                {result.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                    <span className="text-muted-foreground">{rec}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Resources */}
            <Card className="p-6">
              <h3 className="text-xl font-poppins font-semibold mb-4">Available Resources</h3>
              <div className="space-y-3">
                {result.resources.map((resource, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-accent/30 rounded-lg">
                    <span className="text-sm font-medium">{resource}</span>
                    <Button variant="therapeutic" size="sm">
                      Access
                    </Button>
                  </div>
                ))}
              </div>
            </Card>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="therapeutic" size="lg">
                Book Counseling Session
              </Button>
              <Button variant="outline" size="lg" onClick={resetAssessment}>
                Retake Assessment
              </Button>
              <Button variant="calm" size="lg">
                Explore Wellness Hub
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl hero-gradient flex items-center justify-center">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-poppins font-bold mb-2">Mental Health Assessment</h1>
          <p className="text-muted-foreground">
            This confidential assessment helps identify potential mental health concerns
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-sm font-medium text-muted-foreground">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="p-8 mb-8 therapeutic-shadow">
          <h2 className="text-xl font-poppins font-semibold mb-6 leading-relaxed">
            {questions[currentQuestion].text}
          </h2>

          <div className="space-y-3">
            {questions[currentQuestion].options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAnswerSelect(option.value)}
                className={cn(
                  "w-full p-4 text-left rounded-2xl border-2 transition-therapeutic hover:shadow-soft",
                  selectedAnswer === option.value
                    ? "border-primary bg-primary/5 shadow-therapeutic"
                    : "border-border bg-card hover:border-primary/30"
                )}
              >
                <div className="flex items-center space-x-3">
                  <div className={cn(
                    "w-5 h-5 rounded-full border-2 transition-therapeutic",
                    selectedAnswer === option.value
                      ? "border-primary bg-primary"
                      : "border-muted"
                  )}>
                    {selectedAnswer === option.value && (
                      <div className="w-full h-full rounded-full bg-white scale-50"></div>
                    )}
                  </div>
                  <span className="font-medium">{option.label}</span>
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="flex items-center space-x-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </Button>

          <Button
            variant="therapeutic"
            onClick={handleNext}
            disabled={selectedAnswer === null}
            className="flex items-center space-x-2"
          >
            <span>{currentQuestion === questions.length - 1 ? 'Get Results' : 'Next'}</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 p-4 bg-muted/30 rounded-xl">
          <p className="text-sm text-muted-foreground text-center">
            <strong>Disclaimer:</strong> This assessment is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. If you're experiencing a mental health crisis, please contact emergency services or call 988.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SelfAssessment;