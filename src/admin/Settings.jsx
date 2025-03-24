import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  Save,
  Mail,
  Lock,
  Bell,
  Shield,
  Users,
  Globe,
  Database,
  FileText,
  Toggle,
  Smartphone,
  HelpCircle
} from 'lucide-react';

const SettingsPage = () => {
  // State for different settings sections
  const [activeTab, setActiveTab] = useState('general');
  const [isLoading, setIsLoading] = useState(false);
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'PSEVEN Admin Portal',
    siteDescription: 'Administrative dashboard for PSEVEN platform',
    enableMaintenanceMode: false,
    defaultLanguage: 'english',
    timezone: 'UTC'
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    desktopNotifications: true,
    marketingEmails: false,
    notifyNewUser: true,
    notifyNewOrder: true,
    notifySystemUpdates: true
  });
  
  const [securitySettings, setSecuritySettings] = useState({
    requireTwoFactor: false,
    sessionTimeout: 60,
    maxLoginAttempts: 5,
    passwordExpiration: 90,
    requireStrongPasswords: true,
    enableApiAccess: true
  });

  // Handler for saving settings
  const handleSaveSettings = (settingType) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success(`${settingType} settings saved successfully!`);
    }, 800);
  };

  // Settings tabs
  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'users', label: 'User Preferences', icon: Users },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'appearance', label: 'Appearance', icon: FileText },
    { id: 'integrations', label: 'Integrations', icon: Database },
    { id: 'mobile', label: 'Mobile App', icon: Smartphone },
    { id: 'advanced', label: 'Advanced', icon: HelpCircle }
  ];

  // Toggle settings handler
  const handleToggle = (settingType, field) => {
    if (settingType === 'general') {
      setGeneralSettings({
        ...generalSettings,
        [field]: !generalSettings[field]
      });
    } else if (settingType === 'notifications') {
      setNotificationSettings({
        ...notificationSettings,
        [field]: !notificationSettings[field]
      });
    } else if (settingType === 'security') {
      setSecuritySettings({
        ...securitySettings,
        [field]: !securitySettings[field]
      });
    }
  };

  // Input change handler
  const handleInputChange = (settingType, field, value) => {
    if (settingType === 'general') {
      setGeneralSettings({
        ...generalSettings,
        [field]: value
      });
    } else if (settingType === 'security') {
      setSecuritySettings({
        ...securitySettings,
        [field]: value
      });
    }
  };
  
  return (
    <>
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your admin dashboard configuration and preferences</p>
        </motion.div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Settings navigation */}
            <div className="md:w-64 border-r border-gray-200 bg-gray-50">
              <nav className="p-4 space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-600 font-medium'
                        : 'text-gray-700 hover:bg-blue-50/50 hover:text-blue-600'
                    }`}
                  >
                    <tab.icon className={`h-5 w-5 ${
                      activeTab === tab.id ? 'text-blue-600' : 'text-gray-500'
                    }`} />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Settings content */}
            <div className="flex-1 p-6">
              {/* General Settings */}
              {activeTab === 'general' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="border-b border-gray-200 pb-4">
                    <h2 className="text-lg font-medium text-gray-800">General Settings</h2>
                    <p className="text-sm text-gray-500">Basic configuration for your admin portal</p>
                  </div>
                  
                  <div className="grid gap-6">
                    <div className="grid gap-3">
                      <label className="text-sm font-medium text-gray-700">Site Name</label>
                      <input
                        type="text"
                        value={generalSettings.siteName}
                        onChange={(e) => handleInputChange('general', 'siteName', e.target.value)}
                        className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div className="grid gap-3">
                      <label className="text-sm font-medium text-gray-700">Site Description</label>
                      <textarea
                        value={generalSettings.siteDescription}
                        onChange={(e) => handleInputChange('general', 'siteDescription', e.target.value)}
                        className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
                        rows={3}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-700">Maintenance Mode</h3>
                        <p className="text-xs text-gray-500">Enable to show maintenance page to users</p>
                      </div>
                      <button
                        onClick={() => handleToggle('general', 'enableMaintenanceMode')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                          generalSettings.enableMaintenanceMode ? 'bg-blue-600' : 'bg-gray-200'
                        } transition-colors duration-200`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                            generalSettings.enableMaintenanceMode ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                    
                    <div className="grid gap-3">
                      <label className="text-sm font-medium text-gray-700">Default Language</label>
                      <select
                        value={generalSettings.defaultLanguage}
                        onChange={(e) => handleInputChange('general', 'defaultLanguage', e.target.value)}
                        className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="english">English</option>
                        <option value="spanish">Spanish</option>
                        <option value="french">French</option>
                        <option value="german">German</option>
                        <option value="chinese">Chinese</option>
                      </select>
                    </div>
                    
                    <div className="grid gap-3">
                      <label className="text-sm font-medium text-gray-700">Timezone</label>
                      <select
                        value={generalSettings.timezone}
                        onChange={(e) => handleInputChange('general', 'timezone', e.target.value)}
                        className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="UTC">UTC</option>
                        <option value="EST">Eastern Time (EST)</option>
                        <option value="CST">Central Time (CST)</option>
                        <option value="MST">Mountain Time (MST)</option>
                        <option value="PST">Pacific Time (PST)</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="pt-4 flex justify-end">
                    <button
                      onClick={() => handleSaveSettings('General')}
                      disabled={isLoading}
                      className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70"
                    >
                      {isLoading ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      Save Settings
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Notification Settings */}
              {activeTab === 'notifications' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="border-b border-gray-200 pb-4">
                    <h2 className="text-lg font-medium text-gray-800">Notification Settings</h2>
                    <p className="text-sm text-gray-500">Configure how and when you receive notifications</p>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-md font-medium text-gray-800">Notification Channels</h3>
                    
                    <div className="grid gap-4">
                      {[
                        { id: 'emailNotifications', label: 'Email Notifications', description: 'Receive notifications via email' },
                        { id: 'pushNotifications', label: 'Push Notifications', description: 'Receive browser push notifications' },
                        { id: 'smsNotifications', label: 'SMS Notifications', description: 'Receive text message notifications' },
                        { id: 'desktopNotifications', label: 'Desktop Notifications', description: 'Receive notifications in the admin panel' },
                        { id: 'marketingEmails', label: 'Marketing Emails', description: 'Receive promotional updates and newsletters' }
                      ].map((item) => (
                        <div key={item.id} className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-700">{item.label}</h4>
                            <p className="text-xs text-gray-500">{item.description}</p>
                          </div>
                          <button
                            onClick={() => handleToggle('notifications', item.id)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                              notificationSettings[item.id] ? 'bg-blue-600' : 'bg-gray-200'
                            } transition-colors duration-200`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                                notificationSettings[item.id] ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                    
                    <h3 className="text-md font-medium text-gray-800 mt-6">Event Notifications</h3>
                    
                    <div className="grid gap-4">
                      {[
                        { id: 'notifyNewUser', label: 'New User Registration', description: 'Get notified when a new user registers' },
                        { id: 'notifyNewOrder', label: 'New Order Received', description: 'Get notified when a new order is placed' },
                        { id: 'notifySystemUpdates', label: 'System Updates', description: 'Get notified about system updates and maintenance' }
                      ].map((item) => (
                        <div key={item.id} className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-700">{item.label}</h4>
                            <p className="text-xs text-gray-500">{item.description}</p>
                          </div>
                          <button
                            onClick={() => handleToggle('notifications', item.id)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                              notificationSettings[item.id] ? 'bg-blue-600' : 'bg-gray-200'
                            } transition-colors duration-200`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                                notificationSettings[item.id] ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-4 flex justify-end">
                    <button
                      onClick={() => handleSaveSettings('Notification')}
                      disabled={isLoading}
                      className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70"
                    >
                      {isLoading ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      Save Settings
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Security Settings */}
              {activeTab === 'security' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="border-b border-gray-200 pb-4">
                    <h2 className="text-lg font-medium text-gray-800">Security Settings</h2>
                    <p className="text-sm text-gray-500">Configure security options for your admin portal</p>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-700">Two-Factor Authentication</h3>
                        <p className="text-xs text-gray-500">Require 2FA for all admin users</p>
                      </div>
                      <button
                        onClick={() => handleToggle('security', 'requireTwoFactor')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                          securitySettings.requireTwoFactor ? 'bg-blue-600' : 'bg-gray-200'
                        } transition-colors duration-200`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                            securitySettings.requireTwoFactor ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-700">Strong Password Requirements</h3>
                        <p className="text-xs text-gray-500">Enforce minimum complexity requirements</p>
                      </div>
                      <button
                        onClick={() => handleToggle('security', 'requireStrongPasswords')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                          securitySettings.requireStrongPasswords ? 'bg-blue-600' : 'bg-gray-200'
                        } transition-colors duration-200`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                            securitySettings.requireStrongPasswords ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-700">API Access</h3>
                        <p className="text-xs text-gray-500">Allow API access to the admin portal</p>
                      </div>
                      <button
                        onClick={() => handleToggle('security', 'enableApiAccess')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                          securitySettings.enableApiAccess ? 'bg-blue-600' : 'bg-gray-200'
                        } transition-colors duration-200`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                            securitySettings.enableApiAccess ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="grid gap-3">
                        <label className="text-sm font-medium text-gray-700">Session Timeout (minutes)</label>
                        <input
                          type="number"
                          value={securitySettings.sessionTimeout}
                          onChange={(e) => handleInputChange('security', 'sessionTimeout', parseInt(e.target.value))}
                          min="5"
                          max="240"
                          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        <p className="text-xs text-gray-500">Automatically log out users after inactivity</p>
                      </div>
                      
                      <div className="grid gap-3">
                        <label className="text-sm font-medium text-gray-700">Max Login Attempts</label>
                        <input
                          type="number"
                          value={securitySettings.maxLoginAttempts}
                          onChange={(e) => handleInputChange('security', 'maxLoginAttempts', parseInt(e.target.value))}
                          min="1"
                          max="10"
                          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        <p className="text-xs text-gray-500">Lock account after failed attempts</p>
                      </div>
                      
                      <div className="grid gap-3">
                        <label className="text-sm font-medium text-gray-700">Password Expiration (days)</label>
                        <input
                          type="number"
                          value={securitySettings.passwordExpiration}
                          onChange={(e) => handleInputChange('security', 'passwordExpiration', parseInt(e.target.value))}
                          min="0"
                          max="365"
                          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        <p className="text-xs text-gray-500">0 for no expiration</p>
                      </div>
                    </div>
                    
                    <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <h3 className="text-sm font-medium text-yellow-800">Security Audit Log</h3>
                      <p className="text-xs text-yellow-700 mt-1">Security audit logs are retained for 90 days. You can download the logs for compliance purposes.</p>
                      <button className="mt-2 text-xs font-medium text-yellow-700 hover:text-yellow-800 underline">Download Audit Logs</button>
                    </div>
                  </div>
                  
                  <div className="pt-4 flex justify-end">
                    <button
                      onClick={() => handleSaveSettings('Security')}
                      disabled={isLoading}
                      className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70"
                    >
                      {isLoading ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      Save Settings
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Placeholder for other tabs */}
              {!['general', 'notifications', 'security'].includes(activeTab) && (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
    className="space-y-6"
  >
    <div className="border-b border-gray-200 pb-4">
      <h2 className="text-lg font-medium text-gray-800">{tabs.find(tab => tab.id === activeTab)?.label} Settings</h2>
      <p className="text-sm text-gray-500">This section is under development</p>
    </div>
    
    <div className="py-12 flex flex-col items-center justify-center text-center">
      <div className="bg-blue-50 p-4 rounded-full">
        {(() => {
          const IconComponent = tabs.find(tab => tab.id === activeTab)?.icon;
          return IconComponent ? <IconComponent className="h-8 w-8 text-blue-500" /> : null;
        })()}
      </div>
      <h3 className="mt-4 text-lg font-medium text-gray-800">Coming Soon</h3>
      <p className="mt-1 text-sm text-gray-600 max-w-md">
        The {tabs.find(tab => tab.id === activeTab)?.label.toLowerCase()} settings module is currently in development and will be available in a future update.
      </p>
    </div>
  </motion.div>
)}            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsPage;