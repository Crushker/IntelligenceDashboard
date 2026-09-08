import { useState } from 'react';
import { videoItems } from '../data/mockData';
import { Play, Clock, ExternalLink, ChevronRight, BookOpen, Layers } from 'lucide-react';

export function VideoHub() {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [filterChannel, setFilterChannel] = useState('All');

  const channels = ['All', ...new Set(videoItems.map(v => v.channel))];
  const filtered = filterChannel === 'All' ? videoItems : videoItems.filter(v => v.channel === filterChannel);
  const activeVideo = videoItems.find(v => v.id === selectedVideo);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Video Intelligence Hub</h1>
        <p className="text-sm text-navy-400 mt-1">Curated technical deep-dives with AI-generated executive summaries and architecture notes</p>
      </div>

      {/* Channel Filter */}
      <div className="flex flex-wrap gap-2">
        {channels.map(channel => (
          <button
            key={channel}
            onClick={() => setFilterChannel(channel)}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
              filterChannel === channel
                ? 'bg-accent-gold text-navy-950'
                : 'bg-navy-800/60 text-navy-300 border border-navy-700/50 hover:border-navy-500/50'
            }`}
          >
            {channel}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Video List */}
        <div className="lg:col-span-2 space-y-4">
          {filtered.map((video) => (
            <div
              key={video.id}
              onClick={() => setSelectedVideo(video.id)}
              className={`glass-card rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ${
                selectedVideo === video.id ? 'border-accent-gold/50 shadow-lg shadow-accent-gold/10' : 'hover:border-navy-500/50'
              }`}
            >
              <div className="flex flex-col sm:flex-row">
                {/* Thumbnail */}
                <div className="relative sm:w-56 h-32 sm:h-auto bg-navy-800 flex-shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-navy-700/50 to-navy-900/80 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-accent-gold/20 flex items-center justify-center border border-accent-gold/40">
                      <Play className="w-5 h-5 text-accent-gold ml-0.5" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-navy-950/80 text-[10px] text-white font-medium">
                    {video.duration}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-medium text-accent-gold uppercase tracking-wider">{video.channel}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      video.relevance_score >= 9 ? 'bg-accent-red/20 text-accent-red' :
                      video.relevance_score >= 7 ? 'bg-amber-500/20 text-amber-400' :
                      'bg-accent-blue/20 text-accent-blue'
                    }`}>
                      Score: {video.relevance_score}/10
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-2 leading-snug">{video.title}</h3>
                  <p className="text-xs text-navy-300 line-clamp-2 mb-3">{video.executive_summary}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {video.applicable_layers.map(layer => (
                      <span key={layer} className="px-2 py-0.5 rounded bg-navy-700/50 text-[10px] text-navy-300 border border-navy-600/50">
                        {layer}
                      </span>
                    ))}
                    <span className="ml-auto text-[10px] text-navy-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(video.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Video Detail Panel */}
        <div className="space-y-4">
          {activeVideo ? (
            <>
              {/* Video Player Placeholder */}
              <div className="glass-card rounded-xl overflow-hidden">
                <div className="aspect-video bg-navy-800 flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-navy-700/30 to-navy-900/60" />
                  <div className="relative text-center">
                    <div className="w-16 h-16 rounded-full bg-accent-gold/20 flex items-center justify-center border-2 border-accent-gold/40 mx-auto mb-3">
                      <Play className="w-7 h-7 text-accent-gold ml-1" />
                    </div>
                    <p className="text-xs text-navy-400">Click to play on YouTube</p>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-white mb-1">{activeVideo.title}</h3>
                  <p className="text-xs text-navy-400">{activeVideo.channel} • {activeVideo.duration}</p>
                </div>
              </div>

              {/* Executive Summary */}
              <div className="glass-card rounded-xl p-5">
                <h4 className="text-xs font-semibold text-accent-gold uppercase tracking-wider mb-3 flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5" /> AI Executive Summary
                </h4>
                <p className="text-sm text-navy-200 leading-relaxed">{activeVideo.executive_summary}</p>
              </div>

              {/* Architecture Notes */}
              <div className="glass-card rounded-xl p-5">
                <h4 className="text-xs font-semibold text-accent-gold uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5" /> Architecture Notes
                </h4>
                <ul className="space-y-2">
                  {activeVideo.architecture_notes.map((note, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-navy-200">
                      <ChevronRight className="w-3 h-3 text-accent-gold mt-0.5 flex-shrink-0" />
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* External Link */}
              <a
                href={`https://youtube.com/watch?v=${activeVideo.video_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-lg border border-navy-700/50 text-sm text-navy-200 hover:bg-navy-800/50 transition-colors"
              >
                <ExternalLink className="w-4 h-4" /> Watch on YouTube
              </a>
            </>
          ) : (
            <div className="glass-card rounded-xl p-8 text-center">
              <BookOpen className="w-8 h-8 text-navy-600 mx-auto mb-3" />
              <p className="text-sm text-navy-400">Select a video to view AI-generated executive summary and architecture notes</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
