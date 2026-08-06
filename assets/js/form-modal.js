// ============================================
// VARIABEL GLOBAL
// ============================================
let currentEventName = '';

// ============================================
// BUAT HTML MODAL (akan di-inject ke page)
// ============================================
function createModalHTML() {
    return `
    <!-- Modal Registrasi -->
    <div class="modal fade" id="registrationModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header" style="background-color: #7c25ba;">
    <h5 class="modal-title fw-bold text-white">
        <i class="bi bi-ticket-perforated me-2"></i> Daftar Event
    </h5>
    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
</div>
                <div class="modal-body">
                    <form id="registrationForm">
                        <!-- Event Name (hidden) -->
                        <input type="hidden" id="modalEventName" value="">

                        <!-- Nama Lengkap -->
                        <div class="mb-3">
                            <label for="modalFullName" class="form-label fw-bold">Nama Lengkap <span class="text-danger">*</span></label>
                            <input type="text" class="form-control" id="modalFullName" 
                                   placeholder="Masukkan nama lengkap Anda" required>
                        </div>

                        <!-- Email -->
                        <div class="mb-3">
                            <label for="modalEmail" class="form-label fw-bold">Email <span class="text-danger">*</span></label>
                            <input type="email" class="form-control" id="modalEmail" 
                                   placeholder="Masukkan alamat email" required>
                        </div>

                        <!-- WhatsApp -->
                        <div class="mb-3">
                            <label for="modalPhone" class="form-label fw-bold">Nomor WhatsApp <span class="text-danger">*</span></label>
                            <input type="tel" class="form-control" id="modalPhone" 
                                   placeholder="Contoh: 081234567890" required>
                            <small class="text-muted">Gunakan nomor aktif untuk konfirmasi</small>
                        </div>

                        <!-- Pesan Tambahan -->
                        <div class="mb-3">
                            <label for="modalMessage" class="form-label fw-bold">Pesan Tambahan</label>
                            <textarea class="form-control" id="modalMessage" rows="3" 
                                      placeholder="Tulis pertanyaan atau catatan tambahan"></textarea>
                        </div>

                        <!-- Informasi Event -->
                        <div class="alert alert-info small">
                            <i class="bi bi-info-circle me-1"></i>
                            Anda akan mendaftar untuk event: <strong id="modalEventDisplay">-</strong>
                        </div>

                        <!-- Loading -->
                        <div id="formLoading" class="text-center d-none">
                            <div class="spinner-border text-primary" role="status">
                                <span class="visually-hidden">Loading...</span>
                            </div>
                            <p class="mt-2">Menyimpan data...</p>
                        </div>

                        <!-- Error Message -->
                        <div id="formError" class="alert alert-danger d-none"></div>

                        <!-- Success Message -->
                        <div id="formSuccess" class="alert alert-success d-none">
                            <i class="bi bi-check-circle-fill me-1"></i>
                            Pendaftaran berhasil! Anda akan diarahkan ke WhatsApp...
                        </div>

                        <!-- Tombol Submit -->
                        <button type="submit" class="btn w-100 rounded-pill fw-bold py-2 text-white mt-3"
                                style="background-color: #7c25ba;" id="formSubmitBtn">
                            <i class="bi bi-whatsapp me-2"></i> Daftar & Hubungi WhatsApp
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
    `;
}

// ============================================
// FUNGSI BUKA MODAL
// ============================================
function openRegistrationForm(eventName) {
    // Set event name
    currentEventName = eventName;
    document.getElementById('modalEventName').value = eventName;
    document.getElementById('modalEventDisplay').textContent = eventName;

    // Reset form
    const form = document.getElementById('registrationForm');
    form.reset();
    document.getElementById('formError').classList.add('d-none');
    document.getElementById('formSuccess').classList.add('d-none');
    document.getElementById('formLoading').classList.add('d-none');
    document.getElementById('formSubmitBtn').disabled = false;

    // Tampilkan modal
    const modal = new bootstrap.Modal(document.getElementById('registrationModal'));
    modal.show();
}

// ============================================
// HANDLE SUBMIT FORM
// ============================================
async function handleRegistrationForm(e) {
    e.preventDefault();

    // Ambil data form
    const eventName = document.getElementById('modalEventName').value;
    const fullName = document.getElementById('modalFullName').value.trim();
    const email = document.getElementById('modalEmail').value.trim();
    const phone = document.getElementById('modalPhone').value.trim();
    const message = document.getElementById('modalMessage').value.trim();

    // Validasi
    if (!fullName || !email || !phone) {
        showFormError('Semua field wajib diisi!');
        return;
    }

    // Validasi email
    if (!isValidEmail(email)) {
        showFormError('Format email tidak valid!');
        return;
    }

    // Validasi phone (minimal 10 digit)
    if (phone.length < 10 || !/^\d+$/.test(phone)) {
        showFormError('Nomor WhatsApp tidak valid! Minimal 10 digit angka.');
        return;
    }

    // Siapkan data
    const data = {
        eventName: eventName,
        fullName: fullName,
        email: email,
        phone: phone,
        message: message
    };

    // Tampilkan loading
    document.getElementById('formLoading').classList.remove('d-none');
    document.getElementById('formSubmitBtn').disabled = true;
    document.getElementById('formError').classList.add('d-none');

    try {
        // Kirim ke Supabase
        const result = await window.submitRegistration(data);

        if (result.success) {
            // Success
            document.getElementById('formLoading').classList.add('d-none');
            document.getElementById('formSuccess').classList.remove('d-none');
            
            // Redirect ke WhatsApp setelah 2 detik
            const waMessage = `Halo Admin Kediri Event, saya ${fullName} ingin mendaftar event ${eventName}.`;
            const waUrl = `https://wa.me/62895639068080?text=${encodeURIComponent(waMessage)}`;
            
            setTimeout(() => {
                window.open(waUrl, '_blank');
                // Tutup modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('registrationModal'));
                if (modal) modal.hide();
            }, 2000);

        } else {
            // Error
            showFormError('Gagal menyimpan data: ' + result.error);
            document.getElementById('formLoading').classList.add('d-none');
            document.getElementById('formSubmitBtn').disabled = false;
        }

    } catch (error) {
        showFormError('Terjadi kesalahan: ' + error.message);
        document.getElementById('formLoading').classList.add('d-none');
        document.getElementById('formSubmitBtn').disabled = false;
    }
}

// ============================================
// HELPER FUNCTIONS
// ============================================
function showFormError(message) {
    const errorDiv = document.getElementById('formError');
    errorDiv.textContent = message;
    errorDiv.classList.remove('d-none');
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ============================================
// INISIALISASI MODAL
// ============================================
function initRegistrationModal() {
    // Inject modal HTML
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = createModalHTML();
    document.body.appendChild(modalContainer);

    // Attach event listener ke form
    const form = document.getElementById('registrationForm');
    if (form) {
        form.addEventListener('submit', handleRegistrationForm);
    }
}

// ============================================
// INISIALISASI UNTUK SEMUA HALAMAN
// ============================================
// Jalankan saat DOM ready
document.addEventListener('DOMContentLoaded', function() {
    // Cek apakah modal sudah ada, jika belum buat
    if (!document.getElementById('registrationModal')) {
        initRegistrationModal();
    }
});

// EXPOSE KE GLOBAL
window.openRegistrationForm = openRegistrationForm;