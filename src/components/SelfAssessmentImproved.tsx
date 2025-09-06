import { useState } from 'react';
import { ChevronRight, ChevronLeft, AlertTriangle, CheckCircle, Brain, TrendingUp, Target, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
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
  insights: {
    strengths: string[];
    areas_of_concern: string[];
    next_steps: string[];
  };
}

const SelfAssessmentImproved = () => {
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
      text: "How well have you been able to manage your daily responsibilities?",
      options: [
        { value: 0, label: "Very well" },
        { value: 1, label: "Somewhat well" },
        { value: 2, label: "Not very well" },
        { value: 3, label: "Not at all well" }
      ]
    }
  ];

  const calculateResults = (): AssessmentResult => {
    const totalScore = answers.reduce((sum, answer) => sum + answer, 0);
    const maxScore = questions.length * 3;
    
    if (totalScore <= 5) {
      return {
        score: totalScore,
        level: 'low',
        title: 'Positive Mental Health Status',
        description: 'Your responses indicate that you are generally managing well mentally and emotionally. You appear to have good coping strategies and mental resilience.',
        recommendations: [
          'Continue your current self-care practices',
          'Maintain regular exercise and healthy sleep patterns',
          'Consider joining wellness activities to maintain your positive mental state',
          'Use mindfulness techniques for stress prevention'
        ],
        resources: [
          'Wellness Hub meditation sessions',
          'Stress prevention workshops',
          'Peer support groups'
        ],
        insights: {
          strengths: [
            'Strong emotional regulation',
            'Good daily functioning',
            'Effective coping mechanisms'
          ],
          areas_of_concern: [
            'None identified at this time'
          ],
          next_steps: [
            'Continue current wellness practices',
            'Consider preventive mental health resources',
            'Schedule regular check-ins with yourself'
          ]
        }
      };
    } else if (totalScore <= 10) {
      return {
        score: totalScore,
        level: 'moderate',
        title: 'Moderate Stress Levels',
        description: 'Your responses suggest you may be experiencing some stress or mild emotional challenges. This is common among students, and there are effective strategies to help.',
        recommendations: [
          'Try stress management techniques like breathing exercises',
          'Consider speaking with a counselor or therapist',
          'Explore our wellness resources and guided meditation',
          'Maintain regular communication with friends and family'
        ],
        resources: [
          'AI Chat Support for immediate guidance',
          'Breathing exercises and meditation',
          'Book a session with on-campus therapist'
        ],
        insights: {
          strengths: [
            'Self-awareness about mental health',
            'Willingness to seek help'
          ],
          areas_of_concern: [
            'Moderate stress levels',
            'Some difficulty with daily functioning',
            'Mild emotional challenges'
          ],
          next_steps: [
            'Implement stress management techniques',
            'Consider professional support',
            'Monitor symptoms regularly'
          ]
        }
      };
    } else {
      return {
        score: totalScore,
        level: 'high',
        title: 'Significant Support Needed',
        description: 'Your responses indicate you may be experiencing significant mental health challenges. Please know that support is available, and reaching out is a sign of strength.',
        recommendations: [
          'Speak with a mental health professional as soon as possible',
          'Contact campus counseling services',
          'Reach out to trusted friends, family, or support network',
          'Consider crisis support if you are having thoughts of self-harm'
        ],
        resources: [
          'Campus counseling center - immediate appointment',
          '24/7 crisis support chat',
          'Emergency mental health resources'
        ],
        insights: {
          strengths: [
            'Courage to complete this assessment',
            'Self-awareness about current struggles'
          ],
          areas_of_concern: [
            'High levels of distress',
            'Significant impact on daily functioning',
            'Need for professional intervention'
          ],
          next_steps: [
            'Seek immediate professional support',
            'Create a safety plan',
            'Engage support network',
            'Follow up regularly with healthcare providers'
          ]
        }
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
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Brain className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-poppins font-bold mb-2">Assessment Complete!</h1>
            <p className="text-muted-foreground">Here's your comprehensive mental health report</p>
          </div>

          {/* Score Overview */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="text-center p-6 bg-gradient-calm">
              <div className="text-4xl font-bold text-primary mb-2">{result.score}/{questions.length * 3}</div>
              <div className="text-sm text-muted-foreground">Overall Score</div>
            </Card>
            <Card className="text-center p-6 bg-gradient-calm">
              <div className={`text-4xl font-bold mb-2 ${
                result.level === 'low' ? 'text-green-500' :
                result.level === 'moderate' ? 'text-yellow-500' :
                'text-red-500'
              }`}>
                {result.level === 'low' ? '✓' : result.level === 'moderate' ? '!' : '⚠'}
              </div>
              <div className="text-sm text-muted-foreground">Risk Level</div>
            </Card>
            <Card className="text-center p-6 bg-gradient-calm">
              <div className="text-4xl font-bold text-primary mb-2">{Math.round((1 - result.score / (questions.length * 3)) * 100)}%</div>
              <div className="text-sm text-muted-foreground">Wellness Score</div>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Main Results */}
            <Card className={cn(
              "p-8 border-2",
              result.level === 'low' && "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950",
              result.level === 'moderate' && "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950",
              result.level === 'high' && "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950"
            )}>
              <div className="flex items-start space-x-4">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center",
                  result.level === 'low' && "bg-green-100 dark:bg-green-900",
                  result.level === 'moderate' && "bg-yellow-100 dark:bg-yellow-900",
                  result.level === 'high' && "bg-red-100 dark:bg-red-900"
                )}>
                  {result.level === 'low' && <CheckCircle className="w-6 h-6 text-green-600" />}
                  {result.level === 'moderate' && <AlertTriangle className="w-6 h-6 text-yellow-600" />}
                  {result.level === 'high' && <AlertTriangle className="w-6 h-6 text-red-600" />}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-poppins font-bold mb-2">{result.title}</h2>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {result.description}
                  </p>
                  <Badge variant={result.level === 'low' ? 'default' : result.level === 'moderate' ? 'secondary' : 'destructive'}>
                    {result.level.toUpperCase()} PRIORITY
                  </Badge>
                </div>
              </div>
            </Card>

            {/* Detailed Insights */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  <h3 className="text-xl font-semibold">Your Strengths</h3>
                </div>
                <ul className="space-y-2">
                  {result.insights.strengths.map((strength, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-sm">{strength}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Target className="w-5 h-5 text-yellow-500" />
                  <h3 className="text-xl font-semibold">Areas to Focus On</h3>
                </div>
                <ul className="space-y-2">
                  {result.insights.areas_of_concern.map((area, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                      <span className="text-sm">{area}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>

            {/* Recommendations */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
                <Heart className="w-5 h-5 text-primary" />
                <span>Personalized Recommendations</span>
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Immediate Actions:</h4>
                  <ul className="space-y-1 text-sm">
                    {result.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-primary mt-1">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Next Steps:</h4>
                  <ul className="space-y-1 text-sm">
                    {result.insights.next_steps.map((step, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-primary mt-1">•</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>

            {/* Resources */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Recommended Resources</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {result.resources.map((resource, index) => (
                  <div key={index} className="p-4 bg-primary/5 rounded-lg">
                    <p className="text-sm font-medium">{resource}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={resetAssessment} variant="outline" size="lg">
                Take Assessment Again
              </Button>
              <Button variant="therapeutic" size="lg">
                Get Support Now
              </Button>
              <Button variant="calm" size="lg">
                Explore Wellness Resources
              </Button>
            </div>

            {/* Disclaimer */}
            <Card className="p-4 bg-muted/30 border-muted">
              <p className="text-xs text-muted-foreground text-center">
                <strong>Important:</strong> This assessment is for educational purposes and does not replace professional medical advice. 
                If you're experiencing thoughts of self-harm or crisis, please contact emergency services or a crisis helpline immediately.
              </p>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Brain className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-poppins font-bold mb-2">Mental Health Self-Assessment</h1>
          <p className="text-muted-foreground">
            Take a few minutes to assess your current mental wellbeing
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Question {currentQuestion + 1} of {questions.length}</span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="p-8 mb-8">
          <div className="space-y-6">
            <h2 className="text-xl font-semibold leading-relaxed">
              {questions[currentQuestion].text}
            </h2>
            
            <div className="space-y-3">
              {questions[currentQuestion].options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswerSelect(option.value)}
                  className={cn(
                    "w-full p-4 text-left rounded-xl border-2 transition-all duration-200",
                    selectedAnswer === option.value
                      ? "border-primary bg-primary/10 shadow-soft"
                      : "border-muted hover:border-primary/50 hover:bg-accent/30"
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <div className={cn(
                      "w-4 h-4 rounded-full border-2 transition-all",
                      selectedAnswer === option.value
                        ? "border-primary bg-primary"
                        : "border-muted"
                    )} />
                    <span className="font-medium">{option.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            variant="outline"
            size="lg"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={selectedAnswer === null}
            variant="therapeutic"
            size="lg"
          >
            {currentQuestion === questions.length - 1 ? 'Complete Assessment' : 'Next'}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Disclaimer */}
        <Card className="mt-8 p-4 bg-muted/30 border-muted">
          <p className="text-xs text-muted-foreground text-center">
            This assessment is not a diagnostic tool and cannot replace professional medical advice. 
            If you're experiencing a mental health crisis, please contact emergency services immediately.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default SelfAssessmentImproved;