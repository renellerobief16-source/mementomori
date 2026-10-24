import { supabase, isSupabaseConfigured } from '../lib/supabase';

// Helper: map Supabase snake_case profile to frontend camelCase
function mapProfileFromDB(row) {
  if (!row) return null;
  return {
    name: row.name,
    title: row.title,
    subtitle: row.subtitle,
    bio: row.bio,
    location: row.location,
    email: row.email,
    githubUrl: row.github_url,
    linkedinUrl: row.linkedin_url,
    facebookUrl: row.facebook_url,
    instagramUrl: row.instagram_url,
    onlinejobsUrl: row.onlinejobs_url,
    status: row.status,
  };
}

// Helper: map frontend camelCase profile to Supabase snake_case
function mapProfileToDB(p) {
  return {
    id: 'default',
    name: p.name || '',
    title: p.title || '',
    subtitle: p.subtitle || '',
    bio: p.bio || '',
    location: p.location || '',
    email: p.email || '',
    github_url: p.githubUrl || '',
    linkedin_url: p.linkedinUrl || '',
    facebook_url: p.facebookUrl || '',
    instagram_url: p.instagramUrl || '',
    onlinejobs_url: p.onlinejobsUrl || '',
    status: p.status || '',
    updated_at: new Date().toISOString(),
  };
}

// Helper: map web project
function mapWebProjectFromDB(row) {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    description: row.description,
    image: row.image,
    liveUrl: row.live_url,
    githubUrl: row.github_url,
    tools: Array.isArray(row.tools) ? row.tools : (row.tools ? [row.tools] : []),
    badge: row.badge,
    orderIndex: row.order_index,
  };
}

function mapWebProjectToDB(p) {
  const toolsArray = Array.isArray(p.tools)
    ? p.tools
    : typeof p.tools === 'string'
    ? p.tools.split(',').map((t) => t.trim()).filter(Boolean)
    : [];

  return {
    id: p.id || `web-${Date.now()}`,
    title: p.title || '',
    category: p.category || 'Web Application',
    description: p.description || '',
    image: p.image || '',
    live_url: p.liveUrl || '',
    github_url: p.githubUrl || '',
    tools: toolsArray,
    badge: p.badge || 'Active',
    order_index: p.orderIndex || 0,
  };
}

// Helper: map video edit
function mapVideoEditFromDB(row) {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    duration: row.duration,
    software: Array.isArray(row.software) ? row.software : (row.software ? [row.software] : []),
    description: row.description,
    thumbnail: row.thumbnail,
    previewVideo: row.preview_video,
    highlight: row.highlight,
    badge: row.badge,
    orderIndex: row.order_index,
  };
}

function mapVideoEditToDB(v) {
  const softwareArray = Array.isArray(v.software)
    ? v.software
    : typeof v.software === 'string'
    ? v.software.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  return {
    id: v.id || `video-${Date.now()}`,
    title: v.title || '',
    category: v.category || 'Video Editing',
    duration: v.duration || '0:30',
    software: softwareArray,
    description: v.description || '',
    thumbnail: v.thumbnail || '',
    preview_video: v.previewVideo || '',
    highlight: v.highlight || '',
    badge: v.badge || 'Featured',
    order_index: v.orderIndex || 0,
  };
}

// Helper: map poster
function mapPosterFromDB(row) {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    software: Array.isArray(row.software) ? row.software : (row.software ? [row.software] : []),
    description: row.description,
    image: row.image,
    dimensions: row.dimensions || '3:4',
    aspect: row.aspect || '3:4',
    badge: row.badge,
    orderIndex: row.order_index,
  };
}

function mapPosterToDB(p) {
  const softwareArray = Array.isArray(p.software)
    ? p.software
    : typeof p.software === 'string'
    ? p.software.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  return {
    id: p.id || `poster-${Date.now()}`,
    title: p.title || '',
    category: p.category || 'Event Poster',
    software: softwareArray,
    description: p.description || '',
    image: p.image || '',
    dimensions: p.dimensions || '3:4',
    aspect: p.aspect || '3:4',
    badge: p.badge || 'Artwork',
    order_index: p.orderIndex || 0,
  };
}

