import { supabase } from './supabase';

export interface User {
  id: string;
  email: string;
  plan: string;
  created_at: string;
}

export interface MessageRecord {
  id: string;
  user_id: string;
  message: string;
  response: string;
  created_at: string;
}

/**
 * Saves a message and its corresponding AI response to the database.
 */
export async function saveMessage(userId: string, message: string, response: string) {
  const { data, error } = await supabase
    .from('messages')
    .insert([
      { user_id: userId, message: message, response: response }
    ])
    .select()
    .single();

  if (error) {
    console.error('Error saving message:', error.message);
    throw error;
  }

  return data as MessageRecord;
}

/**
 * Retrieves the message history for a specific user.
 */
export async function getMessages(userId: string) {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching messages:', error.message);
    throw error;
  }

  return data as MessageRecord[];
}

/**
 * Ensures a user exists in the database. 
 * If the user (by email) doesn't exist, it creates one.
 */
export async function getOrCreateUser(email: string) {
  // Try to find the user first
  const { data: existingUser, error: fetchError } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .maybeSingle();

  if (fetchError) {
    console.error('Error fetching user:', fetchError.message);
    throw fetchError;
  }

  if (existingUser) {
    return existingUser as User;
  }

  // If user doesn't exist, create them
  const { data: newUser, error: insertError } = await supabase
    .from('users')
    .insert([{ email }])
    .select()
    .single();

  if (insertError) {
    console.error('Error creating user:', insertError.message);
    throw insertError;
  }

  return newUser as User;
}
