import { useState } from 'react';
import { Music, Play, Pause, Download, Heart, Headphones, Book, Video, Mic, Gamepad2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Resource {
  id: string;
  title: string;
  description: string;
  duration: string;
  category: string;
  language: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  isPlaying?: boolean;
}

const WellnessHub = () => {
  const [playingId, setPlayingId] = useState<string | null>(null);

  const musicResources: Resource[] = [
    {
      id: 'music-1',
      title: 'Peaceful Meditation Music',
      description: 'Gentle instrumental music designed to reduce stress and promote relaxation',
      duration: '45 min',
      category: 'Ambient',
      language: 'Universal',
      difficulty: 'Beginner',
    },
    {
      id: 'music-2',
      title: 'Nature Sounds Collection',
      description: 'Rain, ocean waves, and forest sounds to help you unwind and focus',
      duration: '60 min',
      category: 'Nature',
      language: 'Universal',
      difficulty: 'Beginner',
    },
    {
      id: 'music-3',
      title: 'Binaural Beats for Focus',
      description: 'Scientifically designed frequencies to enhance concentration and reduce anxiety',
      duration: '30 min',
      category: 'Focus',
      language: 'Universal',
      difficulty: 'Intermediate',
    },
  ];

  const audioResources: Resource[] = [
    {
      id: 'audio-1',
      title: 'Progressive Muscle Relaxation',
      description: 'Step-by-step guided relaxation to release physical tension',
      duration: '20 min',
      category: 'Relaxation',
      language: 'English',
      difficulty: 'Beginner',
    },
    {
      id: 'audio-2',
      title: 'Mindfulness Meditation',
      description: 'Daily mindfulness practice to reduce stress and increase awareness',
      duration: '15 min',
      category: 'Meditation',
      language: 'Hindi',
      difficulty: 'Beginner',
    },
    {
      id: 'audio-3',
      title: 'Sleep Stories for Students',
      description: 'Calming bedtime stories designed to help you fall asleep peacefully',
      duration: '25 min',
      category: 'Sleep',
      language: 'English',
      difficulty: 'Beginner',
    },
  ];

  const breathingExercises: Resource[] = [
    {
      id: 'breath-1',
      title: '4-7-8 Breathing Technique',
      description: 'Simple breathing pattern to quickly reduce anxiety and promote relaxation',
      duration: '5 min',
      category: 'Quick Relief',
      language: 'English',
      difficulty: 'Beginner',
    },
    {
      id: 'breath-2',
      title: 'Box Breathing for Students',
      description: 'Military-grade breathing technique to manage stress during exams',
      duration: '10 min',
      category: 'Stress Management',
      language: 'Tamil',
      difficulty: 'Intermediate',
    },
    {
      id: 'breath-3',
      title: 'Energizing Breath Work',
      description: 'Morning breathing exercises to boost energy and mental clarity',
      duration: '8 min',
      category: 'Energy',
      language: 'Bengali',
      difficulty: 'Advanced',
    },
  ];

  const yogaVideos: Resource[] = [
    {
      id: 'yoga-1',
      title: 'Gentle Yoga for Beginners',
      description: 'Easy stretches and poses perfect for students with no yoga experience',
      duration: '30 min',
      category: 'Beginner Friendly',
      language: 'English',
      difficulty: 'Beginner',
    },
    {
      id: 'yoga-2',
      title: 'Desk Yoga for Students',
      description: 'Simple stretches you can do at your study desk to relieve tension',
      duration: '15 min',
      category: 'Quick Session',
      language: 'Hindi',
      difficulty: 'Beginner',
    },
    {
      id: 'yoga-3',
      title: 'Restorative Evening Yoga',
      description: 'Calming yoga sequence to unwind after a stressful day of classes',
      duration: '45 min',
      category: 'Evening Practice',
      language: 'Marathi',
      difficulty: 'Intermediate',
    },
  ];

  const mentalHealthGames: Resource[] = [
    {
      id: 'game-1',
      title: 'Mindful Breathing Game',
      description: 'Interactive breathing exercises that help reduce anxiety through guided patterns',
      duration: '5-10 min',
      category: 'Relaxation',
      language: 'Universal',
      difficulty: 'Beginner',
    },
    {
      id: 'game-2',
      title: 'Mood Matching Memory',
      description: 'Cognitive game that helps identify and process emotions while improving memory',
      duration: '10-15 min',
      category: 'Cognitive',
      language: 'English',
      difficulty: 'Intermediate',
    },
    {
      id: 'game-3',
      title: 'Stress Relief Puzzle',
      description: 'Calming puzzle games designed to reduce stress and improve focus',
      duration: '15-20 min',
      category: 'Focus',
      language: 'Hindi',
      difficulty: 'Beginner',
    },
  ];

  const mentalWellnessGuides: Resource[] = [
    {
      id: 'guide-1',
      title: 'Stress Management for Students',
      description: 'Comprehensive guide with practical strategies for managing academic stress',
      duration: '10 min read',
      category: 'Academic Wellness',
      language: 'English',
      difficulty: 'Beginner',
    },
    {
      id: 'guide-2',
      title: 'Building Resilience',
      description: 'Learn how to bounce back from setbacks and build mental strength',
      duration: '15 min read',
      category: 'Personal Growth',
      language: 'Telugu',
      difficulty: 'Intermediate',
    },
    {
      id: 'guide-3',
      title: 'Healthy Sleep Habits',
      description: 'Essential guide to improving sleep quality for better mental health',
      duration: '8 min read',
      category: 'Sleep Health',
      language: 'Punjabi',
      difficulty: 'Beginner',
    },
  ];

  const togglePlay = (id: string) => {
    setPlayingId(playingId === id ? null : id);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'success';
      case 'Intermediate': return 'warning';
      case 'Advanced': return 'destructive';
      default: return 'success';
    }
  };

  const ResourceCard = ({ resource, icon: Icon }: { resource: Resource; icon: any }) => (
    <Card className="therapeutic-card group">
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-therapeutic">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1 space-y-3">
          <div>
            <h3 className="font-poppins font-semibold text-lg mb-1">{resource.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{resource.description}</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="text-xs">
              {resource.duration}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {resource.language}
            </Badge>
            <Badge 
              variant={getDifficultyColor(resource.difficulty) as any}
              className="text-xs"
            >
              {resource.difficulty}
            </Badge>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="therapeutic"
              size="sm"
              onClick={() => togglePlay(resource.id)}
              className="flex items-center space-x-2"
            >
              {playingId === resource.id ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              <span>{playingId === resource.id ? 'Pause' : 'Play'}</span>
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="wellness-gradient py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Heart className="w-10 h-10 text-accent-foreground" />
          </div>
          <h1 className="text-4xl md:text-5xl font-poppins font-bold text-accent-foreground mb-4">
            Wellness & Relaxation Hub
          </h1>
          <p className="text-xl text-accent-foreground/80 max-w-3xl mx-auto">
            Discover calming resources, guided practices, and tools for mental wellness - 
            all designed specifically for students in regional languages.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="music" className="space-y-8">
            <TabsList className="grid w-full max-w-3xl mx-auto grid-cols-2 md:grid-cols-6 h-auto p-2 gap-1">
              <TabsTrigger value="music" className="flex items-center space-x-2 py-3">
                <Music className="w-4 h-4" />
                <span className="hidden sm:inline">Music</span>
              </TabsTrigger>
              <TabsTrigger value="audio" className="flex items-center space-x-2 py-3">
                <Headphones className="w-4 h-4" />
                <span className="hidden sm:inline">Audio</span>
              </TabsTrigger>
              <TabsTrigger value="breathing" className="flex items-center space-x-2 py-3">
                <Mic className="w-4 h-4" />
                <span className="hidden sm:inline">Breathing</span>
              </TabsTrigger>
              <TabsTrigger value="yoga" className="flex items-center space-x-2 py-3">
                <Video className="w-4 h-4" />
                <span className="hidden sm:inline">Yoga</span>
              </TabsTrigger>
              <TabsTrigger value="guides" className="flex items-center space-x-2 py-3">
                <Book className="w-4 h-4" />
                <span className="hidden sm:inline">Guides</span>
              </TabsTrigger>
              <TabsTrigger value="games" className="flex items-center space-x-2 py-3">
                <Gamepad2 className="w-4 h-4" />
                <span className="hidden sm:inline">Games</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="music" className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-poppins font-bold">Calming Music Playlists</h2>
                <p className="text-muted-foreground">Curated music collections to help you relax and focus</p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {musicResources.map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} icon={Music} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="audio" className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-poppins font-bold">Relaxation Audio</h2>
                <p className="text-muted-foreground">Guided meditations and relaxation sessions</p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {audioResources.map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} icon={Headphones} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="breathing" className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-poppins font-bold">Breathing Exercises</h2>
                <p className="text-muted-foreground">Simple techniques to reduce stress instantly</p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {breathingExercises.map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} icon={Mic} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="yoga" className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-poppins font-bold">Yoga Practice Videos</h2>
                <p className="text-muted-foreground">Gentle yoga sessions for stress relief and flexibility</p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {yogaVideos.map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} icon={Video} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="guides" className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-poppins font-bold">Mental Wellness Guides</h2>
                <p className="text-muted-foreground">Educational resources in regional languages</p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mentalWellnessGuides.map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} icon={Book} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="games" className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-poppins font-bold">Mental Health Games</h2>
                <p className="text-muted-foreground">Interactive games designed to improve mental wellness</p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mentalHealthGames.map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} icon={Gamepad2} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 calm-gradient">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl font-poppins font-bold text-accent-foreground">
            Need Personalized Support?
          </h2>
          <p className="text-lg text-accent-foreground/80">
            While these resources can help with daily wellness, remember that professional support is available when you need it.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="therapeutic" size="lg">
              Chat with AI Support
            </Button>
            <Button variant="outline" size="lg">
              Book Counseling Session
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WellnessHub;