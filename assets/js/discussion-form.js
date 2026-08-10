// ============================================
// VARIABEL GLOBAL
// ============================================
let currentDiscussionEvent = '';

// ============================================
// BUAT HTML MODAL DISKUSI
// ============================================
function createDiscussionModalHTML() {
    return `
    <!-- Modal Diskusi -->
    <div class="modal fade" id="discussionModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header" style="background-color: #17a2b8; color: white;">
                    <h5 class="modal-title fw-bold">
                        <i class="bi bi-chat-dots me-2"></i> Diskusikan Event Ini
                    </h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form id="discussionForm">
                        <!-- Event Name (hidden) -->
                        <input type="hidden" id="discussionEventName" value="">

                        <div class="alert alert-info small">
                            <i class="bi bi-info-circle me-1"></i>
                            Anda akan mendiskusikan event: <strong id="discussionEventDisplay">-</strong>
                            <br><small class="text-muted">Event ini telah selesai, tapi kami senang mendengar pendapat Anda!</small>
                        </div>

                        <!-- Nama Lengkap -->
                        <div class="mb-3">
                            <label for="discussionFullName" class="form-label fw-bold">Nama Lengkap <span class="text-danger">*</span></label>
                            <input type="text" class="form-control" id="discussionFullName" 
                                   placeholder="Masukkan nama lengkap Anda" required>
                        </div>

                        <!-- Email -->
                        <div class="mb-3">
                            <label for="discussionEmail" class="form-label fw-bold">Email <span class="text-danger">*</span></label>
                            <input type="email" class="form-control" id="discussionEmail" 
                                   placeholder="Masukkan alamat email" required>
                        </div>

                        <!-- WhatsApp -->
                        <div class="mb-3">
                            <label for="discussionPhone" class="form-label fw-bold">Nomor WhatsApp <span class="text-danger">*</span></label>
                            <input type="tel" class="form-control" id="discussionPhone" 
                                   placeholder="Contoh: 081234567890" required>
                            <small class="text-muted">Gunakan nomor aktif untuk konfirmasi</small>
                        </div>

                        <!-- Pertanyaan/Komentar -->
                        <div class="mb-3">
                            <label for="discussionQuestion" class="form-label fw-bold">Pertanyaan / Komentar <span class="text-danger">*</span></label>
                            <textarea class="form-control" id="discussionQuestion" rows="4" 
                                      placeholder="Apa yang ingin Anda tanyakan atau sampaikan tentang event ini?" required></textarea>
                        </div>

                        <!-- Loading -->
                        <div id="discussionLoading" class="text-center d-none">
                            <div class="spinner-border text-info" role="status">
                                <span class="visually-hidden">Loading...</span>
                            </div>
                            <p class="mt-2">Menyimpan data...</p>
                        </div>

                        <!-- Error Message -->
                        <div id="discussionError" class="alert alert-danger d-none"></div>

                        <!-- Success Message -->
                        <div id="discussionSuccess" class="alert alert-success d-none">
                            <i class="bi bi-check-circle-fill me-1"></i>
                            Pesan berhasil dikirim! Anda akan diarahkan ke WhatsApp...
                        </div>

                        <!-- Tombol Submit -->
                        <button type="submit" class="btn w-100 rounded-pill fw-bold py-2 text-white mt-3"
                                style="background-color: #17a2b8;" id="discussionSubmitBtn">
                            <i class="bi bi-whatsapp me-2"></i> Kirim & Diskusikan di WhatsApp
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
    `;
}

// ============================================
// FUNGSI BUKA MODAL DISKUSI
// ============================================
function openDiscussionForm(eventName) {
    currentDiscussionEvent = eventName;
    document.getElementById('discussionEventName').value = eventName;
    document.getElementById('discussionEventDisplay').textContent = eventName;

    const form = document.getElementById('discussionForm');
    form.reset();
    document.getElementById('discussionError').classList.add('d-none');
    document.getElementById('discussionSuccess').classList.add('d-none');
    document.getElementById('discussionLoading').classList.add('d-none');
    document.getElementById('discussionSubmitBtn').disabled = false;

    const modal = new bootstrap.Modal(document.getElementById('discussionModal'));
    modal.show();
}

