import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Heart, Plus, TrendingUp, Brain, Moon, Zap } from 'lucide-react';

const emotions = [
  { id: 'anxious', label: 'Anxious', color: 'bg-warning text-warning-foreground' },
  { id: 'stressed', label: 'Stressed', color: 'bg-destructive text-destructive-foreground' },
  { id: 'sad', label: 'Sad', color: 'bg-muted text-muted-foreground' },
  { id: 'calm', label: 'Calm', color: 'bg-success text-success-foreground' },
  { id: 'happy', label: 'Happy', color: 'bg-secondary-accent text-secondary-foreground' },
  { id: 'excited', label: 'Excited', color: 'bg-primary text-primary-foreground' },
  { id: 'overwhelmed', label: 'Overwhelmed', color: 'bg-warning text-warning-foreground' },
  { id: 'content', label: 'Content', color: 'bg-accent text-accent-foreground' },
];

const stressContributors = [
  'Exams', 'Assignments', 'Family', 'Finances', 'Health', 'Social', 'Work', 'Relationships'
];

const formSchema = z.object({
  overallMood: z.number().min(1).max(10),
  emotions: z.array(z.string()),
  energyLevel: z.number().min(1).max(10),
  hoursOfSleep: z.number().min(0).max(24),
  stressLevel: z.number().min(1).max(10),
  stressContributors: z.array(z.string()),
  journalEntry: z.string().optional(),
  copingStrategies: z.array(z.string()),
});

type FormData = z.infer<typeof formSchema>;

