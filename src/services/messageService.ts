import { ContactMessage } from '../types';
import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase';

const INQUIRIES_KEY = 'anubama_portfolio_inquiries_v1';

const getStoredMessages = (): ContactMessage[] => {
  try {
    // Purge legacy keys if any
    localStorage.removeItem('sakura_portfolio_messages');

    const data = localStorage.getItem(INQUIRIES_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading messages from localStorage:', e);
  }
  
  const defaultInquiries: ContactMessage[] = [];
  localStorage.setItem(INQUIRIES_KEY, JSON.stringify(defaultInquiries));
  return defaultInquiries;
};

const saveStoredMessages = (messages: ContactMessage[]) => {
  try {
    localStorage.setItem(INQUIRIES_KEY, JSON.stringify(messages));
    window.dispatchEvent(new CustomEvent('anubama-inquiries-changed', { detail: messages }));
  } catch (e) {
    console.error('Error saving messages to localStorage:', e);
  }
};

export const messageService = {
  /**
   * Submit new contact message
   */
  async sendMessage(msg: { name: string; email: string; subject?: string; message: string }): Promise<ContactMessage> {
    const newMessage: ContactMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: msg.name.trim(),
      email: msg.email.trim(),
      subject: msg.subject?.trim() || 'Portfolio Inbound Inquiry',
      message: msg.message.trim(),
      timestamp: new Date().toISOString(),
      status: 'unread'
    };

    const client = getSupabaseClient();
    if (client && isSupabaseConfigured()) {
      try {
        await client.from('messages').insert([{
          id: newMessage.id,
          name: newMessage.name,
          email: newMessage.email,
          subject: newMessage.subject,
          message: newMessage.message,
          created_at: newMessage.timestamp,
          status: 'unread'
        }]);
      } catch (err) {
        console.warn('Supabase sendMessage warning:', err);
      }
    }

    const current = getStoredMessages();
    const updated = [newMessage, ...current];
    saveStoredMessages(updated);
    return newMessage;
  },

  /**
   * Get all messages for admin
   */
  async getMessages(): Promise<ContactMessage[]> {
    const client = getSupabaseClient();
    if (client && isSupabaseConfigured()) {
      try {
        const { data, error } = await client.from('messages').select('*').order('created_at', { ascending: false });
        if (!error && data && data.length > 0) {
          return data.map((d: any) => ({
            id: d.id,
            name: d.name,
            email: d.email,
            subject: d.subject || 'Inquiry',
            message: d.message,
            timestamp: d.created_at || d.timestamp || new Date().toISOString(),
            status: d.status || 'unread'
          }));
        }
      } catch (err) {
        console.warn('Supabase getMessages error, falling back to local storage:', err);
      }
    }
    return getStoredMessages();
  },

  /**
   * Mark message as read/unread
   */
  async updateMessageStatus(id: string, status: 'read' | 'unread' | 'replied'): Promise<void> {
    const client = getSupabaseClient();
    if (client && isSupabaseConfigured()) {
      try {
        await client.from('messages').update({ status }).eq('id', id);
      } catch (err) {
        console.warn('Supabase updateMessageStatus warning:', err);
      }
    }

    const current = getStoredMessages();
    const updated = current.map((m) => (m.id === id ? { ...m, status } : m));
    saveStoredMessages(updated);
  },

  /**
   * Delete message
   */
  async deleteMessage(id: string): Promise<boolean> {
    const client = getSupabaseClient();
    if (client && isSupabaseConfigured()) {
      try {
        await client.from('messages').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase deleteMessage warning:', err);
      }
    }

    const current = getStoredMessages();
    const updated = current.filter((m) => m.id !== id);
    saveStoredMessages(updated);
    return true;
  }
};