// ============================================
// HANDLE SUBMIT FORM DISKUSI
// ============================================
async function handleDiscussionForm(e) {
    e.preventDefault();

    const eventName = document.getElementById('discussionEventName').value;
    const fullName = document.getElementById('discussionFullName').value.trim();
    const email = document.getElementById('discussionEmail').value.trim();
    const phone = document.getElementById('discussionPhone').value.trim();
    const question = document.getElementById('discussionQuestion').value.trim();

    if (!fullName || !email || !phone || !question) {
        showDiscussionError('Semua field wajib diisi!');
        return;
    }

    if (!isValidEmail(email)) {
        showDiscussionError('Format email tidak valid!');
        return;
    }

    if (phone.length < 10 || !/^\d+$/.test(phone)) {
        showDiscussionError('Nomor WhatsApp tidak valid! Minimal 10 digit angka.');
        return;
    }

    const data = {
        eventName: eventName,
        fullName: fullName,
        email: email,
        phone: phone,
        question: question
    };

    document.getElementById('discussionLoading').classList.remove('d-none');
    document.getElementById('discussionSubmitBtn').disabled = true;
    document.getElementById('discussionError').classList.add('d-none');

    try {
        const result = await window.submitDiscussion(data);

        if (result.success) {
            document.getElementById('discussionLoading').classList.add('d-none');
            document.getElementById('discussionSuccess').classList.remove('d-none');
            
            const waMessage = `Halo Admin Kediri Event, saya ${fullName} ingin berdiskusi tentang event ${eventName}.\n\nPertanyaan/Komentar: ${question}`;
            
            setTimeout(() => {
                window.open(`https://wa.me/62895639068080?text=${encodeURIComponent(waMessage)}`, '_blank');
                const modal = bootstrap.Modal.getInstance(document.getElementById('discussionModal'));
                if (modal) modal.hide();
            }, 2000);

        } else {
            showDiscussionError('Gagal menyimpan data: ' + result.error);
            document.getElementById('discussionLoading').classList.add('d-none');
            document.getElementById('discussionSubmitBtn').disabled = false;
        }

    } catch (error) {
        showDiscussionError('Terjadi kesalahan: ' + error.message);
        document.getElementById('discussionLoading').classList.add('d-none');
        document.getElementById('discussionSubmitBtn').disabled = false;
    }
}

function showDiscussionError(message) {
    const errorDiv = document.getElementById('discussionError');
    errorDiv.textContent = message;
    errorDiv.classList.remove('d-none');
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ============================================
// FUNGSI SUBMIT DISKUSI KE SUPABASE
// ============================================
async function submitDiscussion(data) {
    try {
        const { data: result, error } = await supabaseClient
            .from('discussions')
            .insert([{
                event_name: data.eventName,
                full_name: data.fullName,
                email: data.email,
                phone: data.phone,
                question: data.question,
                status: 'pending'
            }])
            .select();

        if (error) throw error;

        console.log('✅ Diskusi berhasil:', result);
        return { success: true, data: result };

    } catch (error) {
        console.error('❌ Error submit diskusi:', error);
        return { success: false, error: error.message };
    }
}

window.submitDiscussion = submitDiscussion;

// ============================================
// INISIALISASI MODAL DISKUSI
// ============================================
function initDiscussionModal() {
    if (!document.getElementById('discussionModal')) {
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = createDiscussionModalHTML();
        document.body.appendChild(modalContainer);

        const form = document.getElementById('discussionForm');
        if (form) {
            form.addEventListener('submit', handleDiscussionForm);
        }
    }
}

// EXPOSE KE GLOBAL
window.openDiscussionForm = openDiscussionForm;
window.initDiscussionModal = initDiscussionModal;