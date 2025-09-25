import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const CommunityActivity = () => {
  const recentPosts = [
    {
      id: 1,
      author: "Sarah Nakato",
      location: "Mukono District",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      content: "Just harvested my first batch of improved maize variety. The yield is 40% higher than traditional seeds!",
      timestamp: "2 hours ago",
      likes: 24,
      comments: 8,
      image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=200&fit=crop",
      topic: "Crop Success"
    },
    {
      id: 2,
      author: "James Okello",
      location: "Gulu District",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      content: "Looking for advice on controlling coffee berry disease. Has anyone tried the new organic treatment methods?",
      timestamp: "4 hours ago",
      likes: 12,
      comments: 15,
      topic: "Disease Control"
    },
    {
      id: 3,
      author: "Mary Achieng",
      location: "Jinja District",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      content: "Weather forecast shows good rains next week. Perfect timing for bean planting in our area.",
      timestamp: "6 hours ago",
      likes: 18,
      comments: 6,
      topic: "Weather Update"
    }
  ];

  const trendingTopics = [
    { name: "Fall Armyworm Control", posts: 45, trend: "up" },
    { name: "Coffee Price Updates", posts: 32, trend: "up" },
    { name: "Drought Resistant Crops", posts: 28, trend: "stable" },
    { name: "Organic Farming", posts: 24, trend: "up" }
  ];

  const getTopicColor = (topic) => {
    switch (topic) {
      case 'Crop Success': return 'bg-success text-success-foreground';
      case 'Disease Control': return 'bg-warning text-warning-foreground';
      case 'Weather Update': return 'bg-primary text-primary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return 'TrendingUp';
      case 'down': return 'TrendingDown';
      default: return 'Minus';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-organic-sm">
      <div className="p-4 sm:p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Community Activity</h2>
          <Button variant="ghost" size="sm">
            <Icon name="MessageCircle" size={16} className="mr-2" />
            <span className="hidden sm:inline">Join Discussion</span>
          </Button>
        </div>
      </div>
      <div className="p-4 sm:p-6">
        {/* Recent Posts */}
        <div className="space-y-4 mb-6">
          {recentPosts?.map((post) => (
            <div key={post?.id} className="border border-border rounded-lg p-3 sm:p-4 hover:bg-muted/30 transition-colors">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                  <Image 
                    src={post?.avatar} 
                    alt={post?.author}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center space-x-2 mb-1 text-xs text-muted-foreground">
                    <h4 className="text-sm font-medium text-foreground text-black">{post?.author}</h4>
                    <span>•</span>
                    <span>{post?.location}</span>
                    <span className="hidden sm:inline">•</span>
                    <span className="hidden sm:inline">{post?.timestamp}</span>
                  </div>
                  
                  <div className="mb-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${getTopicColor(post?.topic)}`}>
                      {post?.topic}
                    </span>
                  </div>
                  
                  <p className="text-sm text-foreground mb-3">{post?.content}</p>
                  
                  {post?.image && (
                    <div className="mb-3 rounded-lg overflow-hidden">
                      <Image 
                        src={post?.image} 
                        alt="Post image"
                        className="w-full h-32 object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <button className="flex items-center space-x-1 hover:text-foreground transition-colors">
                      <Icon name="Heart" size={14} />
                      <span>{post?.likes}</span>
                    </button>
                    <button className="flex items-center space-x-1 hover:text-foreground transition-colors">
                      <Icon name="MessageCircle" size={14} />
                      <span>{post?.comments}</span>
                    </button>
                    <button className="flex items-center space-x-1 hover:text-foreground transition-colors">
                      <Icon name="Share2" size={14} />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trending Topics */}
        <div className="border-t border-border pt-6">
          <h3 className="text-sm font-medium text-foreground mb-4">Trending Topics</h3>
          <div className="space-y-2">
            {trendingTopics?.map((topic, index) => (
              <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-foreground truncate">{topic?.name}</span>
                  <span className="text-xs text-muted-foreground">({topic?.posts} posts)</span>
                </div>
                <Icon 
                  name={getTrendIcon(topic?.trend)} 
                  size={14} 
                  className={topic?.trend === 'up' ? 'text-success' : 'text-muted-foreground'} 
                />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-border">
          <Button 
            variant="outline" 
            className="w-full"
          >
            <Icon name="Plus" size={16} className="mr-2" />
            Create New Post
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CommunityActivity;