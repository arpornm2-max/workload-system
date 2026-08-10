const Utils = {
    showToast(message, type = 'success') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        // Icon based on type
        const icon = type === 'success' 
            ? '<i data-lucide="check-circle" class="text-secondary"></i>' 
            : '<i data-lucide="alert-circle" class="text-danger"></i>';

        toast.innerHTML = `
            ${icon}
            <span>${message}</span>
        `;

        container.appendChild(toast);
        
        // Re-initialize Lucide icons for the new element
        if (window.lucide) {
            window.lucide.createIcons({ root: toast });
        }

        setTimeout(() => {
            toast.style.animation = 'slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) reverse forwards';
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    },

    initSignaturePad(canvasId) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return null;

        // Resize canvas to match display size
        const ratio =  Math.max(window.devicePixelRatio || 1, 1);
        canvas.width = canvas.offsetWidth * ratio;
        canvas.height = canvas.offsetHeight * ratio;
        canvas.getContext("2d").scale(ratio, ratio);

        const signaturePad = new SignaturePad(canvas, {
            backgroundColor: 'rgba(255, 255, 255, 0)',
            penColor: 'rgb(0, 0, 0)'
        });

        return signaturePad;
    },

    formatDate(isoString) {
        if (!isoString) return '-';
        const date = new Date(isoString);
        return date.toLocaleDateString('th-TH', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    getStatusBadge(status) {
        const map = {
            'pending': { class: 'badge-pending', text: 'รออนุมัติ' },
            'partial_certified': { class: 'badge-pending', text: 'รอรับรองครบ' },
            'certified': { class: 'badge-certified', text: 'รอ Admin อนุมัติ' },
            'pending_admin': { class: 'badge-certified', text: 'รอ Admin อนุมัติ' },
            'approved': { class: 'badge-approved', text: 'อนุมัติแล้ว' }
        };
        const info = map[status] || map['pending'];
        return `<span class="badge ${info.class}">${info.text}</span>`;
    },

    initSignatureSettings() {
        if (!document.getElementById('signature-settings-modal')) {
            const modalHtml = `
                <div id="signature-settings-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999; align-items: center; justify-content: center;">
                    <div class="glass-panel" style="width: 90%; max-width: 500px; position: relative;">
                        <button id="close-sig-settings" class="btn btn-secondary btn-icon" style="position: absolute; top: 1rem; right: 1rem; z-index: 10;">
                            <i data-lucide="x"></i>
                        </button>
                        <h2 style="margin-bottom: 1.5rem;">สร้างลายเซ็นส่วนตัว</h2>
                        
                        <div id="current-sig-container" style="display: none; margin-bottom: 1.5rem; text-align: center;">
                            <h4 style="margin-bottom: 0.5rem; color: var(--text-muted);">ลายเซ็นปัจจุบันของคุณ</h4>
                            <div style="background: white; padding: 1rem; border-radius: 8px; border: 1px solid #E5E7EB; display: inline-block;">
                                <img id="current-sig-img" style="max-height: 100px;" />
                            </div>
                        </div>

                        <h4 style="margin-bottom: 1rem; color: var(--primary);">วาดลายเซ็นใหม่</h4>
                        <div class="signature-container" style="height: 200px;">
                            <canvas id="settings-signature"></canvas>
                            <div class="signature-actions">
                                <button type="button" id="clear-settings-sig" class="btn btn-secondary" style="padding: 0.25rem 0.75rem; font-size: 0.85rem;">ล้างลายเซ็น</button>
                            </div>
                        </div>

                        <div style="margin-top: 2rem; text-align: right;">
                            <button type="button" id="save-settings-sig" class="btn btn-primary">
                                <i data-lucide="save"></i> บันทึกลายเซ็น
                            </button>
                        </div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalHtml);
            if (window.lucide) window.lucide.createIcons({ root: document.getElementById('signature-settings-modal') });
            
            let sigPad = null;
            
            document.getElementById('close-sig-settings').addEventListener('click', () => {
                document.getElementById('signature-settings-modal').style.display = 'none';
            });
            
            document.getElementById('clear-settings-sig').addEventListener('click', () => {
                if (sigPad) sigPad.clear();
            });

            document.getElementById('save-settings-sig').addEventListener('click', async (e) => {
                if (sigPad && sigPad.isEmpty()) {
                    Utils.showToast('กรุณาวาดลายเซ็นใหม่ก่อนบันทึก', 'error');
                    return;
                }
                const btn = e.target.closest('button');
                const originalText = btn.innerHTML;
                btn.innerHTML = '<div class="spinner" style="width: 16px; height: 16px; border-width: 2px;"></div>';
                btn.disabled = true;

                const base64 = sigPad.toDataURL();
                const user = Auth.getCurrentUser() || {};
                const success = await DB.saveUserSignature(user.id, base64);
                
                if (success) {
                    Utils.showToast('บันทึกลายเซ็นสำเร็จ', 'success');
                    setTimeout(() => {
                        document.getElementById('signature-settings-modal').style.display = 'none';
                        btn.innerHTML = originalText;
                        btn.disabled = false;
                    }, 1000);
                } else {
                    Utils.showToast('เกิดข้อผิดพลาดในการบันทึก', 'error');
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                }
            });

            // Global function to open it
            window.openSignatureSettings = () => {
                const modal = document.getElementById('signature-settings-modal');
                const user = Auth.getCurrentUser() || {};
                
                if (user.savedSignature) {
                    document.getElementById('current-sig-container').style.display = 'block';
                    document.getElementById('current-sig-img').src = user.savedSignature;
                } else {
                    document.getElementById('current-sig-container').style.display = 'none';
                }
                
                modal.style.display = 'flex';
                
                // Initialize pad if not already
                if (!sigPad) {
                    setTimeout(() => {
                        sigPad = Utils.initSignaturePad('settings-signature');
                    }, 50); // wait for display flex to calculate dimensions
                } else {
                    sigPad.clear();
                }
            };
        }
        
        window.openSignatureSettings();
    }
};
