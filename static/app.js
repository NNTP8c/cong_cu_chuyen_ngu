document.addEventListener('DOMContentLoaded', () => {
    const inputTep = document.getElementById('tep_am_thanh');
    const nhanTep = document.getElementById('nhan_tep');
    const nutChuyenDoi = document.getElementById('nut_chuyen_doi');
    const chonNgonNgu = document.getElementById('ngon_ngu');
    const vungTai = document.getElementById('trang_thai_tai');
    const vungKetQua = document.getElementById('vung_ket_qua');
    const thongBaoLoi = document.getElementById('thong_bao_loi');
    const vanBanKetQua = document.getElementById('van_ban_ket_qua');
    const thongTinBoSung = document.getElementById('thong_tin_bo_sung');
    const nutSaoChep = document.getElementById('nut_sao_chep');
    const nutTaiVe = document.getElementById('nut_tai_ve');
    const chonTepKhuVuc = document.querySelector('.file-picker');

    let tepHienTai = null;

    // Xử lý kéo thả tệp
    chonTepKhuVuc.addEventListener('dragover', (e) => {
        e.preventDefault();
        chonTepKhuVuc.classList.add('drag-over');
    });

    chonTepKhuVuc.addEventListener('dragleave', () => {
        chonTepKhuVuc.classList.remove('drag-over');
    });

    chonTepKhuVuc.addEventListener('drop', (e) => {
        e.preventDefault();
        chonTepKhuVuc.classList.remove('drag-over');
        
        if (e.dataTransfer.files.length > 0) {
            xuLyTepChon(e.dataTransfer.files[0]);
        }
    });

    // Mở hộp thoại chọn tệp khi click
    chonTepKhuVuc.addEventListener('click', () => {
        inputTep.click();
    });

    inputTep.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            xuLyTepChon(e.target.files[0]);
        }
    });

    function xuLyTepChon(tep) {
        const dinhDangHopLe = ['.mp3', '.wav', '.m4a', '.ogg', '.webm'];
        const tenTep = tep.name.toLowerCase();
        
        const hopLe = dinhDangHopLe.some(dd => tenTep.endsWith(dd));
        
        if (!hopLe) {
            hienThiLoi('Định dạng tệp không hợp lệ. Vui lòng chọn tệp âm thanh (mp3, wav, m4a, ogg, webm).');
            return;
        }

        tepHienTai = tep;
        nhanTep.textContent = `Đã chọn: ${tep.name}`;
        nhanTep.classList.add('file-selected');
        nutChuyenDoi.disabled = false;
        anLoi();
    }

    // Xử lý gửi biểu mẫu
    nutChuyenDoi.addEventListener('click', async () => {
        if (!tepHienTai) return;

        const formData = new FormData();
        formData.append('tep_am_thanh', tepHienTai);
        formData.append('ngon_ngu', chonNgonNgu.value);

        // Chuẩn bị giao diện UI
        vungKetQua.classList.add('hidden');
        anLoi();
        vungTai.classList.remove('hidden');
        nutChuyenDoi.disabled = true;

        try {
            const phanHoi = await fetch('/api/chuyen-am-thanh', {
                method: 'POST',
                body: formData
            });

            const ketQua = await phanHoi.json();

            if (!phanHoi.ok) {
                throw new Error(ketQua.detail || 'Có lỗi xảy ra khi xử lý tệp.');
            }

            // Hiển thị kết quả
            vanBanKetQua.value = ketQua.van_ban;
            let tenNgonNgu = ketQua.ngon_ngu === 'vi' ? 'Tiếng Việt' : (ketQua.ngon_ngu === 'en' ? 'Tiếng Anh' : ketQua.ngon_ngu);
            thongTinBoSung.textContent = `Ngôn ngữ: ${tenNgonNgu} | Thời gian xử lý: ${ketQua.thoi_gian_giay}s`;
            
            vungTai.classList.add('hidden');
            vungKetQua.classList.remove('hidden');

        } catch (loi) {
            vungTai.classList.add('hidden');
            hienThiLoi(loi.message);
        } finally {
            nutChuyenDoi.disabled = false;
        }
    });

    // Tính năng sao chép
    nutSaoChep.addEventListener('click', () => {
        vanBanKetQua.select();
        document.execCommand('copy');
        
        const vanBanCu = nutSaoChep.textContent;
        nutSaoChep.textContent = 'Đã sao chép!';
        nutSaoChep.classList.add('success');
        
        setTimeout(() => {
            nutSaoChep.textContent = vanBanCu;
            nutSaoChep.classList.remove('success');
        }, 2000);
    });

    // Tính năng tải về
    nutTaiVe.addEventListener('click', () => {
        const noiDung = vanBanKetQua.value;
        const blob = new Blob([noiDung], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        
        const tenTepGoc = tepHienTai ? tepHienTai.name.split('.')[0] : 'ban_dich';
        link.href = url;
        link.download = `${tenTepGoc}_van_ban.txt`;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    });

    function hienThiLoi(thongDiep) {
        thongBaoLoi.textContent = thongDiep;
        thongBaoLoi.classList.remove('hidden');
    }

    function anLoi() {
        thongBaoLoi.classList.add('hidden');
    }
});
