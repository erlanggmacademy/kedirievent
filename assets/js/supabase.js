// ============================================
// KONFIGURASI SUPABASE
// ============================================
// GANTI DENGAN DATA DARI LANGKAH 2!
const SUPABASE_URL = "https://jrtwuiuktxdlrtejkgzd.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpydHd1aXVrdHhkbHJ0ZWprZ3pkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU4OTM4OTgsImV4cCI6MjEwMTQ2OTg5OH0.fJZvSktPXo1dHP9mYbH7R_pzXWvD42XwKGvy25OHdSg";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============================================
// FUNGSI SUBMIT REGISTRASI
// ============================================
async function submitRegistration(data) {
    try {
        // Kirim data ke Supabase
        const { data: result, error } = await supabaseClient
            .from('registrations')
            .insert([{
                event_name: data.eventName,
                full_name: data.fullName,
                email: data.email,
                phone: data.phone,
                message: data.message || ''
            }])
            .select();

        if (error) throw error;

        console.log('✅ Registrasi berhasil:', result);
        return { success: true, data: result };

    } catch (error) {
        console.error('❌ Error submit:', error);
        return { success: false, error: error.message };
    }
}

// ============================================
// FUNGSI UNTUK ADMIN (GET DATA)
// ============================================
async function getRegistrations(filters = {}) {
    try {
        let query = supabaseClient
            .from('registrations')
            .select('*')
            .order('created_at', { ascending: false });

        // Filter by event name
        if (filters.event_name) {
            query = query.eq('event_name', filters.event_name);
        }

        // Filter by status
        if (filters.status) {
            query = query.eq('status', filters.status);
        }

        const { data, error } = await query;

        if (error) throw error;

        return { success: true, data };

    } catch (error) {
        console.error('❌ Error get data:', error);
        return { success: false, error: error.message };
    }
}

// ============================================
// FUNGSI UNTUK ADMIN (UPDATE STATUS)
// ============================================
async function updateRegistrationStatus(id, status) {
    try {
        const { data, error } = await supabaseClient
            .from('registrations')
            .update({ status: status })
            .eq('id', id)
            .select();

        if (error) throw error;

        return { success: true, data };

    } catch (error) {
        console.error('❌ Error update status:', error);
        return { success: false, error: error.message };
    }
}

// ============================================
// FUNGSI UNTUK ADMIN (DELETE)
// ============================================
async function deleteRegistration(id) {
    try {
        const { error } = await supabaseClient
            .from('registrations')
            .delete()
            .eq('id', id);

        if (error) throw error;

        return { success: true };

    } catch (error) {
        console.error('❌ Error delete:', error);
        return { success: false, error: error.message };
    }
}

// ============================================
// FUNGSI UNTUK DISKUSI (ADMIN)
// ============================================
async function getDiscussions(filters = {}) {
    try {
        let query = supabaseClient
            .from('discussions')
            .select('*')
            .order('created_at', { ascending: false });

        if (filters.event_name) {
            query = query.eq('event_name', filters.event_name);
        }
        if (filters.status) {
            query = query.eq('status', filters.status);
        }

        const { data, error } = await query;
        if (error) throw error;
        return { success: true, data };

    } catch (error) {
        console.error('❌ Error get discussions:', error);
        return { success: false, error: error.message };
    }
}

async function updateDiscussionStatus(id, status) {
    try {
        const { data, error } = await supabaseClient
            .from('discussions')
            .update({ status: status })
            .eq('id', id)
            .select();

        if (error) throw error;
        return { success: true, data };

    } catch (error) {
        console.error('❌ Error update discussion:', error);
        return { success: false, error: error.message };
    }
}

async function deleteDiscussion(id) {
    try {
        const { error } = await supabaseClient
            .from('discussions')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return { success: true };

    } catch (error) {
        console.error('❌ Error delete discussion:', error);
        return { success: false, error: error.message };
    }
}

// ============================================
// FUNGSI UNTUK EO INQUIRY (ADMIN)
// ============================================
async function getEOInquiries(filters = {}) {
    try {
        let query = supabaseClient
            .from('eo_inquiries')
            .select('*')
            .order('created_at', { ascending: false });

        if (filters.event_type) {
            query = query.eq('event_type', filters.event_type);
        }
        if (filters.status) {
            query = query.eq('status', filters.status);
        }

        const { data, error } = await query;
        if (error) throw error;
        return { success: true, data };

    } catch (error) {
        console.error('❌ Error get EO inquiries:', error);
        return { success: false, error: error.message };
    }
}

async function updateEOInquiryStatus(id, status) {
    try {
        const { data, error } = await supabaseClient
            .from('eo_inquiries')
            .update({ status: status })
            .eq('id', id)
            .select();

        if (error) throw error;
        return { success: true, data };

    } catch (error) {
        console.error('❌ Error update EO inquiry:', error);
        return { success: false, error: error.message };
    }
}

async function deleteEOInquiry(id) {
    try {
        const { error } = await supabaseClient
            .from('eo_inquiries')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return { success: true };

    } catch (error) {
        console.error('❌ Error delete EO inquiry:', error);
        return { success: false, error: error.message };
    }
}

// EXPOSE KE GLOBAL
window.getEOInquiries = getEOInquiries;
window.updateEOInquiryStatus = updateEOInquiryStatus;
window.deleteEOInquiry = deleteEOInquiry;

// EXPOSE KE GLOBAL
window.getDiscussions = getDiscussions;
window.updateDiscussionStatus = updateDiscussionStatus;
window.deleteDiscussion = deleteDiscussion;

// ============================================
// EXPOSE KE GLOBAL (biar bisa dipanggil di HTML)
// ============================================
window.submitRegistration = submitRegistration;
window.getRegistrations = getRegistrations;
window.updateRegistrationStatus = updateRegistrationStatus;
window.deleteRegistration = deleteRegistration;