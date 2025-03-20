
import React from "react";
import { Link } from "react-router-dom";
import { Activity, Users, BarChart2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="container px-4 py-8 mx-auto animate-slide-in">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-4">
            <span className="inline-block animate-float">
              <Activity className="h-8 w-8 inline-block text-primary mr-2" />
            </span>
            SocialLens Analytics
          </h1>
          
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Real-time insights into social media activity, users, and trending content.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <Card className="md:transform md:hover:-translate-y-1 transition-transform duration-200">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Top Users
              </CardTitle>
              <CardDescription>
                View the most active users based on post count
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Displays the top 5 users with the highest number of posts across the platform, with post counts and profile information.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild variant="ghost" className="gap-1">
                <Link to="/top-users">
                  View top users <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="md:transform md:hover:-translate-y-1 transition-transform duration-200">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <BarChart2 className="h-5 w-5 text-primary" />
                Trending Posts
              </CardTitle>
              <CardDescription>
                Discover most-discussed content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                See posts with the maximum number of comments, highlighting the most engaging and popular content.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild variant="ghost" className="gap-1">
                <Link to="/trending">
                  View trending posts <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="md:transform md:hover:-translate-y-1 transition-transform duration-200">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Live Feed
              </CardTitle>
              <CardDescription>
                Real-time post updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Monitor posts in real-time with newest content appearing at the top, automatically refreshing to show latest activity.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild variant="ghost" className="gap-1">
                <Link to="/feed">
                  View live feed <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="glass-card rounded-xl p-6 text-center">
          <h2 className="text-xl font-medium mb-3">Analytics Dashboard</h2>
          <p className="text-muted-foreground mb-4">
            This application provides real-time analytics for social media data, with optimized API usage and responsive design.
          </p>
          <Button asChild size="lg" className="mt-2">
            <Link to="/feed">
              Start Exploring
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