// Simple chart component
const SimpleLineChart = ({ data, title }: { data: { date: string; mood: number; stress: number; sleep: number }[], title: string }) => (
  <div className="space-y-4">
    <h4 className="font-semibold text-primary">{title}</h4>
    <div className="grid grid-cols-7 gap-2 text-xs">
      {data.map((item, index) => (
        <div key={index} className="text-center space-y-2">
          <div className="text-muted-foreground">
            {new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' })}
          </div>
          <div className="h-20 bg-muted rounded-lg flex flex-col justify-end p-1">
            <div 
              className="bg-primary rounded-sm mb-1"
              style={{ height: `${(item.mood / 10) * 100}%` }}
              title={`Mood: ${item.mood}/10`}
            />
            <div 
              className="bg-destructive rounded-sm"
              style={{ height: `${(item.stress / 10) * 80}%` }}
              title={`Stress: ${item.stress}/10`}
            />
          </div>
          <div className="text-xs">
            <div className="text-primary font-semibold">{item.mood}</div>
            <div className="text-destructive text-xs">{item.stress}</div>
          </div>
        </div>
      ))}
    </div>
    <div className="flex justify-center gap-4 text-xs">
      <div className="flex items-center gap-1">
        <div className="w-3 h-3 bg-primary rounded-sm"></div>
        <span>Mood</span>
      </div>
      <div className="flex items-center gap-1">
        <div className="w-3 h-3 bg-destructive rounded-sm"></div>
        <span>Stress</span>
      </div>
    </div>
  </div>
);

// Mock data for charts
const moodHistoryData = [
  { date: '2024-01-01', mood: 6, stress: 4, sleep: 7.5 },
  { date: '2024-01-02', mood: 7, stress: 3, sleep: 8 },
  { date: '2024-01-03', mood: 5, stress: 6, sleep: 6 },
  { date: '2024-01-04', mood: 8, stress: 2, sleep: 8.5 },
  { date: '2024-01-05', mood: 6, stress: 5, sleep: 7 },
  { date: '2024-01-06', mood: 9, stress: 1, sleep: 9 },
  { date: '2024-01-07', mood: 7, stress: 3, sleep: 8 },
];

export default function MoodTracking() {
  const [savedEntries, setSavedEntries] = useState<(FormData & { timestamp: Date; detailedReport?: any })[]>([]);
  const [newCoping, setNewCoping] = useState('');

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      overallMood: 5,
      emotions: [],
      energyLevel: 5,
      hoursOfSleep: 8,
      stressLevel: 5,
      stressContributors: [],
      journalEntry: '',
      copingStrategies: [],
    },
  });

  const generateDetailedReport = (data: FormData) => {
    const insights = [];
    const recommendations = [];
    const sleepGuidance = [];

    // Mood analysis
    if (data.overallMood >= 8) {
      insights.push("🌟 You're having an excellent day! Your mood is very positive.");
      recommendations.push("Share your positive energy with others or engage in activities you enjoy.");
    } else if (data.overallMood >= 6) {
      insights.push("😊 You're feeling good today with a solid mood score.");
      recommendations.push("Maintain this positive momentum through consistent self-care.");
    } else if (data.overallMood >= 4) {
      insights.push("😐 Your mood is neutral today - this is perfectly normal.");
      recommendations.push("Consider gentle activities like walking or listening to music to boost your mood.");
    } else {
      insights.push("😔 You're having a tough day. Remember, it's okay to have difficult days.");
      recommendations.push("Reach out to friends, practice self-compassion, or consider speaking with a counselor.");
    }

    // Stress analysis
    if (data.stressLevel >= 8) {
      insights.push("⚠️ High stress levels detected. This needs attention.");
      recommendations.push("Try immediate stress relief: deep breathing, short walks, or reaching out for support.");
      if (data.stressContributors.includes('Exams')) {
        recommendations.push("For exam stress: Break study sessions into chunks, use active recall, and ensure adequate breaks.");
      }
      if (data.stressContributors.includes('Finances')) {
        recommendations.push("For financial stress: Create a budget, explore student financial resources, or speak with a financial advisor.");
      }
    } else if (data.stressLevel >= 5) {
      insights.push("⚡ Moderate stress levels - manageable but worth addressing.");
      recommendations.push("Implement regular stress management techniques like meditation or exercise.");
    } else {
      insights.push("✅ Great job managing stress! Your levels are healthy.");
      recommendations.push("Continue your current stress management strategies.");
    }

    // Energy analysis
    if (data.energyLevel <= 3) {
      insights.push("🔋 Low energy detected. This could be affecting your daily functioning.");
      recommendations.push("Prioritize rest, proper nutrition, and gentle movement to restore energy.");
    } else if (data.energyLevel >= 8) {
      insights.push("⚡ High energy levels! You're feeling vibrant today.");
      recommendations.push("Channel this energy into productive activities or physical exercise.");
    }

    // Sleep analysis and guidance
    if (data.hoursOfSleep < 6) {
      insights.push("😴 Insufficient sleep detected. This significantly impacts mood and stress.");
      sleepGuidance.push("🎯 PRIORITY: Increase sleep to 7-9 hours for optimal mental health.");
      sleepGuidance.push("📱 Create a 'phone-free' bedroom environment");
      sleepGuidance.push("⏰ Set a consistent bedtime routine");
      sleepGuidance.push("☕ Avoid caffeine 6+ hours before sleep");
      recommendations.push("Focus on improving sleep hygiene as your top priority for better mood and reduced stress.");
    } else if (data.hoursOfSleep < 7) {
      insights.push("😴 Below optimal sleep. Small improvements could make a big difference.");
      sleepGuidance.push("🎯 Aim for 7-9 hours of sleep nightly");
      sleepGuidance.push("🌙 Try going to bed 30 minutes earlier");
      sleepGuidance.push("📚 Avoid screens 1 hour before bedtime");
      sleepGuidance.push("🫖 Consider herbal tea or light stretching before bed");
    } else if (data.hoursOfSleep <= 9) {
      insights.push("✅ Excellent sleep duration! This supports good mental health.");
      sleepGuidance.push("🌟 Great sleep habits! Keep it up");
      sleepGuidance.push("🔄 Maintain consistency, even on weekends");
      sleepGuidance.push("💡 Consider sleep quality: cool, dark, quiet room");
    } else {
      insights.push("😴 You might be oversleeping. Quality matters more than quantity.");
      sleepGuidance.push("⏰ Aim for 7-9 hours for optimal benefit");
      sleepGuidance.push("🌅 Try maintaining consistent wake times");
      sleepGuidance.push("💪 Gentle morning movement can improve sleep quality");
    }

    // Emotion pattern analysis
    if (data.emotions.includes('anxious') && data.stressLevel >= 6) {
      insights.push("🔍 Pattern detected: Anxiety paired with high stress.");
      recommendations.push("Practice grounding techniques: 5-4-3-2-1 sensory method or progressive muscle relaxation.");
    }

    if (data.emotions.includes('overwhelmed')) {
      insights.push("🌊 Feeling overwhelmed is a signal to slow down and prioritize.");
      recommendations.push("Break tasks into smaller, manageable steps. Practice saying 'no' to non-essential commitments.");
    }

    // Coping strategies feedback
    if (data.copingStrategies.length >= 3) {
      insights.push("💪 Excellent! You have multiple coping strategies available.");
    } else if (data.copingStrategies.length === 0) {
      recommendations.push("Develop a toolbox of coping strategies: breathing exercises, journaling, talking to friends, or physical activity.");
    }

    return {
      insights,
      recommendations,
      sleepGuidance,
      overallAssessment: data.overallMood >= 7 && data.stressLevel <= 4 ? 
        "🌟 Overall Assessment: Great mental health day! You're managing well." :
        data.overallMood <= 4 || data.stressLevel >= 7 ?
        "⚠️ Overall Assessment: This seems like a challenging day. Consider reaching out for support." :
        "⚖️ Overall Assessment: Mixed day with room for improvement. Focus on the recommendations below."
    };
  };

  const onSubmit = (data: FormData) => {
    const report = generateDetailedReport(data);
    const newEntry = {
      ...data,
      timestamp: new Date(),
      detailedReport: report,
    };
    setSavedEntries([newEntry, ...savedEntries]);
    form.reset();
    setNewCoping('');
  };

  const addCopingStrategy = () => {
    if (newCoping.trim()) {
      const currentStrategies = form.getValues('copingStrategies');
      form.setValue('copingStrategies', [...currentStrategies, newCoping.trim()]);
      setNewCoping('');
    }
  };

  const removeCopingStrategy = (index: number) => {
    const currentStrategies = form.getValues('copingStrategies');
    form.setValue('copingStrategies', currentStrategies.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-primary font-poppins">Tracking</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Track your daily mood, emotions, and well-being to gain insights into your mental health journey.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Mood Entry Form */}
          <div className="space-y-6">
            <Card className="therapeutic-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Heart className="w-5 h-5" />
                  Daily Mood Entry
                </CardTitle>
                <CardDescription>
                  Record how you're feeling today to track your emotional patterns.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Overall Mood */}
                    <FormField
                      control={form.control}
                      name="overallMood"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-primary font-semibold">Overall Mood (1-10)</FormLabel>
                          <FormControl>
                            <div className="space-y-3">
                              <Slider
                                value={[field.value]}
                                onValueChange={(value) => field.onChange(value[0])}
                                max={10}
                                min={1}
                                step={1}
                                className="w-full"
                              />
                              <div className="text-center">
                                <span className="text-2xl font-bold text-primary">{field.value}</span>
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Emotions */}
                    <FormField
                      control={form.control}
                      name="emotions"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-primary font-semibold">Emotions</FormLabel>
                          <FormDescription>
                            Select all emotions you're experiencing today.
                          </FormDescription>
                          <FormControl>
                            <div className="grid grid-cols-2 gap-3">
                              {emotions.map((emotion) => (
                                <div key={emotion.id} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={emotion.id}
                                    checked={field.value.includes(emotion.id)}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        field.onChange([...field.value, emotion.id]);
                                      } else {
                                        field.onChange(field.value.filter((id) => id !== emotion.id));
                                      }
                                    }}
                                  />
                                  <Label htmlFor={emotion.id} className="cursor-pointer">
                                    <Badge className={emotion.color}>{emotion.label}</Badge>
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Energy Level & Sleep */}
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="energyLevel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-primary font-semibold flex items-center gap-1">
                              <Zap className="w-4 h-4" />
                              Energy Level
                            </FormLabel>
                            <FormControl>
                              <div className="space-y-2">
                                <Slider
                                  value={[field.value]}
                                  onValueChange={(value) => field.onChange(value[0])}
                                  max={10}
                                  min={1}
                                  step={1}
                                />
                                <div className="text-center text-sm font-semibold text-primary">
                                  {field.value}/10
                                </div>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="hoursOfSleep"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-primary font-semibold flex items-center gap-1">
                              <Moon className="w-4 h-4" />
                              Hours of Sleep
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                max="24"
                                step="0.5"
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                className="text-center"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Stress Level */}
                    <FormField
                      control={form.control}
                      name="stressLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-primary font-semibold">Stress Level (1-10)</FormLabel>
                          <FormControl>
                            <div className="space-y-3">
                              <Slider
                                value={[field.value]}
                                onValueChange={(value) => field.onChange(value[0])}
                                max={10}
                                min={1}
                                step={1}
                              />
                              <div className="text-center">
                                <span className="text-2xl font-bold text-destructive">{field.value}</span>
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Stress Contributors */}
                    <FormField
                      control={form.control}
                      name="stressContributors"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-primary font-semibold">Stress Contributors</FormLabel>
                          <FormDescription>
                            What's contributing to your stress today?
                          </FormDescription>
                          <FormControl>
                            <div className="grid grid-cols-2 gap-3">
                              {stressContributors.map((contributor) => (
                                <div key={contributor} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={contributor}
                                    checked={field.value.includes(contributor)}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        field.onChange([...field.value, contributor]);
                                      } else {
                                        field.onChange(field.value.filter((c) => c !== contributor));
                                      }
                                    }}
                                  />
                                  <Label htmlFor={contributor} className="cursor-pointer">
                                    {contributor}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Journal Entry */}
                    <FormField
                      control={form.control}
                      name="journalEntry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-primary font-semibold">Journal Entry (Optional)</FormLabel>
                          <FormDescription>
                            Share any thoughts, feelings, or experiences from today.
                          </FormDescription>
                          <FormControl>
                            <Textarea
                              placeholder="What's on your mind today?"
                              className="min-h-24"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Coping Strategies */}
                    <FormField
                      control={form.control}
                      name="copingStrategies"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-primary font-semibold">Coping Strategies</FormLabel>
                          <FormDescription>
                            Add strategies that helped or might help you today.
                          </FormDescription>
                          <FormControl>
                            <div className="space-y-3">
                              <div className="flex gap-2">
                                <Input
                                  placeholder="Add a coping strategy..."
                                  value={newCoping}
                                  onChange={(e) => setNewCoping(e.target.value)}
                                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCopingStrategy())}
                                />
                                <Button type="button" onClick={addCopingStrategy} size="sm" variant="outline">
                                  <Plus className="w-4 h-4" />
                                </Button>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {field.value.map((strategy, index) => (
                                  <Badge
                                    key={index}
                                    variant="secondary"
                                    className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                                    onClick={() => removeCopingStrategy(index)}
                                  >
                                    {strategy} ×
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full" variant="therapeutic" size="lg">
                      Save Entry
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* Charts & Recent Entries */}
          <div className="space-y-6">
            {/* Charts */}
            <Card className="therapeutic-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <TrendingUp className="w-5 h-5" />
                  Mood Trends
                </CardTitle>
                <CardDescription>
                  Track your mood patterns over time.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SimpleLineChart data={moodHistoryData} title="Weekly Overview" />
              </CardContent>
            </Card>

            {/* Sleep vs Mood Chart */}
            <Card className="therapeutic-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Brain className="w-5 h-5" />
                  Sleep vs Mood Correlation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <h4 className="font-semibold text-primary">Sleep Patterns</h4>
                  <div className="grid grid-cols-7 gap-2">
                    {moodHistoryData.map((item, index) => (
                      <div key={index} className="text-center space-y-1">
                        <div className="text-xs text-muted-foreground">
                          {new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' })}
                        </div>
                        <div className="h-16 bg-muted rounded-lg flex flex-col justify-end p-1">
                          <div 
                            className="bg-secondary-accent rounded-sm"
                            style={{ height: `${(item.sleep / 10) * 100}%` }}
                            title={`Sleep: ${item.sleep}h`}
                          />
                        </div>
                        <div className="text-xs font-semibold text-primary">
                          {item.sleep}h
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Entries */}
            {savedEntries.length > 0 && (
              <Card className="therapeutic-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <Calendar className="w-5 h-5" />
                    Recent Entries
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {savedEntries.slice(0, 3).map((entry, index) => (
                    <div key={index} className="border border-border rounded-lg p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          {entry.timestamp.toLocaleString()}
                        </div>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                      
                      {/* Detailed Report */}
                      {entry.detailedReport && (
                        <div className="space-y-4 p-4 bg-secondary/30 rounded-lg">
                          <h4 className="font-semibold text-primary flex items-center gap-2">
                            <Brain className="w-4 h-4" />
                            Detailed Analysis & Insights
                          </h4>
                          
                          {/* Overall Assessment */}
                          <div className="p-3 bg-primary/10 rounded-lg">
                            <p className="text-sm font-medium">{entry.detailedReport.overallAssessment}</p>
                          </div>

                          {/* Key Insights */}
                          {entry.detailedReport.insights.length > 0 && (
                            <div className="space-y-2">
                              <h5 className="font-semibold text-sm text-primary">📊 Key Insights:</h5>
                              <ul className="space-y-1">
                                {entry.detailedReport.insights.map((insight, idx) => (
                                  <li key={idx} className="text-sm text-foreground bg-background p-2 rounded border-l-2 border-primary">
                                    {insight}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Sleep Guidance */}
                          {entry.detailedReport.sleepGuidance.length > 0 && (
                            <div className="space-y-2">
                              <h5 className="font-semibold text-sm text-primary flex items-center gap-1">
                                <Moon className="w-4 h-4" />
                                💤 Sleep Guidance:
                              </h5>
                              <ul className="space-y-1">
                                {entry.detailedReport.sleepGuidance.map((guidance, idx) => (
                                  <li key={idx} className="text-sm text-foreground bg-secondary/20 p-2 rounded border-l-2 border-secondary">
                                    {guidance}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Recommendations */}
                          {entry.detailedReport.recommendations.length > 0 && (
                            <div className="space-y-2">
                              <h5 className="font-semibold text-sm text-primary">💡 Recommendations:</h5>
                              <ul className="space-y-1">
                                {entry.detailedReport.recommendations.map((rec, idx) => (
                                  <li key={idx} className="text-sm text-foreground bg-accent/20 p-2 rounded border-l-2 border-accent">
                                    {rec}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                      
                       <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="space-y-1">
                          <span className="font-semibold text-primary">Mood:</span> 
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold">{entry.overallMood}/10</span>
                            <div className="flex-1 bg-muted rounded-full h-2">
                              <div 
                                className="bg-primary rounded-full h-2 transition-all"
                                style={{ width: `${(entry.overallMood / 10) * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <span className="font-semibold text-primary">Energy:</span> 
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold">{entry.energyLevel}/10</span>
                            <div className="flex-1 bg-muted rounded-full h-2">
                              <div 
                                className="bg-accent rounded-full h-2 transition-all"
                                style={{ width: `${(entry.energyLevel / 10) * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <span className="font-semibold text-primary">Sleep:</span> 
                          <div className="flex items-center gap-2">
                            <Moon className="w-4 h-4 text-primary" />
                            <span className="text-lg font-bold">{entry.hoursOfSleep}h</span>
                            <div className="text-xs text-muted-foreground">
                              {entry.hoursOfSleep >= 7 ? '✓ Good' : '⚠ Low'}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <span className="font-semibold text-primary text-sm">Stress Level:</span>
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-destructive">{entry.stressLevel}/10</span>
                            <div className="flex-1 bg-muted rounded-full h-2">
                              <div 
                                className="bg-destructive rounded-full h-2 transition-all"
                                style={{ width: `${(entry.stressLevel / 10) * 100}%` }}
                              />
                            </div>
                          </div>
                          {entry.stressContributors.length > 0 && (
                            <div className="text-xs text-muted-foreground">
                              Triggers: {entry.stressContributors.slice(0, 2).join(', ')}
                              {entry.stressContributors.length > 2 && ` +${entry.stressContributors.length - 2} more`}
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <span className="font-semibold text-primary text-sm">Basic Assessment:</span>
                          <div className="space-y-1">
                            <div className="text-sm">
                              {entry.overallMood >= 7 ? '😊 Good day' : entry.overallMood >= 4 ? '😐 Neutral day' : '😔 Tough day'}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {entry.stressLevel <= 3 && entry.energyLevel >= 7 ? 'High energy, low stress' :
                               entry.stressLevel >= 7 ? 'High stress detected' :
                               entry.energyLevel <= 3 ? 'Low energy noted' : 'Balanced state'}
                            </div>
                          </div>
                        </div>
                      </div>

                      {entry.emotions.length > 0 && (
                        <div className="space-y-2">
                          <span className="font-semibold text-primary text-sm">Emotions:</span>
                          <div className="flex flex-wrap gap-1">
                            {entry.emotions.map((emotionId) => {
                              const emotion = emotions.find(e => e.id === emotionId);
                              return emotion ? (
                                <Badge key={emotionId} className={emotion.color} variant="secondary">
                                  {emotion.label}
                                </Badge>
                              ) : null;
                            })}
                          </div>
                        </div>
                      )}

                      {entry.journalEntry && (
                        <div className="space-y-1">
                          <span className="font-semibold text-primary text-sm">Journal:</span>
                          <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                            {entry.journalEntry}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}