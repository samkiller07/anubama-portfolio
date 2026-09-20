import { VisitorComment } from '../types';
import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase';

const COMMENTS_KEY = 'anubama_portfolio_comments_v2';

const getStoredRawComments = (): VisitorComment[] => {
  try {
    localStorage.removeItem('sakura_portfolio_comments');

    const data = localStorage.getItem(COMMENTS_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading comments from local storage:', e);
  }
  
  const defaultComments: VisitorComment[] = [];
  localStorage.setItem(COMMENTS_KEY, JSON.stringify(defaultComments));
  return defaultComments;
};

const saveStoredRawComments = (comments: VisitorComment[]) => {
  try {
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(comments));
    window.dispatchEvent(new CustomEvent('anubama-comments-changed', { detail: comments }));
  } catch (e) {
    console.error('Error saving comments to local storage:', e);
  }
};

/**
 * Group flat list of comments into hierarchical tree (parents with nested replies)
 */
const buildCommentTree = (flatComments: VisitorComment[]): VisitorComment[] => {
  const map = new Map<string, VisitorComment>();
  const roots: VisitorComment[] = [];

  flatComments.forEach((c) => {
    map.set(c.id, { ...c, replies: [] });
  });

  flatComments.forEach((c) => {
    const item = map.get(c.id)!;
    if (c.parent_id && map.has(c.parent_id)) {
      const parent = map.get(c.parent_id)!;
      if (!parent.replies) parent.replies = [];
      parent.replies.push(item);
    } else {
      roots.push(item);
    }
  });

  // Sort replies chronologically inside parents
  roots.forEach((parent) => {
    if (parent.replies && parent.replies.length > 0) {
      parent.replies.sort(
        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
    }
  });

  return roots;
};

export const commentService = {
  /**
   * Fetch comments formatted as hierarchical tree with nested replies
   */
  async getComments(includeAll: boolean = false): Promise<VisitorComment[]> {
    const client = getSupabaseClient();
    if (client && isSupabaseConfigured()) {
      try {
        let query = client.from('comments').select('*').order('created_at', { ascending: false });
        if (!includeAll) {
          query = query.eq('status', 'approved');
        }
        const { data, error } = await query;
        if (!error && Array.isArray(data)) {
          const flat: VisitorComment[] = data.map((d: any) => ({
            id: d.id,
            name: d.name,
            role: d.role,
            company: d.company,
            comment: d.comment,
            rating: d.rating || 5,
            avatarColor: d.avatar_color || (d.is_admin ? 'bg-pink-600' : 'bg-rose-500'),
            status: d.status || 'approved',
            timestamp: d.created_at || d.timestamp || new Date().toISOString(),
            parent_id: d.parent_id || null,
            is_admin: Boolean(d.is_admin)
          }));
          return buildCommentTree(flat);
        }
      } catch (err) {
        console.warn('Supabase getComments error, using local storage fallback:', err);
      }
    }

    const localFlat = getStoredRawComments();
    const filtered = includeAll ? localFlat : localFlat.filter((c) => c.status === 'approved');
    return buildCommentTree(filtered);
  },

  /**
   * Add new visitor comment (top-level)
   */
  async addComment(comment: {
    name: string;
    role?: string;
    company?: string;
    comment: string;
    rating?: number;
  }): Promise<VisitorComment> {
    const palette = ['bg-rose-500', 'bg-pink-500', 'bg-fuchsia-500', 'bg-purple-500', 'bg-red-400'];
    const randomColor = palette[Math.floor(Math.random() * palette.length)];

    const newComment: VisitorComment = {
      id: `comm-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: comment.name.trim(),
      role: comment.role?.trim() || 'Visitor / Peer',
      company: comment.company?.trim() || '',
      comment: comment.comment.trim(),
      rating: comment.rating || 5,
      avatarColor: randomColor,
      status: 'approved',
      timestamp: new Date().toISOString(),
      parent_id: null,
      is_admin: false,
      replies: []
    };

    const client = getSupabaseClient();
    if (client && isSupabaseConfigured()) {
      try {
        await client.from('comments').insert([{
          id: newComment.id,
          name: newComment.name,
          role: newComment.role,
          company: newComment.company,
          comment: newComment.comment,
          rating: newComment.rating,
          avatar_color: newComment.avatarColor,
          status: newComment.status,
          created_at: newComment.timestamp,
          parent_id: null,
          is_admin: false
        }]);
      } catch (err) {
        console.warn('Supabase addComment warning:', err);
      }
    }

    const current = getStoredRawComments();
    const updated = [newComment, ...current];
    saveStoredRawComments(updated);
    return newComment;
  },

  /**
   * Add admin reply to an existing comment
   */
  async addReply(
    parentId: string,
    replyText: string,
    adminName: string = 'Anubama M'
  ): Promise<VisitorComment> {
    const reply: VisitorComment = {
      id: `reply-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: adminName,
      role: 'Author / Software Developer',
      company: 'Portfolio Owner',
      comment: replyText.trim(),
      rating: 5,
      avatarColor: 'bg-pink-600',
      status: 'approved',
      timestamp: new Date().toISOString(),
      parent_id: parentId,
      is_admin: true
    };

    const client = getSupabaseClient();
    if (client && isSupabaseConfigured()) {
      try {
        await client.from('comments').insert([{
          id: reply.id,
          name: reply.name,
          role: reply.role,
          company: reply.company,
          comment: reply.comment,
          rating: reply.rating,
          avatar_color: reply.avatarColor,
          status: reply.status,
          created_at: reply.timestamp,
          parent_id: reply.parent_id,
          is_admin: true
        }]);
      } catch (err) {
        console.warn('Supabase addReply warning:', err);
      }
    }

    const current = getStoredRawComments();
    const updated = [...current, reply];
    saveStoredRawComments(updated);
    return reply;
  },

  /**
   * Update comment status (e.g. approve/hide)
   */
  async updateCommentStatus(id: string, status: 'approved' | 'pending' | 'hidden'): Promise<void> {
    const client = getSupabaseClient();
    if (client && isSupabaseConfigured()) {
      try {
        await client.from('comments').update({ status }).eq('id', id);
      } catch (err) {
        console.warn('Supabase updateCommentStatus warning:', err);
      }
    }

    const current = getStoredRawComments();
    const updated = current.map((c) => (c.id === id ? { ...c, status } : c));
    saveStoredRawComments(updated);
  },

  /**
   * Delete a comment and any of its child replies
   */
  async deleteComment(id: string): Promise<boolean> {
    const client = getSupabaseClient();
    if (client && isSupabaseConfigured()) {
      try {
        await client.from('comments').delete().eq('parent_id', id);
        await client.from('comments').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase deleteComment warning:', err);
      }
    }

    const current = getStoredRawComments();
    const updated = current.filter((c) => c.id !== id && c.parent_id !== id);
    saveStoredRawComments(updated);
    return true;
  },

  /**
   * Delete an individual reply
   */
  async deleteReply(replyId: string): Promise<boolean> {
    const client = getSupabaseClient();
    if (client && isSupabaseConfigured()) {
      try {
        await client.from('comments').delete().eq('id', replyId);
      } catch (err) {
        console.warn('Supabase deleteReply warning:', err);
      }
    }

    const current = getStoredRawComments();
    const updated = current.filter((c) => c.id !== replyId);
    saveStoredRawComments(updated);
    return true;
  }
};
