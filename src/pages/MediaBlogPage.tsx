import React, { useState } from 'react';
import {
  Calendar,
  MapPin,
  PlayCircle,
  Image as ImageIcon,
  BookOpen,
  X,
  Phone,
} from 'lucide-react';
import {
  BlogPost,
  KAFFIIKA_ASSETS,
  PageRoute,
} from '../data/kaffiikaData';
import { PageHeaderBanner } from '../components/PageHeaderBanner';

interface MediaBlogPageProps {
  blogs: BlogPost[];
  onNavigate: (page: PageRoute) => void;
}

export const MediaBlogPage: React.FC<MediaBlogPageProps> = ({
  blogs,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'blogs' | 'videos' | 'gallery'>(
    'all'
  );
  const [lightboxImage, setLightboxImage] = useState<{
    url: string;
    title: string;
    category: string;
  } | null>(null);

  return (
    <div className="min-h-screen bg-[#F4F7FB]">
      <PageHeaderBanner
        title="Blogs, Educational Videos & Farm Gallery"
        subtitle="Stay updated with Kaffiika Animal Feeds farmer trainings in Jinja and across Uganda, watch educational feeding videos, and explore our field photo gallery."
        currentPage="media-gallery.html"
        badgeText="BLOGS • EDUCATIONAL VIDEOS • PHOTO GALLERY"
        onNavigate={onNavigate}
      />

      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">
        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2.5 bg-white p-3 rounded-2xl border border-sky-200 shadow-2xs">
          {[
            { id: 'all', label: 'All Media & News', icon: BookOpen },
            { id: 'blogs', label: `Blogs & Trainings (${blogs.length})`, icon: Calendar },
            {
              id: 'videos',
              label: `Educational Videos (${KAFFIIKA_ASSETS.educationalVideos.length})`,
              icon: PlayCircle,
            },
            {
              id: 'gallery',
              label: `Photo Gallery (${KAFFIIKA_ASSETS.gallery.length})`,
              icon: ImageIcon,
            },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#065AA7] text-white shadow-xs'
                    : 'bg-[#F4F7FB] text-[#0A1E3C] hover:bg-[#E6EFF8]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ==================== BLOGS & FARMER TRAININGS ==================== */}
        {(activeTab === 'all' || activeTab === 'blogs') && (
          <section className="space-y-6">
            <div>
              <span className="text-xs font-mono-tech uppercase tracking-wider text-[#065AA7] font-bold">
                OFFICIAL KAFFIIKA BLOGS
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0A1E3C]">
                Latest Blogs, Farmer Trainings & Seasonal Promotions
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {blogs.map((post) => (
                <article
                  key={post.id}
                  className="bg-white rounded-2xl border border-sky-200 overflow-hidden shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="h-56 bg-[#E6EFF8] relative overflow-hidden">
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded bg-[#065AA7] text-white font-mono-tech text-xs font-bold">
                        {post.category}
                      </span>
                    </div>

                    <div className="p-6">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-mono-tech mb-2">
                        <Calendar className="w-3.5 h-3.5 text-[#065AA7]" />
                        <span>{post.date}</span>
                        <span>•</span>
                        <span>Posted By: {post.author}</span>
                      </div>

                      <h3 className="text-xl font-bold text-[#0A1E3C] mb-2">
                        {post.title}
                      </h3>

                      {post.location && (
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#065AA7] bg-[#E6EFF8] px-3 py-1.5 rounded-lg mb-3">
                          <MapPin className="w-3.5 h-3.5 shrink-0" />
                          <span>{post.location}</span>
                        </div>
                      )}

                      <div className="space-y-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {post.content.map((para, idx) => (
                          <p key={idx}>{para}</p>
                        ))}
                      </div>
                    </div>
                  </div>

                  {post.contacts && (
                    <div className="px-6 pb-5 pt-3 border-t border-sky-100">
                      <div className="text-xs font-bold text-[#0A1E3C] mb-1.5">
                        Training Inquiries:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {post.contacts.map((c) => (
                          <a
                            key={c}
                            href={`tel:${c.replace(/\s+/g, '')}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#F4F7FB] hover:bg-[#065AA7] hover:text-white text-[#065AA7] font-mono-tech text-xs font-bold border border-sky-200 transition-colors"
                          >
                            <Phone className="w-3 h-3" />
                            <span>{c}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {/* ==================== EDUCATIONAL VIDEOS ==================== */}
        {(activeTab === 'all' || activeTab === 'videos') && (
          <section className="space-y-6 pt-4">
            <div>
              <span className="text-xs font-mono-tech uppercase tracking-wider text-[#065AA7] font-bold">
                EDUCATIONAL VIDEOS • KAFFIIKAFEEDS.COM
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0A1E3C]">
                Educational Livestock & Feed Formulation Videos
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {KAFFIIKA_ASSETS.educationalVideos.map((vid) => (
                <div
                  key={vid.id}
                  className="bg-white rounded-2xl border border-sky-200 overflow-hidden shadow-xs"
                >
                  <div className="aspect-video w-full bg-[#061A36]">
                    <iframe
                      src={vid.embedUrl}
                      title={vid.title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <div className="p-6">
                    <span className="text-xs font-mono-tech font-bold px-2.5 py-1 rounded bg-[#E6EFF8] text-[#065AA7]">
                      {vid.category}
                    </span>
                    <h3 className="text-lg font-bold text-[#0A1E3C] mt-2">
                      {vid.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                      {vid.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ==================== PHOTO GALLERY ==================== */}
        {(activeTab === 'all' || activeTab === 'gallery') && (
          <section className="space-y-6 pt-4">
            <div>
              <span className="text-xs font-mono-tech uppercase tracking-wider text-[#065AA7] font-bold">
                OFFICIAL FIELD & BRANCH GALLERY
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0A1E3C]">
                Kaffiika Animal Feeds Photo Gallery
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {KAFFIIKA_ASSETS.gallery.map((img) => (
                <div
                  key={img.id}
                  onClick={() => setLightboxImage(img)}
                  className="group relative h-60 rounded-2xl overflow-hidden border border-sky-200 bg-white shadow-xs cursor-pointer"
                >
                  <img
                    src={img.url}
                    alt={img.title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#061A36]/90 via-transparent to-transparent opacity-90 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                    <span className="text-[10px] font-mono-tech uppercase text-[#F59E0B] font-bold">
                      {img.category}
                    </span>
                    <h4 className="text-sm font-bold text-white leading-snug mt-0.5">
                      {img.title}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-[#061A36]/85 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <div
            className="max-w-3xl w-full bg-white rounded-2xl overflow-hidden border border-sky-200 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-3.5 bg-[#061A36] text-white flex items-center justify-between">
              <div>
                <span className="text-xs font-mono-tech text-[#F59E0B] uppercase font-bold">
                  {lightboxImage.category}
                </span>
                <h4 className="text-sm font-bold text-white">
                  {lightboxImage.title}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setLightboxImage(null)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <img
              src={lightboxImage.url}
              alt={lightboxImage.title}
              className="w-full max-h-[75vh] object-contain bg-black"
            />
          </div>
        </div>
      )}
    </div>
  );
};
