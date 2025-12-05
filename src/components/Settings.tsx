import { Palette, Monitor, Bell, Shield, Wifi, User, HardDrive, Zap } from 'lucide-react';
import { useState } from 'react';
import { useAppContext } from './AppContext';
import { Checkbox } from './ui/checkbox';
import { AppTemplate } from './apps/AppTemplate';

const settingsSidebar = {
  sections: [
    {
      title: 'System',
      items: [
        { id: 'appearance', label: 'Appearance', icon: Palette },
        { id: 'performance', label: 'Performance', icon: Zap },
        { id: 'displays', label: 'Displays', icon: Monitor },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'network', label: 'Network', icon: Wifi },
        { id: 'security', label: 'Security & Privacy', icon: Shield },
        { id: 'users', label: 'Users & Groups', icon: User },
        { id: 'storage', label: 'Storage', icon: HardDrive },
      ]
    }
  ]
};

const presetColors = [
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Purple', value: '#a855f7' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Green', value: '#10b981' },
  { name: 'Teal', value: '#14b8a6' },
  { name: 'Cyan', value: '#06b6d4' },
];

export function Settings() {
  const [activeSection, setActiveSection] = useState('appearance');
  const {
    accentColor,
    setAccentColor,
    themeMode,
    setThemeMode,
    blurEnabled,
    setBlurEnabled,
    reduceMotion,
    setReduceMotion,
    disableShadows,
    setDisableShadows
  } = useAppContext();
  const [customColor, setCustomColor] = useState(accentColor);

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomColor(value);
    setAccentColor(value);
  };

  const content = (
    <div className="p-8 max-w-3xl">
      {activeSection === 'appearance' && (
        <div>
          <h2 className="text-2xl text-white mb-6">Appearance</h2>

          {/* Accent Color Section */}
          <div className="bg-black/20 rounded-xl p-6 mb-6 border border-white/5">
            <h3 className="text-lg text-white mb-4">Accent Color</h3>
            <p className="text-sm text-white/60 mb-6">
              Choose an accent color to personalize your desktop experience
            </p>

            {/* Preset Colors */}
            <div className="mb-6">
              <label className="text-sm text-white/80 mb-3 block">Preset Colors</label>
              <div className="grid grid-cols-4 gap-3">
                {presetColors.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => {
                      setAccentColor(color.value);
                      setCustomColor(color.value);
                    }}
                    className={`relative h-12 rounded-lg transition-all ${accentColor === color.value
                      ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-800/40'
                      : 'hover:scale-105'
                      }`}
                    style={{ backgroundColor: color.value }}
                  >
                    {accentColor === color.value && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-4 h-4 bg-white rounded-full" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Color */}
            <div>
              <label className="text-sm text-white/80 mb-3 block">Custom Color</label>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <input
                    type="color"
                    value={customColor}
                    onChange={handleCustomColorChange}
                    className="w-16 h-16 rounded-lg cursor-pointer border-none"
                    style={{ padding: 0, background: customColor }}
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    value={customColor}
                    onChange={(e) => {
                      const value = e.target.value;
                      setCustomColor(value);
                      if (/^#[0-9A-F]{6}$/i.test(value)) {
                        setAccentColor(value);
                      }
                    }}
                    placeholder="#3b82f6"
                    className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                  />
                  <p className="text-xs text-white/40 mt-1">
                    Enter a hex color code (e.g., #3b82f6)
                  </p>
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <label className="text-sm text-white/80 mb-3 block">Preview</label>
              <div className="flex gap-3">
                <button
                  className="px-4 py-2 rounded-lg text-white transition-all"
                  style={{ backgroundColor: accentColor }}
                >
                  Primary Button
                </button>
                <button
                  className="px-4 py-2 rounded-lg transition-all border-2"
                  style={{ borderColor: accentColor, color: accentColor }}
                >
                  Outlined Button
                </button>
              </div>
            </div>
          </div>

          {/* Theme Mode Section */}
          <div className="bg-black/20 rounded-xl p-6 mb-6 border border-white/5">
            <h3 className="text-lg text-white mb-4">Theme Mode</h3>
            <p className="text-sm text-white/60 mb-6">
              Choose how the accent color affects background tints
            </p>

            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={() => setThemeMode('neutral')}
                className={`p-4 rounded-lg border-2 transition-all ${themeMode === 'neutral'
                  ? 'border-white/30 bg-white/10'
                  : 'border-white/10 hover:border-white/20 bg-black/20'
                  }`}
              >
                <div className="w-full h-16 bg-gradient-to-br from-gray-800 to-gray-900 rounded mb-3 border border-white/10" />
                <div className="text-white text-sm font-medium mb-1">Neutral</div>
                <div className="text-white/50 text-xs">Natural grays only</div>
              </button>

              <button
                onClick={() => setThemeMode('shades')}
                className={`p-4 rounded-lg border-2 transition-all ${themeMode === 'shades'
                  ? 'border-white/30 bg-white/10'
                  : 'border-white/10 hover:border-white/20 bg-black/20'
                  }`}
              >
                <div
                  className="w-full h-16 rounded mb-3 border border-white/10"
                  style={{
                    background: `linear-gradient(to bottom right, ${accentColor}40, ${accentColor}80)`
                  }}
                />
                <div className="text-white text-sm font-medium mb-1">Shades</div>
                <div className="text-white/50 text-xs">Accent color tints</div>
              </button>

              <button
                onClick={() => setThemeMode('contrast')}
                className={`p-4 rounded-lg border-2 transition-all ${themeMode === 'contrast'
                  ? 'border-white/30 bg-white/10'
                  : 'border-white/10 hover:border-white/20 bg-black/20'
                  }`}
              >
                <div className="w-full h-16 rounded mb-3 border border-white/10 bg-gradient-to-br from-orange-900/60 to-teal-900/60" />
                <div className="text-white text-sm font-medium mb-1">Contrast</div>
                <div className="text-white/50 text-xs">Complementary colors</div>
              </button>
            </div>
          </div>



          {/* Theme Section */}
          <div className="bg-black/20 rounded-xl p-6 border border-white/5">
            <h3 className="text-lg text-white mb-4">Theme</h3>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 rounded-lg bg-gray-900/50 border-2 border-white/20 hover:border-white/40 transition-all">
                <div className="w-full h-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded mb-3" />
                <span className="text-white text-sm">Dark</span>
              </button>
              <button className="p-4 rounded-lg bg-black/20 border border-white/10 hover:border-white/20 transition-all opacity-50 cursor-not-allowed">
                <div className="w-full h-20 bg-gradient-to-br from-gray-100 to-gray-300 rounded mb-3" />
                <span className="text-white/60 text-sm">Light (Coming Soon)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'performance' && (
        <div>
          <h2 className="text-2xl text-white mb-6">Performance</h2>

          {/* Blur & Transparency Toggle */}
          <div className="bg-black/20 rounded-xl p-6 mb-6 border border-white/5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg text-white mb-1">Blur & Transparency</h3>
                <p className="text-sm text-white/60">
                  Enable glass blur effect and window transparency
                </p>
              </div>
              <Checkbox
                checked={blurEnabled}
                onCheckedChange={(checked) => setBlurEnabled(checked === true)}
              />
            </div>
          </div>

          {/* Reduce Motion Toggle */}
          <div className="bg-black/20 rounded-xl p-6 mb-6 border border-white/5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg text-white mb-1">Reduce Motion</h3>
                <p className="text-sm text-white/60">
                  Disable animations for faster response and accessibility
                </p>
              </div>
              <Checkbox
                checked={reduceMotion}
                onCheckedChange={(checked) => setReduceMotion(checked === true)}
              />
            </div>
          </div>

          {/* Disable Shadows Toggle */}
          <div className="bg-black/20 rounded-xl p-6 border border-white/5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg text-white mb-1">Disable Shadows</h3>
                <p className="text-sm text-white/60">
                  Remove window shadows to improve rendering performance
                </p>
              </div>
              <Checkbox
                checked={disableShadows}
                onCheckedChange={(checked) => setDisableShadows(checked === true)}
              />
            </div>
          </div>
        </div>
      )}

      {activeSection === 'displays' && (
        <div>
          <h2 className="text-2xl text-white mb-6">Displays</h2>
          <div className="bg-black/20 rounded-xl p-6 border border-white/5">
            <p className="text-white/60">Display settings coming soon...</p>
          </div>
        </div>
      )}

      {activeSection === 'notifications' && (
        <div>
          <h2 className="text-2xl text-white mb-6">Notifications</h2>
          <div className="bg-black/20 rounded-xl p-6 border border-white/5">
            <p className="text-white/60">Notification settings coming soon...</p>
          </div>
        </div>
      )}

      {activeSection === 'network' && (
        <div>
          <h2 className="text-2xl text-white mb-6">Network</h2>
          <div className="bg-black/20 rounded-xl p-6 border border-white/5">
            <p className="text-white/60">Network settings coming soon...</p>
          </div>
        </div>
      )}

      {activeSection === 'security' && (
        <div>
          <h2 className="text-2xl text-white mb-6">Security & Privacy</h2>
          <div className="bg-black/20 rounded-xl p-6 border border-white/5">
            <p className="text-white/60">Security settings coming soon...</p>
          </div>
        </div>
      )}

      {activeSection === 'users' && (
        <div>
          <h2 className="text-2xl text-white mb-6">Users & Groups</h2>
          <div className="bg-black/20 rounded-xl p-6 border border-white/5">
            <p className="text-white/60">User settings coming soon...</p>
          </div>
        </div>
      )}

      {activeSection === 'storage' && (
        <div>
          <h2 className="text-2xl text-white mb-6">Storage</h2>
          <div className="bg-black/20 rounded-xl p-6 border border-white/5">
            <p className="text-white/60">Storage settings coming soon...</p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <AppTemplate
      sidebar={settingsSidebar}
      content={content}
      activeItem={activeSection}
      onItemClick={setActiveSection}
    />
  );
}