// Helper: map certificate
function mapCertFromDB(row) {
  return {
    id: row.id,
    title: row.title,
    issuer: row.issuer,
    issueDate: row.issue_date,
    credentialId: row.credential_id,
    category: row.category,
    skills: Array.isArray(row.skills) ? row.skills : (row.skills ? [row.skills] : []),
    description: row.description,
    image: row.image,
    badge: row.badge,
    orderIndex: row.order_index,
  };
}

function mapCertToDB(c) {
  const skillsArray = Array.isArray(c.skills)
    ? c.skills
    : typeof c.skills === 'string'
    ? c.skills.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  return {
    id: c.id || `cert-${Date.now()}`,
    title: c.title || '',
    issuer: c.issuer || '',
    issue_date: c.issueDate || '',
    credential_id: c.credentialId || '',
    category: c.category || 'Certification',
    skills: skillsArray,
    description: c.description || '',
    image: c.image || '',
    badge: c.badge || 'Verified Certificate',
    order_index: c.orderIndex || 0,
  };
}

// =========================================================================
// FETCH ALL PORTFOLIO DATA FROM SUPABASE
// =========================================================================
export async function fetchPortfolioFromSupabase() {
  if (!isSupabaseConfigured || !supabase) {
    return null;
  }

  try {
    const [profileRes, webRes, videoRes, posterRes, certRes] = await Promise.all([
      supabase.from('profile').select('*').limit(1).single(),
      supabase.from('web_projects').select('*').order('order_index', { ascending: true }),
      supabase.from('video_edits').select('*').order('order_index', { ascending: true }),
      supabase.from('posters').select('*').order('order_index', { ascending: true }),
      supabase.from('certificates').select('*').order('order_index', { ascending: true }),
    ]);

    // If profile query succeeded and returned data
    const profile = profileRes.data ? mapProfileFromDB(profileRes.data) : null;
    const webProjects = webRes.data ? webRes.data.map(mapWebProjectFromDB) : null;
    const videoEdits = videoRes.data ? videoRes.data.map(mapVideoEditFromDB) : null;
    const posters = posterRes.data ? posterRes.data.map(mapPosterFromDB) : null;
    const certificates = certRes.data ? certRes.data.map(mapCertFromDB) : null;

    if (!profile && !webProjects?.length) {
      // Empty database or tables not initialized
      return null;
    }

    return {
      profile,
      webProjects: webProjects || [],
      videoEdits: videoEdits || [],
      posters: posters || [],
      certificates: certificates || [],
    };
  } catch (error) {
    console.warn('Supabase fetch failed, will fallback to local storage:', error);
    return null;
  }
}

// =========================================================================
// CRUD ACTIONS FOR EACH SECTION
// =========================================================================

export async function saveProfileToSupabase(profile) {
  if (!isSupabaseConfigured || !supabase) {
    console.warn('[Supabase] Supabase is not configured, skipping profile sync.');
    return false;
  }
  try {
    const payload = mapProfileToDB(profile);
    const { data, error } = await supabase.from('profile').upsert(payload, { onConflict: 'id' }).select();
    if (error) throw error;
    console.log('[Supabase] Profile saved to cloud:', data);
    return true;
  } catch (err) {
    console.error('Failed to save profile to Supabase:', err);
    return false;
  }
}

export async function upsertWebProjectToSupabase(project) {
  if (!isSupabaseConfigured || !supabase) {
    console.warn('[Supabase] Supabase is not configured, skipping web project sync.');
    return false;
  }
  try {
    const payload = mapWebProjectToDB(project);
    const { data, error } = await supabase.from('web_projects').upsert(payload, { onConflict: 'id' }).select();
    if (error) throw error;
    console.log('[Supabase] Web project saved to cloud:', data);
    return true;
  } catch (err) {
    console.error('Failed to upsert web project:', err);
    return false;
  }
}

