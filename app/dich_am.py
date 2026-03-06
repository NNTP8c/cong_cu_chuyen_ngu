import os
import time
from faster_whisper import WhisperModel

# Cấu hình mô hình từ biến môi trường mặc định là 'small' và 'int8' cho CPU nhỏ gọn
MO_HINH = os.getenv("WHISPER_MODEL", "small")
KIEU_TINH_TOAN = os.getenv("WHISPER_COMPUTE_TYPE", "int8")

# Tải mô hình vào bộ nhớ (chỉ tải 1 lần khi ứng dụng khởi động để tăng tốc độ)
print(f"Đang tải cấu hình AI: {MO_HINH} ({KIEU_TINH_TOAN})")
mo_hinh_ai = WhisperModel(MO_HINH, device="cpu", compute_type=KIEU_TINH_TOAN)

def dich_am_thanh(duong_dan_tep: str, ngon_ngu: str = "auto") -> dict:
    """
    Sử dụng faster-whisper để chuyển đổi tệp âm thanh thành văn bản.
    """
    bat_dau = time.time()
    
    # Thiết lập ngôn ngữ nếu được chỉ định
    ngon_ngu_mo_hinh = None if ngon_ngu == "auto" else ngon_ngu
    
    # Chạy inference
    cac_doan_van_ban, thong_tin = mo_hinh_ai.transcribe(
        duong_dan_tep,
        language=ngon_ngu_mo_hinh,
        beam_size=5
    )
    
    # Nối các đoạn văn bản lại với nhau
    van_ban_day_du = ""
    for doan in cac_doan_van_ban:
        van_ban_day_du += doan.text + " "
        
    ket_thuc = time.time()
    thoi_gian_xy_ly = round(ket_thuc - bat_dau, 2)
    
    return {
        "van_ban": van_ban_day_du.strip(),
        "ngon_ngu": thong_tin.language,
        "thoi_gian_giay": thoi_gian_xy_ly
    }
