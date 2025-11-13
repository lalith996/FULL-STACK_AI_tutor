import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import {
  User,
  Award,
  Settings,
  Shield,
  Bell,
  Mail,
  Lock,
  Globe,
  Palette,
  Save,
  Camera,
  TrendingUp,
  Calendar,
  Target,
} from 'lucide-react'
import BadgeShowcase from '@/components/gamification/BadgeShowcase'
import { Badge } from '@/types'

const ProfilePage = () => {
  const { user } = useAuthStore()
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState<'profile' | 'achievements' | 'settings' | 'security'>('profile')

  // Profile editing state
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.profile?.bio || '',
  })

  // Settings state
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    courseUpdates: true,
    weeklyDigest: true,
    language: 'en',
    theme: 'light',
  })

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const updateProfileMutation = useMutation({
    mutationFn: async (data: typeof profileData) => {
      // API call would go here
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] })
      toast.success('Profile updated successfully!')
      setIsEditingProfile(false)
    },
    onError: () => {
      toast.error('Failed to update profile')
    },
  })

  const changePasswordMutation = useMutation({
    mutationFn: async (data: typeof passwordData) => {
      // API call would go here
      return data
    },
    onSuccess: () => {
      toast.success('Password changed successfully!')
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    },
    onError: () => {
      toast.error('Failed to change password')
    },
  })

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateProfileMutation.mutate(profileData)
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    changePasswordMutation.mutate(passwordData)
  }

  const currentLevel = Math.floor((user?.profile?.points || 0) / 100) + 1
  const joinDate = user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : 'Unknown'

  // Mock badges data
  const mockBadges: Badge[] = [
    {
      _id: '1',
      name: 'First Steps',
      description: 'Complete your first lesson',
      category: 'achievement',
      rarity: 'common',
      points: 10,
      criteria: { type: 'lesson_completion', value: 1 }
    },
    {
      _id: '2',
      name: 'Quiz Master',
      description: 'Score 100% on a quiz',
      category: 'quiz-mastery',
      rarity: 'rare',
      points: 50,
      criteria: { type: 'quiz_perfect_score', value: 1 }
    },
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-primary-600 to-purple-600 rounded-lg p-8 text-white">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl font-semibold border-4 border-white/50">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center text-primary-600 hover:bg-gray-100 transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{user?.name}</h1>
              <p className="text-primary-100 mb-3">{user?.email}</p>
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>Level {currentLevel}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4" />
                  <span>{user?.profile?.points || 0} points</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {joinDate}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-6 py-2 rounded-md font-medium transition-colors whitespace-nowrap ${
            activeTab === 'profile'
              ? 'bg-white text-primary-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4" />
            <span>Profile</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('achievements')}
          className={`px-6 py-2 rounded-md font-medium transition-colors whitespace-nowrap ${
            activeTab === 'achievements'
              ? 'bg-white text-primary-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center space-x-2">
            <Award className="w-4 h-4" />
            <span>Achievements</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-6 py-2 rounded-md font-medium transition-colors whitespace-nowrap ${
            activeTab === 'settings'
              ? 'bg-white text-primary-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center space-x-2">
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`px-6 py-2 rounded-md font-medium transition-colors whitespace-nowrap ${
            activeTab === 'security'
              ? 'bg-white text-primary-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4" />
            <span>Security</span>
          </div>
        </button>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'profile' && (
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Profile Information</h2>
              {!isEditingProfile && (
                <button
                  onClick={() => setIsEditingProfile(true)}
                  className="btn btn-outline"
                >
                  Edit Profile
                </button>
              )}
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    disabled={!isEditingProfile}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    disabled={!isEditingProfile}
                    className="input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  disabled={!isEditingProfile}
                  rows={4}
                  className="input resize-none"
                  placeholder="Tell us about yourself..."
                />
              </div>

              {isEditingProfile && (
                <div className="flex items-center justify-end space-x-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingProfile(false)
                      setProfileData({
                        name: user?.name || '',
                        email: user?.email || '',
                        bio: user?.profile?.bio || '',
                      })
                    }}
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updateProfileMutation.isPending}
                    className="btn btn-primary flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>{updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                </div>
              )}
            </form>

            {/* Stats Section */}
            <div className="mt-8 pt-8 border-t">
              <h3 className="text-lg font-semibold mb-4">Learning Stats</h3>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{user?.enrolledCourses?.length || 0}</div>
                  <div className="text-sm text-gray-600 mt-1">Courses Enrolled</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{currentLevel}</div>
                  <div className="text-sm text-gray-600 mt-1">Current Level</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{user?.profile?.points || 0}</div>
                  <div className="text-sm text-gray-600 mt-1">Total Points</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{user?.profile?.badges?.length || 0}</div>
                  <div className="text-sm text-gray-600 mt-1">Badges Earned</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="space-y-6">
            <div className="card">
              <h2 className="text-xl font-semibold mb-6">Badges & Achievements</h2>
              <BadgeShowcase badges={mockBadges} userBadges={user?.profile?.badges || []} />
            </div>

            <div className="card">
              <h2 className="text-xl font-semibold mb-6">Certificates</h2>
              <div className="text-center py-12 text-gray-500">
                <Award className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p>No certificates earned yet</p>
                <p className="text-sm mt-2">Complete courses to earn certificates</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="card">
              <h2 className="text-xl font-semibold mb-6 flex items-center space-x-2">
                <Bell className="w-5 h-5" />
                <span>Notification Preferences</span>
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium">Email Notifications</h3>
                    <p className="text-sm text-gray-600">Receive notifications via email</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                    className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium">Course Updates</h3>
                    <p className="text-sm text-gray-600">Get notified about course updates</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.courseUpdates}
                    onChange={(e) => setSettings({ ...settings, courseUpdates: e.target.checked })}
                    className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium">Weekly Digest</h3>
                    <p className="text-sm text-gray-600">Receive weekly learning summary</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.weeklyDigest}
                    onChange={(e) => setSettings({ ...settings, weeklyDigest: e.target.checked })}
                    className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>

            <div className="card">
              <h2 className="text-xl font-semibold mb-6 flex items-center space-x-2">
                <Globe className="w-5 h-5" />
                <span>Language & Region</span>
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  <select
                    value={settings.language}
                    onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                    className="input"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="card">
              <h2 className="text-xl font-semibold mb-6 flex items-center space-x-2">
                <Palette className="w-5 h-5" />
                <span>Appearance</span>
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Theme
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => setSettings({ ...settings, theme: 'light' })}
                      className={`p-4 border-2 rounded-lg transition-all ${
                        settings.theme === 'light'
                          ? 'border-primary-600 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium">Light</div>
                    </button>
                    <button
                      onClick={() => setSettings({ ...settings, theme: 'dark' })}
                      className={`p-4 border-2 rounded-lg transition-all ${
                        settings.theme === 'dark'
                          ? 'border-primary-600 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium">Dark</div>
                    </button>
                    <button
                      onClick={() => setSettings({ ...settings, theme: 'auto' })}
                      className={`p-4 border-2 rounded-lg transition-all ${
                        settings.theme === 'auto'
                          ? 'border-primary-600 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium">Auto</div>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button className="btn btn-primary flex items-center space-x-2">
                <Save className="w-4 h-4" />
                <span>Save Settings</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="card">
              <h2 className="text-xl font-semibold mb-6 flex items-center space-x-2">
                <Lock className="w-5 h-5" />
                <span>Change Password</span>
              </h2>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="input"
                    required
                  />
                </div>
                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={changePasswordMutation.isPending}
                    className="btn btn-primary"
                  >
                    {changePasswordMutation.isPending ? 'Changing...' : 'Change Password'}
                  </button>
                </div>
              </form>
            </div>

            <div className="card">
              <h2 className="text-xl font-semibold mb-6 flex items-center space-x-2">
                <Mail className="w-5 h-5" />
                <span>Email Verification</span>
              </h2>
              <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-green-900">Email Verified</h3>
                    <p className="text-sm text-green-700">Your email address is verified</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card border-red-200">
              <h2 className="text-xl font-semibold mb-4 text-red-600">Danger Zone</h2>
              <div className="space-y-4">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h3 className="font-medium text-red-900 mb-2">Delete Account</h3>
                  <p className="text-sm text-red-700 mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <button className="btn bg-red-600 hover:bg-red-700 text-white">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProfilePage
