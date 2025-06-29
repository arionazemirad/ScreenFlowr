import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import ScreenRecorder from "@/components/screen-recorder";
import { Button } from "@/components/ui/button";
import {
  Video,
  Users,
  Shield,
  Cloud,
  Star,
  PlayCircle,
  Download,
  Share2,
  Zap,
  Award,
  Globe,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Layers,
  BarChart,
  Upload,
} from "lucide-react";

export default function Home() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50'>
      {/* Header - Only show for signed out users */}
      <SignedOut>
        <header className='bg-white/90 backdrop-blur-md border-b border-yellow-200 sticky top-0 z-50 shadow-sm'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='flex justify-between items-center py-4'>
              <div className='flex items-center space-x-3'>
                <div className='relative'>
                  <Video className='w-8 h-8 text-yellow-600' />
                  <Sparkles className='w-4 h-4 text-yellow-500 absolute -top-1 -right-1' />
                </div>
                <div>
                  <h1 className='text-2xl font-bold text-gray-900'>
                    ScreenFlowr
                  </h1>
                  <p className='text-xs text-yellow-600 font-medium'>
                    Professional Recording
                  </p>
                </div>
              </div>

              <div className='flex items-center space-x-4'>
                <div className='hidden md:flex items-center space-x-4 text-sm'>
                  <a
                    href='#features'
                    className='text-gray-600 hover:text-yellow-600 transition-colors'
                  >
                    Features
                  </a>
                  <a
                    href='#pricing'
                    className='text-gray-600 hover:text-yellow-600 transition-colors'
                  >
                    Pricing
                  </a>
                  <a
                    href='#testimonials'
                    className='text-gray-600 hover:text-yellow-600 transition-colors'
                  >
                    Reviews
                  </a>
                </div>
                <SignInButton>
                  <Button
                    variant='outline'
                    size='sm'
                    className='border-yellow-300 hover:bg-yellow-50'
                  >
                    Sign In
                  </Button>
                </SignInButton>
                <SignInButton>
                  <Button size='sm' className='shadow-md'>
                    Start Recording
                  </Button>
                </SignInButton>
              </div>
            </div>
          </div>
        </header>
      </SignedOut>

      <main>
        <SignedOut>
          {/* Landing Page */}
          <div className='relative'>
            {/* Hero Section */}
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24'>
              <div className='text-center'>
                <div className='inline-flex items-center bg-yellow-100 text-yellow-800 text-sm font-medium px-4 py-2 rounded-full mb-6'>
                  <Zap className='w-4 h-4 mr-2' />
                  Now with AI-powered annotations
                </div>

                <h1 className='text-6xl font-bold text-gray-900 mb-8 leading-tight'>
                  Record. Annotate.{" "}
                  <span className='bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent'>
                    Flow.
                  </span>
                </h1>

                <p className='text-xl text-gray-600 mb-10 max-w-4xl mx-auto leading-relaxed'>
                  Create professional screen recordings with real-time
                  annotations, camera overlays, and seamless cloud integration.
                  Perfect for tutorials, presentations, product demos, and team
                  collaboration.
                </p>

                <div className='flex flex-col sm:flex-row gap-6 justify-center items-center mb-16'>
                  <SignInButton>
                    <Button
                      size='lg'
                      className='text-lg px-10 py-4 shadow-lg hover:shadow-xl transition-shadow'
                    >
                      <PlayCircle className='w-5 h-5 mr-2' />
                      Start Recording Free
                    </Button>
                  </SignInButton>
                  <Button
                    variant='outline'
                    size='lg'
                    className='text-lg px-10 py-4 border-yellow-300 hover:bg-yellow-50'
                  >
                    <Video className='w-5 h-5 mr-2' />
                    Watch Demo
                  </Button>
                </div>

                {/* Stats */}
                <div className='grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto'>
                  <div className='text-center'>
                    <div className='text-3xl font-bold text-yellow-600 mb-2'>
                      10M+
                    </div>
                    <div className='text-sm text-gray-600'>
                      Recordings Created
                    </div>
                  </div>
                  <div className='text-center'>
                    <div className='text-3xl font-bold text-yellow-600 mb-2'>
                      500K+
                    </div>
                    <div className='text-sm text-gray-600'>Active Users</div>
                  </div>
                  <div className='text-center'>
                    <div className='text-3xl font-bold text-yellow-600 mb-2'>
                      99.9%
                    </div>
                    <div className='text-sm text-gray-600'>Uptime</div>
                  </div>
                  <div className='text-center'>
                    <div className='text-3xl font-bold text-yellow-600 mb-2'>
                      4.9★
                    </div>
                    <div className='text-sm text-gray-600'>User Rating</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Features Section */}
            <div id='features' className='bg-white py-24'>
              <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='text-center mb-20'>
                  <h2 className='text-4xl font-bold text-gray-900 mb-6'>
                    Everything you need for professional recordings
                  </h2>
                  <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
                    Powerful features designed for educators, content creators,
                    product managers, and teams who demand quality and
                    efficiency.
                  </p>
                </div>

                <div className='grid md:grid-cols-3 gap-12'>
                  <div className='text-center p-8 rounded-2xl border border-yellow-100 hover:border-yellow-200 hover:shadow-lg transition-all'>
                    <div className='w-20 h-20 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6'>
                      <Video className='w-10 h-10 text-yellow-600' />
                    </div>
                    <h3 className='text-2xl font-semibold text-gray-900 mb-4'>
                      HD Screen + Camera Recording
                    </h3>
                    <p className='text-gray-600 mb-4'>
                      Record your screen in crystal-clear HD with a draggable
                      camera overlay. Perfect for tutorials, product demos, and
                      educational content.
                    </p>
                    <ul className='text-sm text-gray-600 space-y-2'>
                      <li className='flex items-center justify-center'>
                        <CheckCircle className='w-4 h-4 text-yellow-500 mr-2' />
                        Up to 4K resolution
                      </li>
                      <li className='flex items-center justify-center'>
                        <CheckCircle className='w-4 h-4 text-yellow-500 mr-2' />
                        60fps smooth recording
                      </li>
                      <li className='flex items-center justify-center'>
                        <CheckCircle className='w-4 h-4 text-yellow-500 mr-2' />
                        Multiple audio sources
                      </li>
                    </ul>
                  </div>

                  <div className='text-center p-8 rounded-2xl border border-yellow-100 hover:border-yellow-200 hover:shadow-lg transition-all'>
                    <div className='w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6'>
                      <Users className='w-10 h-10 text-blue-600' />
                    </div>
                    <h3 className='text-2xl font-semibold text-gray-900 mb-4'>
                      Real-time Smart Annotations
                    </h3>
                    <p className='text-gray-600 mb-4'>
                      Draw, highlight, and add smart callouts while recording.
                      AI-powered suggestions help emphasize key points
                      automatically.
                    </p>
                    <ul className='text-sm text-gray-600 space-y-2'>
                      <li className='flex items-center justify-center'>
                        <CheckCircle className='w-4 h-4 text-yellow-500 mr-2' />
                        Smart drawing tools
                      </li>
                      <li className='flex items-center justify-center'>
                        <CheckCircle className='w-4 h-4 text-yellow-500 mr-2' />
                        Auto-highlight detection
                      </li>
                      <li className='flex items-center justify-center'>
                        <CheckCircle className='w-4 h-4 text-yellow-500 mr-2' />
                        Custom color themes
                      </li>
                    </ul>
                  </div>

                  <div className='text-center p-8 rounded-2xl border border-yellow-100 hover:border-yellow-200 hover:shadow-lg transition-all'>
                    <div className='w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6'>
                      <Cloud className='w-10 h-10 text-green-600' />
                    </div>
                    <h3 className='text-2xl font-semibold text-gray-900 mb-4'>
                      Universal Cloud Integration
                    </h3>
                    <p className='text-gray-600 mb-4'>
                      Save locally or upload instantly to Google Drive, iCloud,
                      Dropbox, and 20+ other platforms. Share with a single
                      click.
                    </p>
                    <ul className='text-sm text-gray-600 space-y-2'>
                      <li className='flex items-center justify-center'>
                        <CheckCircle className='w-4 h-4 text-yellow-500 mr-2' />
                        20+ cloud platforms
                      </li>
                      <li className='flex items-center justify-center'>
                        <CheckCircle className='w-4 h-4 text-yellow-500 mr-2' />
                        Auto-sync capabilities
                      </li>
                      <li className='flex items-center justify-center'>
                        <CheckCircle className='w-4 h-4 text-yellow-500 mr-2' />
                        Shareable links
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Additional Features Row */}
                <div className='grid md:grid-cols-3 gap-12 mt-16'>
                  <div className='text-center p-6'>
                    <Share2 className='w-12 h-12 text-yellow-600 mx-auto mb-4' />
                    <h4 className='text-lg font-semibold text-gray-900 mb-2'>
                      Instant Sharing
                    </h4>
                    <p className='text-gray-600'>
                      Generate shareable links instantly or embed directly into
                      websites and presentations.
                    </p>
                  </div>
                  <div className='text-center p-6'>
                    <Download className='w-12 h-12 text-yellow-600 mx-auto mb-4' />
                    <h4 className='text-lg font-semibold text-gray-900 mb-2'>
                      Multiple Formats
                    </h4>
                    <p className='text-gray-600'>
                      Export in MP4, WebM, GIF, or audio-only formats. Optimized
                      for every platform.
                    </p>
                  </div>
                  <div className='text-center p-6'>
                    <Globe className='w-12 h-12 text-yellow-600 mx-auto mb-4' />
                    <h4 className='text-lg font-semibold text-gray-900 mb-2'>
                      Works Everywhere
                    </h4>
                    <p className='text-gray-600'>
                      Cross-platform compatibility with Windows, macOS, Linux,
                      and all modern browsers.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonials Section */}
            <div
              id='testimonials'
              className='bg-gradient-to-r from-yellow-50 to-orange-50 py-24'
            >
              <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='text-center mb-16'>
                  <h2 className='text-4xl font-bold text-gray-900 mb-4'>
                    Loved by creators worldwide
                  </h2>
                  <div className='flex justify-center items-center space-x-1 mb-4'>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className='w-6 h-6 text-yellow-500 fill-current'
                      />
                    ))}
                    <span className='ml-2 text-gray-600'>
                      4.9/5 from 10,000+ reviews
                    </span>
                  </div>
                </div>

                <div className='grid md:grid-cols-3 gap-8'>
                  <div className='bg-white p-8 rounded-2xl shadow-lg'>
                    <div className='flex items-center mb-4'>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className='w-4 h-4 text-yellow-500 fill-current'
                        />
                      ))}
                    </div>
                    <p className='text-gray-600 mb-6 italic'>
                      &ldquo;ScreenFlowr has revolutionized how I create
                      educational content. The real-time annotations are a
                      game-changer!&rdquo;
                    </p>
                    <div className='flex items-center'>
                      <div className='w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mr-4'>
                        <Users className='w-6 h-6 text-yellow-600' />
                      </div>
                      <div>
                        <div className='font-semibold text-gray-900'>
                          Sarah Chen
                        </div>
                        <div className='text-sm text-gray-600'>
                          Online Educator
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='bg-white p-8 rounded-2xl shadow-lg'>
                    <div className='flex items-center mb-4'>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className='w-4 h-4 text-yellow-500 fill-current'
                        />
                      ))}
                    </div>
                    <p className='text-gray-600 mb-6 italic'>
                      &ldquo;The cloud integration is seamless. I can record,
                      upload, and share with my team in seconds. Incredible
                      efficiency boost!&rdquo;
                    </p>
                    <div className='flex items-center'>
                      <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4'>
                        <Award className='w-6 h-6 text-blue-600' />
                      </div>
                      <div>
                        <div className='font-semibold text-gray-900'>
                          Marcus Rodriguez
                        </div>
                        <div className='text-sm text-gray-600'>
                          Product Manager
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='bg-white p-8 rounded-2xl shadow-lg'>
                    <div className='flex items-center mb-4'>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className='w-4 h-4 text-yellow-500 fill-current'
                        />
                      ))}
                    </div>
                    <p className='text-gray-600 mb-6 italic'>
                      &ldquo;Best screen recording tool I&apos;ve used. The
                      interface is intuitive and the quality is
                      professional-grade. Highly recommended!&rdquo;
                    </p>
                    <div className='flex items-center'>
                      <div className='w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4'>
                        <Video className='w-6 h-6 text-green-600' />
                      </div>
                      <div>
                        <div className='font-semibold text-gray-900'>
                          Emily Johnson
                        </div>
                        <div className='text-sm text-gray-600'>
                          Content Creator
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Section */}
            <div className='bg-white py-20'>
              <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='text-center'>
                  <div className='w-20 h-20 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6'>
                    <Shield className='w-10 h-10 text-yellow-600' />
                  </div>
                  <h2 className='text-3xl font-bold text-gray-900 mb-6'>
                    Enterprise-grade security & privacy
                  </h2>
                  <p className='text-xl text-gray-600 max-w-3xl mx-auto mb-8'>
                    All recordings are processed locally in your browser using
                    advanced WebRTC technology. Your sensitive data never
                    touches our servers unless you explicitly choose to upload
                    to your preferred cloud service.
                  </p>
                  <div className='grid md:grid-cols-3 gap-8 max-w-4xl mx-auto'>
                    <div className='flex flex-col items-center'>
                      <CheckCircle className='w-8 h-8 text-green-500 mb-2' />
                      <span className='font-medium'>End-to-end Encryption</span>
                    </div>
                    <div className='flex flex-col items-center'>
                      <CheckCircle className='w-8 h-8 text-green-500 mb-2' />
                      <span className='font-medium'>GDPR Compliant</span>
                    </div>
                    <div className='flex flex-col items-center'>
                      <CheckCircle className='w-8 h-8 text-green-500 mb-2' />
                      <span className='font-medium'>SOC 2 Certified</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className='bg-gradient-to-r from-yellow-500 to-orange-500 py-20'>
              <div className='max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8'>
                <h2 className='text-4xl font-bold text-black mb-6'>
                  Ready to create amazing recordings?
                </h2>
                <p className='text-xl text-black/80 mb-8'>
                  Join thousands of creators, educators, and professionals who
                  trust ScreenFlowr
                </p>
                <SignInButton>
                  <Button
                    size='lg'
                    className='bg-black text-white hover:bg-gray-800 text-lg px-10 py-4 shadow-xl'
                  >
                    <ArrowRight className='w-5 h-5 mr-2' />
                    Start Recording Now - Free
                  </Button>
                </SignInButton>
                <p className='text-sm text-black/70 mt-4'>
                  No credit card required • 5 minutes to get started
                </p>
              </div>
            </div>
          </div>
        </SignedOut>

        <SignedIn>
          {/* Enhanced Dashboard */}
          <div className='min-h-screen bg-gray-50'>
            {/* Dashboard Header */}
            <header className='bg-white border-b border-gray-200 sticky top-0 z-40'>
              <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='flex justify-between items-center py-4'>
                  <div className='flex items-center space-x-4'>
                    <div className='flex items-center space-x-3'>
                      <div className='relative'>
                        <Video className='w-8 h-8 text-yellow-600' />
                        <Sparkles className='w-4 h-4 text-yellow-500 absolute -top-1 -right-1' />
                      </div>
                      <div>
                        <h1 className='text-2xl font-bold text-gray-900'>
                          ScreenFlowr
                        </h1>
                        <p className='text-xs text-yellow-600 font-medium'>
                          Dashboard
                        </p>
                      </div>
                    </div>
                    <div className='h-8 w-px bg-gray-300'></div>
                    <nav className='hidden md:flex space-x-6'>
                      <button className='text-yellow-600 font-medium px-3 py-2 rounded-lg bg-yellow-50'>
                        <Video className='w-4 h-4 inline mr-2' />
                        Record
                      </button>
                      <button className='text-gray-600 hover:text-yellow-600 font-medium px-3 py-2 rounded-lg hover:bg-gray-50'>
                        <Layers className='w-4 h-4 inline mr-2' />
                        Library
                      </button>
                      <button className='text-gray-600 hover:text-yellow-600 font-medium px-3 py-2 rounded-lg hover:bg-gray-50'>
                        <BarChart className='w-4 h-4 inline mr-2' />
                        Analytics
                      </button>
                    </nav>
                  </div>
                  <div className='flex items-center space-x-4'>
                    <div className='hidden md:flex items-center space-x-3 text-sm text-gray-600'>
                      <div className='flex items-center space-x-1'>
                        <div className='w-2 h-2 bg-green-400 rounded-full'></div>
                        <span>Online</span>
                      </div>
                      <div className='h-4 w-px bg-gray-300'></div>
                      <span>Pro Plan</span>
                    </div>
                    <UserButton afterSignOutUrl='/' />
                  </div>
                </div>
              </div>
            </header>

            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
              <div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
                {/* Main Content */}
                <div className='lg:col-span-3 space-y-8'>
                  {/* Quick Stats */}
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                    <div className='bg-white rounded-xl p-6 shadow-sm border border-gray-200'>
                      <div className='flex items-center justify-between'>
                        <div>
                          <p className='text-sm font-medium text-gray-600'>
                            Total Recordings
                          </p>
                          <p className='text-3xl font-bold text-gray-900'>24</p>
                          <p className='text-sm text-green-600 mt-1'>
                            +3 this week
                          </p>
                        </div>
                        <div className='p-3 bg-blue-50 rounded-lg'>
                          <Video className='w-6 h-6 text-blue-600' />
                        </div>
                      </div>
                    </div>
                    <div className='bg-white rounded-xl p-6 shadow-sm border border-gray-200'>
                      <div className='flex items-center justify-between'>
                        <div>
                          <p className='text-sm font-medium text-gray-600'>
                            Storage Used
                          </p>
                          <p className='text-3xl font-bold text-gray-900'>
                            2.1GB
                          </p>
                          <p className='text-sm text-gray-600 mt-1'>
                            of 10GB available
                          </p>
                        </div>
                        <div className='p-3 bg-yellow-50 rounded-lg'>
                          <Cloud className='w-6 h-6 text-yellow-600' />
                        </div>
                      </div>
                    </div>
                    <div className='bg-white rounded-xl p-6 shadow-sm border border-gray-200'>
                      <div className='flex items-center justify-between'>
                        <div>
                          <p className='text-sm font-medium text-gray-600'>
                            Watch Time
                          </p>
                          <p className='text-3xl font-bold text-gray-900'>
                            4.2h
                          </p>
                          <p className='text-sm text-purple-600 mt-1'>
                            Total duration
                          </p>
                        </div>
                        <div className='p-3 bg-purple-50 rounded-lg'>
                          <PlayCircle className='w-6 h-6 text-purple-600' />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recording Interface */}
                  <div className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
                    <div className='p-6 border-b border-gray-200'>
                      <h2 className='text-xl font-semibold text-gray-900 mb-2'>
                        Start Recording
                      </h2>
                      <p className='text-gray-600'>
                        Create professional screen recordings with annotations
                        and camera overlay
                      </p>
                    </div>
                    <div className='p-0'>
                      <ScreenRecorder />
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className='space-y-6'>
                  {/* Quick Actions */}
                  <div className='bg-white rounded-xl p-6 shadow-sm border border-gray-200'>
                    <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                      Quick Actions
                    </h3>
                    <div className='space-y-3'>
                      <button className='w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-yellow-300 hover:bg-yellow-50 transition-colors'>
                        <div className='flex items-center space-x-3'>
                          <div className='p-2 bg-red-50 rounded-lg'>
                            <Video className='w-4 h-4 text-red-600' />
                          </div>
                          <span className='font-medium text-gray-900'>
                            Start Recording
                          </span>
                        </div>
                        <ArrowRight className='w-4 h-4 text-gray-400' />
                      </button>
                      <button className='w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-yellow-300 hover:bg-yellow-50 transition-colors'>
                        <div className='flex items-center space-x-3'>
                          <div className='p-2 bg-blue-50 rounded-lg'>
                            <Upload className='w-4 h-4 text-blue-600' />
                          </div>
                          <span className='font-medium text-gray-900'>
                            Upload Video
                          </span>
                        </div>
                        <ArrowRight className='w-4 h-4 text-gray-400' />
                      </button>
                      <button className='w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-yellow-300 hover:bg-yellow-50 transition-colors'>
                        <div className='flex items-center space-x-3'>
                          <div className='p-2 bg-green-50 rounded-lg'>
                            <Share2 className='w-4 h-4 text-green-600' />
                          </div>
                          <span className='font-medium text-gray-900'>
                            Share Library
                          </span>
                        </div>
                        <ArrowRight className='w-4 h-4 text-gray-400' />
                      </button>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className='bg-white rounded-xl p-6 shadow-sm border border-gray-200'>
                    <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                      Recent Activity
                    </h3>
                    <div className='space-y-4'>
                      <div className='flex items-start space-x-3'>
                        <div className='p-1.5 bg-green-50 rounded-lg mt-0.5'>
                          <CheckCircle className='w-3 h-3 text-green-600' />
                        </div>
                        <div className='flex-1 min-w-0'>
                          <p className='text-sm font-medium text-gray-900'>
                            Recording uploaded
                          </p>
                          <p className='text-xs text-gray-500'>
                            Product demo video • 2 minutes ago
                          </p>
                        </div>
                      </div>
                      <div className='flex items-start space-x-3'>
                        <div className='p-1.5 bg-blue-50 rounded-lg mt-0.5'>
                          <Share2 className='w-3 h-3 text-blue-600' />
                        </div>
                        <div className='flex-1 min-w-0'>
                          <p className='text-sm font-medium text-gray-900'>
                            Video shared
                          </p>
                          <p className='text-xs text-gray-500'>
                            Tutorial series • 1 hour ago
                          </p>
                        </div>
                      </div>
                      <div className='flex items-start space-x-3'>
                        <div className='p-1.5 bg-yellow-50 rounded-lg mt-0.5'>
                          <Download className='w-3 h-3 text-yellow-600' />
                        </div>
                        <div className='flex-1 min-w-0'>
                          <p className='text-sm font-medium text-gray-900'>
                            Export completed
                          </p>
                          <p className='text-xs text-gray-500'>
                            Meeting recording • 3 hours ago
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Storage Status */}
                  <div className='bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200'>
                    <div className='flex items-center justify-between mb-4'>
                      <h3 className='text-lg font-semibold text-gray-900'>
                        Storage
                      </h3>
                      <Cloud className='w-5 h-5 text-yellow-600' />
                    </div>
                    <div className='space-y-3'>
                      <div className='flex justify-between text-sm'>
                        <span className='text-gray-600'>Used</span>
                        <span className='font-medium text-gray-900'>
                          2.1 GB of 10 GB
                        </span>
                      </div>
                      <div className='w-full bg-gray-200 rounded-full h-2'>
                        <div
                          className='bg-yellow-500 h-2 rounded-full'
                          style={{ width: "21%" }}
                        ></div>
                      </div>
                      <button className='w-full text-center text-sm font-medium text-yellow-700 hover:text-yellow-800'>
                        Manage Storage
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SignedIn>
      </main>

      {/* Footer */}
      <footer className='bg-gray-900 text-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
          <div className='grid md:grid-cols-4 gap-8'>
            <div>
              <div className='flex items-center space-x-2 mb-4'>
                <Video className='w-6 h-6 text-yellow-500' />
                <span className='text-xl font-bold'>ScreenFlowr</span>
              </div>
              <p className='text-gray-400'>
                Professional screen recording made simple. Create, annotate, and
                share with ease.
              </p>
            </div>
            <div>
              <h4 className='font-semibold mb-4'>Product</h4>
              <ul className='space-y-2 text-gray-400'>
                <li>
                  <a
                    href='#'
                    className='hover:text-yellow-500 transition-colors'
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href='#'
                    className='hover:text-yellow-500 transition-colors'
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href='#'
                    className='hover:text-yellow-500 transition-colors'
                  >
                    Integrations
                  </a>
                </li>
                <li>
                  <a
                    href='#'
                    className='hover:text-yellow-500 transition-colors'
                  >
                    API
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className='font-semibold mb-4'>Support</h4>
              <ul className='space-y-2 text-gray-400'>
                <li>
                  <a
                    href='#'
                    className='hover:text-yellow-500 transition-colors'
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href='#'
                    className='hover:text-yellow-500 transition-colors'
                  >
                    Tutorials
                  </a>
                </li>
                <li>
                  <a
                    href='#'
                    className='hover:text-yellow-500 transition-colors'
                  >
                    Community
                  </a>
                </li>
                <li>
                  <a
                    href='#'
                    className='hover:text-yellow-500 transition-colors'
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className='font-semibold mb-4'>Company</h4>
              <ul className='space-y-2 text-gray-400'>
                <li>
                  <a
                    href='#'
                    className='hover:text-yellow-500 transition-colors'
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href='#'
                    className='hover:text-yellow-500 transition-colors'
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href='#'
                    className='hover:text-yellow-500 transition-colors'
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href='#'
                    className='hover:text-yellow-500 transition-colors'
                  >
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className='border-t border-gray-800 mt-8 pt-8 text-center text-gray-400'>
            <p>
              &copy; 2024 ScreenFlowr. Built with Next.js, React, and modern web
              technologies. Empowering creators worldwide.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