export async function deleteWebProjectFromSupabase(id) {
  if (!isSupabaseConfigured || !supabase) return false;
  try {
    const { error } = await supabase.from('web_projects').delete().eq('id', id);
    if (error) throw error;
    console.log('[Supabase] Web project deleted from cloud:', id);
    return true;
  } catch (err) {
    console.error('Failed to delete web project:', err);
    return false;
  }
}

export async function upsertVideoEditToSupabase(video) {
  if (!isSupabaseConfigured || !supabase) {
    console.warn('[Supabase] Supabase is not configured, skipping video edit sync.');
    return false;
  }
  try {
    const payload = mapVideoEditToDB(video);
    const { data, error } = await supabase.from('video_edits').upsert(payload, { onConflict: 'id' }).select();
    if (error) throw error;
    console.log('[Supabase] Video edit saved to cloud:', data);
    return true;
  } catch (err) {
    console.error('Failed to upsert video edit:', err);
    return false;
  }
}

export async function deleteVideoEditFromSupabase(id) {
  if (!isSupabaseConfigured || !supabase) return false;
  try {
    const { error } = await supabase.from('video_edits').delete().eq('id', id);
    if (error) throw error;
    console.log('[Supabase] Video edit deleted from cloud:', id);
    return true;
  } catch (err) {
    console.error('Failed to delete video edit:', err);
    return false;
  }
}

export async function upsertPosterToSupabase(poster) {
  if (!isSupabaseConfigured || !supabase) {
    console.warn('[Supabase] Supabase is not configured, skipping poster sync.');
    return false;
  }
  try {
    const payload = mapPosterToDB(poster);
    const { data, error } = await supabase.from('posters').upsert(payload, { onConflict: 'id' }).select();
    if (error) throw error;
    console.log('[Supabase] Poster saved to cloud:', data);
    return true;
  } catch (err) {
    console.error('Failed to upsert poster:', err);
    return false;
  }
}

export async function deletePosterFromSupabase(id) {
  if (!isSupabaseConfigured || !supabase) return false;
  try {
    const { error } = await supabase.from('posters').delete().eq('id', id);
    if (error) throw error;
    console.log('[Supabase] Poster deleted from cloud:', id);
    return true;
  } catch (err) {
    console.error('Failed to delete poster:', err);
    return false;
  }
}

export async function upsertCertificateToSupabase(cert) {
  if (!isSupabaseConfigured || !supabase) {
    console.warn('[Supabase] Supabase is not configured, skipping certificate sync.');
    return false;
  }
  try {
    const payload = mapCertToDB(cert);
    const { data, error } = await supabase.from('certificates').upsert(payload, { onConflict: 'id' }).select();
    if (error) throw error;
    console.log('[Supabase] Certificate saved to cloud:', data);
    return true;
  } catch (err) {
    console.error('Failed to upsert certificate:', err);
    return false;
  }
}

export async function deleteCertificateFromSupabase(id) {
  if (!isSupabaseConfigured || !supabase) return false;
  try {
    const { error } = await supabase.from('certificates').delete().eq('id', id);
    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Failed to delete certificate:', err);
    return false;
  }
}

// =========================================================================
// CLOUD STORAGE UPLOAD (PORTFOLIO-MEDIA BUCKET)
// =========================================================================
export async function uploadMediaToSupabase(file, folder = 'uploads') {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase is not configured.');
  }

  const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const filePath = `${folder}/${Date.now()}_${cleanName}`;

  const { error: uploadError } = await supabase.storage
    .from('portfolio-media')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from('portfolio-media')
    .getPublicUrl(filePath);

  return data.publicUrl;
}

// =========================================================================
// CONTACT MESSAGES SUBMISSION
// =========================================================================
export async function submitContactMessageToSupabase({ name, email, subject, message }) {
  if (!isSupabaseConfigured || !supabase) {
    return false;
  }

  try {
    const { error } = await supabase.from('contact_messages').insert([
      {
        name,
        email,
        subject: subject || 'Portfolio Inquiry',
        message,
      },
    ]);

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Failed to submit contact message to Supabase:', err);
    return false;
  }
}
