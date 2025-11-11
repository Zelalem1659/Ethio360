import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, Eye, EyeOff, Save, X } from 'lucide-react';

const BreakingNewsAdmin = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMessage, setNewMessage] = useState({
    message: '',
    priority: 1,
    is_active: true
  });

  // Fetch all breaking news messages (for admin)
  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/admin/breaking-news-ticker`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      } else {
        console.error('Failed to fetch messages');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const createMessage = async () => {
    if (!newMessage.message.trim()) {
      alert('Message cannot be empty');
      return;
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/breaking-news-ticker`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMessage),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages([data.data, ...messages]);
        setNewMessage({ message: '', priority: 1, is_active: true });
        setShowAddForm(false);
        alert('Breaking news created successfully!');
      } else {
        alert('Failed to create message');
      }
    } catch (error) {
      console.error('Error creating message:', error);
      alert('Error creating message');
    }
  };

  const updateMessage = async (id, updatedData) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/breaking-news-ticker/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        fetchMessages(); // Refresh the list
        setEditingId(null);
        alert('Message updated successfully!');
      } else {
        alert('Failed to update message');
      }
    } catch (error) {
      console.error('Error updating message:', error);
      alert('Error updating message');
    }
  };

  const deleteMessage = async (id) => {
    if (!confirm('Are you sure you want to delete this breaking news message?')) {
      return;
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/breaking-news-ticker/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessages(messages.filter(msg => msg.id !== id));
        alert('Message deleted successfully!');
      } else {
        alert('Failed to delete message');
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Error deleting message');
    }
  };

  const toggleActive = (message) => {
    updateMessage(message.id, { ...message, is_active: !message.is_active });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3">Loading breaking news...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Breaking News Management</h2>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Breaking News
          </button>
        </div>

        {/* Add New Message Form */}
        {showAddForm && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-semibold mb-4">Add New Breaking News</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Breaking News Message
                </label>
                <textarea
                  value={newMessage.message}
                  onChange={(e) => setNewMessage({ ...newMessage, message: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter breaking news message..."
                />
              </div>
              <div className="flex space-x-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority (1 = highest)
                  </label>
                  <input
                    type="number"
                    value={newMessage.priority}
                    onChange={(e) => setNewMessage({ ...newMessage, priority: parseInt(e.target.value) })}
                    min="1"
                    max="10"
                    className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={newMessage.is_active}
                    onChange={(e) => setNewMessage({ ...newMessage, is_active: e.target.value === 'true' })}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value={true}>Active</option>
                    <option value={false}>Inactive</option>
                  </select>
                </div>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={createMessage}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-700 transition-colors"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Create
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-gray-600 transition-colors"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Messages List */}
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No breaking news messages found. Create one to get started!
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`border rounded-lg p-4 ${
                  message.is_active ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        message.is_active ? 'bg-green-600 text-white' : 'bg-gray-500 text-white'
                      }`}>
                        {message.is_active ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                      <span className="text-sm text-gray-500">
                        Priority: {message.priority}
                      </span>
                      <span className="text-sm text-gray-500">
                        Created: {new Date(message.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-800 text-sm leading-relaxed">
                      {message.message}
                    </p>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => toggleActive(message)}
                      className={`p-2 rounded ${
                        message.is_active
                          ? 'bg-orange-100 text-orange-600 hover:bg-orange-200'
                          : 'bg-green-100 text-green-600 hover:bg-green-200'
                      } transition-colors`}
                      title={message.is_active ? 'Deactivate' : 'Activate'}
                    >
                      {message.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => deleteMessage(message.id)}
                      className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BreakingNewsAdmin;