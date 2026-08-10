// ============================================
// VARIABEL GLOBAL
// ============================================
let currentEOEvent = '';

// ============================================
// BUAT HTML MODAL EO INQUIRY
// ============================================
function createEOInquiryModalHTML() {
    return `
    <!-- Modal EO Inquiry -->
    <div class="modal fade" id="eoInquiryModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header" style="background-color: #e67e22; color: white;">
                    <h5 class="modal-title fw-bold text-white">
                        <i class="bi bi-building me-2"></i> Butuh EO Terpercaya?
                    </h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form id="eoInquiryForm">
                        <!-- Event Name (hidden) -->
                        <input type="hidden" id="eoInquiryEventName" value="">

                        <div class="alert alert-info small">
                            <i class="bi bi-info-circle me-1"></i>
                            Anda tertarik mengadakan event seperti <strong id="eoInquiryEventDisplay">-</strong>?
                            <br><small class="text-muted">Isi form di bawah dan tim kami akan menghubungi Anda.</small>
                        </div>

                        <!-- Nama Instansi -->
                        <div class="mb-3">
                            <label for="eoInstitutionName" class="form-label fw-bold">Nama Instansi/Perusahaan <span class="text-danger">*</span></label>
                            <input type="text" class="form-control" id="eoInstitutionName" 
                                   placeholder="Contoh: PT. Maju Jaya / Dinas Pendidikan Kediri" required>
                        </div>

                        <!-- Email -->
                        <div class="mb-3">
                            <label for="eoInquiryEmail" class="form-label fw-bold">Email <span class="text-danger">*</span></label>
                            <input type="email" class="form-control" id="eoInquiryEmail" 
                                   placeholder="Masukkan alamat email" required>
                        </div>

                        <!-- WhatsApp -->
                        <div class="mb-3">
                            <label for="eoInquiryPhone" class="form-label fw-bold">Nomor WhatsApp <span class="text-danger">*</span></label>
                            <input type="tel" class="form-control" id="eoInquiryPhone" 
                                   placeholder="Contoh: 081234567890" required>
                            <small class="text-muted">Gunakan nomor aktif untuk konfirmasi</small>
                        </div>

                        <!-- Jenis Event -->
                        <div class="mb-3">
                            <label for="eoEventType" class="form-label fw-bold">Jenis Event yang Dibutuhkan <span class="text-danger">*</span></label>
                            <select class="form-select" id="eoEventType" required>
                                <option value="" disabled selected>Pilih jenis event</option>
                                <option value="Jalan Sehat">Jalan Sehat / Fun Run</option>
                                <option value="Outbound">Outbound / Team Building</option>
                                <option value="Konser">Konser / Musik</option>
                                <option value="Festival">Festival / Pameran</option>
                                <option value="Seminar">Seminar / Pelatihan</option>
                                <option value="Kompetisi">Kompetisi / Lomba</option>
                                <option value="Lainnya">Lainnya</option>
                            </select>
                        </div>

                        <!-- Jumlah Peserta -->
                        <div class="mb-3">
                            <label for="eoParticipantCount" class="form-label fw-bold">Perkiraan Jumlah Peserta <span class="text-danger">*</span></label>
                            <select class="form-select" id="eoParticipantCount" required>
                                <option value="" disabled selected>Pilih perkiraan peserta</option>
                                <option value="< 100">Kurang dari 100</option>
                                <option value="100 - 500">100 - 500</option>
                                <option value="500 - 1.000">500 - 1.000</option>
                                <option value="1.000 - 5.000">1.000 - 5.000</option>
                                <option value="> 5.000">Lebih dari 5.000</option>
                            </select>
                        </div>

                        <!-- Deskripsi -->
                        <div class="mb-3">
                            <label for="eoInquiryDescription" class="form-label fw-bold">Deskripsi Kebutuhan <span class="text-danger">*</span></label>
                            <textarea class="form-control" id="eoInquiryDescription" rows="3" 
                                      placeholder="Ceritakan gambaran event yang Anda inginkan..." required></textarea>
                        </div>

                        <!-- Budget -->
                        <div class="mb-3">
                            <label for="eoBudgetEstimate" class="form-label fw-bold">Estimasi Budget</label>
                            <input type="text" class="form-control" id="eoBudgetEstimate" 
                                   placeholder="Contoh: Rp 50.000.000 - Rp 100.000.000">
                        </div>

                        <!-- Loading -->
                        <div id="eoInquiryLoading" class="text-center d-none">
                            <div class="spinner-border text-warning" role="status">
                                <span class="visually-hidden">Loading...</span>
                            </div>
                            <p class="mt-2">Menyimpan data...</p>
                        </div>

                        <!-- Error Message -->
                        <div id="eoInquiryError" class="alert alert-danger d-none"></div>

                        <!-- Success Message -->
                        <div id="eoInquirySuccess" class="alert alert-success d-none">
                            <i class="bi bi-check-circle-fill me-1"></i>
                            Permintaan berhasil dikirim! Anda akan diarahkan ke WhatsApp...
                        </div>

                        <!-- Tombol Submit -->
                        <button type="submit" class="btn w-100 rounded-pill fw-bold py-2 text-white mt-3"
                                style="background-color: #e67e22;" id="eoInquirySubmitBtn">
                            <i class="bi bi-whatsapp me-2"></i> Kirim & Hubungi Kami
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
    `;
}

