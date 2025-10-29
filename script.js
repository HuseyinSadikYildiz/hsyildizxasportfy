// Yıl
document.getElementById('year').textContent = new Date().getFullYear();

// Smooth scroll (tarayıcı destekli) + aktif link vurgusu
const links = document.querySelectorAll('.main-nav a, .btn[href^="#"]');
links.forEach(a => {
    a.addEventListener('click', e => {
        const hash = a.getAttribute('href');
        if (hash.startsWith('#')) {
            e.preventDefault();
            document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            history.pushState(null, '', hash);
        }
    });
});

// Reveal on scroll
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Cursor beam
const beam = document.getElementById('cursor-beam');
window.addEventListener('pointermove', (e) => {
    const x = e.clientX;
    const y = e.clientY;
    beam.style.setProperty('--mx', x + 'px');
    beam.style.setProperty('--my', y + 'px');
});

// Mesaj alanı otomatik büyüme
const textarea = document.getElementById('message');
if (textarea) {
    textarea.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = this.scrollHeight + 'px';
    });
}

// İletişim formu - Web3Forms
const form = document.getElementById('contact-form');
if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('submit-btn');
        const formData = new FormData(form);
        try {
            if (btn) { btn.disabled = true; btn.textContent = 'Gönderiliyor...'; }
            const res = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });
            const data = await res.json();
            if (data && data.success) {
                if (btn) {
                    btn.classList.remove('primary');
                    btn.classList.add('success');
                    btn.textContent = 'Gönderildi ✓';
                }
                form.reset();
            } else {
                const msg = (data && (data.message || data.error)) || 'Gönderilemedi';
                throw new Error(msg);
            }
        } catch (err) {
            alert((err && err.message) || 'Gönderilemedi. Lütfen daha sonra tekrar deneyin.');
        } finally {
            setTimeout(() => {
                if (btn) {
                    btn.classList.remove('success');
                    btn.classList.add('primary');
                    btn.textContent = 'Gönder';
                    btn.disabled = false;
                }
            }, 2500);
        }
    });
}

// Gmail ile gönder butonu
const gmailBtn = document.getElementById('gmail-send');
if (gmailBtn) {
    gmailBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        const subject = encodeURIComponent(`Portföy İletişim • ${name}`);
        const body = encodeURIComponent(`Ad: ${name}\nE-posta: ${email}\n\nMesaj:\n${message}`);
        const url = `https://mail.google.com/mail/?view=cm&zfs=1&to=sdkyildiz4204@gmail.com&su=${subject}&body=${body}`;
        window.open(url, '_blank', 'noopener');

        // Başarı geri bildirimi Gmail butonu
        gmailBtn.classList.add('success');
        const original = gmailBtn.textContent;
        gmailBtn.textContent = 'Taslak Açıldı ✓';
        setTimeout(() => {
            gmailBtn.classList.remove('success');
            gmailBtn.textContent = original;
        }, 2500);
    });
}


