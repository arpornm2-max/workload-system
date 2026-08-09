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
    }
};