// ============================================
// FUNGSI BUKA MODAL EO INQUIRY
// ============================================
function openEOInquiryForm(eventName) {
    currentEOEvent = eventName;
    document.getElementById('eoInquiryEventName').value = eventName;
    document.getElementById('eoInquiryEventDisplay').textContent = eventName;

    const form = document.getElementById('eoInquiryForm');
    form.reset();
    document.getElementById('eoInquiryError').classList.add('d-none');
    document.getElementById('eoInquirySuccess').classList.add('d-none');
    document.getElementById('eoInquiryLoading').classList.add('d-none');
    document.getElementById('eoInquirySubmitBtn').disabled = false;

    const modal = new bootstrap.Modal(document.getElementById('eoInquiryModal'));
    modal.show();
}

// ============================================
// HANDLE SUBMIT FORM EO INQUIRY
// ============================================
async function handleEOInquiryForm(e) {
    e.preventDefault();

    const eventName = document.getElementById('eoInquiryEventName').value;
    const institutionName = document.getElementById('eoInstitutionName').value.trim();
    const email = document.getElementById('eoInquiryEmail').value.trim();
    const phone = document.getElementById('eoInquiryPhone').value.trim();
    const eventType = document.getElementById('eoEventType').value;
    const participantCount = document.getElementById('eoParticipantCount').value;
    const description = document.getElementById('eoInquiryDescription').value.trim();
    const budgetEstimate = document.getElementById('eoBudgetEstimate').value.trim();

    if (!institutionName || !email || !phone || !eventType || !participantCount || !description) {
        showEOInquiryError('Semua field wajib diisi!');
        return;
    }

    if (!isValidEmail(email)) {
        showEOInquiryError('Format email tidak valid!');
        return;
    }

    if (phone.length < 10 || !/^\d+$/.test(phone)) {
        showEOInquiryError('Nomor WhatsApp tidak valid! Minimal 10 digit angka.');
        return;
    }

    const data = {
        eventName: eventName,
        institutionName: institutionName,
        email: email,
        phone: phone,
        eventType: eventType,
        participantCount: participantCount,
        description: description,
        budgetEstimate: budgetEstimate || '-'
    };

    document.getElementById('eoInquiryLoading').classList.remove('d-none');
    document.getElementById('eoInquirySubmitBtn').disabled = true;
    document.getElementById('eoInquiryError').classList.add('d-none');

    try {
        const result = await window.submitEOInquiry(data);

        if (result.success) {
            document.getElementById('eoInquiryLoading').classList.add('d-none');
            document.getElementById('eoInquirySuccess').classList.remove('d-none');
            
            const waMessage = `Halo Admin Kediri Event,\n\n` +
                `Saya dari *${institutionName}* ingin berkonsultasi tentang event seperti *${eventName}*.\n\n` +
                `📋 Detail Kebutuhan:\n` +
                `🏢 Instansi: ${institutionName}\n` +
                `📧 Email: ${email}\n` +
                `📱 WhatsApp: ${phone}\n` +
                `🎯 Jenis Event: ${eventType}\n` +
                `👥 Jumlah Peserta: ${participantCount}\n` +
                `📝 Deskripsi: ${description}\n` +
                `💰 Estimasi Budget: ${budgetEstimate || '-'}\n\n` +
                `Mohon info lebih lanjut. Terima kasih!`;
            
            setTimeout(() => {
                window.open(`https://wa.me/62895639068080?text=${encodeURIComponent(waMessage)}`, '_blank');
                const modal = bootstrap.Modal.getInstance(document.getElementById('eoInquiryModal'));
                if (modal) modal.hide();
            }, 2000);

        } else {
            showEOInquiryError('Gagal menyimpan data: ' + result.error);
            document.getElementById('eoInquiryLoading').classList.add('d-none');
            document.getElementById('eoInquirySubmitBtn').disabled = false;
        }

    } catch (error) {
        showEOInquiryError('Terjadi kesalahan: ' + error.message);
        document.getElementById('eoInquiryLoading').classList.add('d-none');
        document.getElementById('eoInquirySubmitBtn').disabled = false;
    }
}

function showEOInquiryError(message) {
    const errorDiv = document.getElementById('eoInquiryError');
    errorDiv.textContent = message;
    errorDiv.classList.remove('d-none');
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ============================================
// FUNGSI SUBMIT EO INQUIRY KE SUPABASE
// ============================================
async function submitEOInquiry(data) {
    try {
        const { data: result, error } = await supabaseClient
            .from('eo_inquiries')
            .insert([{
                event_name: data.eventName,
                institution_name: data.institutionName,
                email: data.email,
                phone: data.phone,
                event_type: data.eventType,
                participant_count: data.participantCount,
                description: data.description,
                budget_estimate: data.budgetEstimate,
                status: 'pending'
            }])
            .select();

        if (error) throw error;

        console.log('✅ EO Inquiry berhasil:', result);
        return { success: true, data: result };

    } catch (error) {
        console.error('❌ Error submit EO Inquiry:', error);
        return { success: false, error: error.message };
    }
}

window.submitEOInquiry = submitEOInquiry;

// ============================================
// INISIALISASI MODAL EO INQUIRY
// ============================================
function initEOInquiryModal() {
    if (!document.getElementById('eoInquiryModal')) {
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = createEOInquiryModalHTML();
        document.body.appendChild(modalContainer);

        const form = document.getElementById('eoInquiryForm');
        if (form) {
            form.addEventListener('submit', handleEOInquiryForm);
        }
    }
}

// EXPOSE KE GLOBAL
window.openEOInquiryForm = openEOInquiryForm;
window.initEOInquiryModal = initEOInquiryModal;