# Công cụ Chuyển Âm thanh thành Văn bản 🎙️➡️📝

Đây là công cụ web siêu nhẹ giúp chuyển đổi file âm thanh/giọng nói thành văn bản một cách dễ dàng và hoàn toàn tự động dựa trên mô hình trí tuệ nhân tạo (AI) `faster-whisper`. 

Hệ thống bao gồm API backend tạo bằng **FastAPI** và giao diện người dùng đơn giản sử dụng **HTML/CSS/JS thuần** (không cần frameworks nặng), thuận tiện để chạy cục bộ (local) hoặc triển khai lên **Railway**.

---

## Tính năng chính
- 🎵 **Hỗ trợ nhiều định dạng**: `mp3`, `wav`, `m4a`, `ogg`, `webm`.
- 🧠 **Chuyển ngữ thông minh**: Tự động phát hiện và chuyển ngữ thông qua `faster-whisper` tối ưu cho CPU.
- 💬 **Ngôn ngữ linh hoạt**: Hỗ trợ tiếng Việt, tiếng Anh và tự động phát hiện ngôn ngữ.
- ⚡ **Siêu nhẹ**: Backend viết bằng FastAPI, giao diện thuần gọn gàng không yêu cầu bundle hay biên dịch.
- ☁️ **Sẵn sàng triển khai**: Đã cấu hình sẵn cho Railway qua tệp `Procfile` và biến môi trường.

---

## Yêu cầu Hệ thống 
Để công cụ hoạt động (kể cả trên máy tính cá nhân hoặc máy chủ), bạn cần:
1. **Python 3.10+**
2. **FFmpeg**: Công cụ không thể thiếu để mô hình Whisper đọc và chuyển đổi âm thanh.
   - **Windows**: [Tải và cài đặt FFmpeg cho Windows](https://github.com/BtbN/FFmpeg-Builds/releases). Nhớ thêm thư mục `bin` của FFmpeg vào biến môi trường `PATH`.
   - **macOS**: Chạy lệnh `brew install ffmpeg`
   - **Linux / Railway**: Thường đã có sẵn, hoặc bạn có thể chạy `sudo apt update && sudo apt install ffmpeg`

---

## Hướng dẫn Phát triển Cục bộ (Local Development)

Đảm bảo bạn hoạt động trong môi trường ảo (`venv`) để không làm ảnh hưởng cài đặt Python toàn cục trên máy tính.

### Dành cho Windows (Sử dụng PowerShell)

1. **Tạo môi trường ảo (venv):**
   ```powershell
   python -m venv venv
   ```
2. **Kích hoạt venv:**
   ```powershell
   .\venv\Scripts\Activate.ps1
   ```
   *(Nếu bị lỗi Execution Policy, hãy đọc phần **Khắc phục sự cố** phía dưới).*
3. **Cập nhật pip và cài đặt thư viện:**
   ```powershell
   python -m pip install --upgrade pip
   pip install -r requirements.txt
   ```

### Dành cho macOS/Linux (Sử dụng bash/zsh)

1. **Tạo môi trường ảo (venv):**
   ```bash
   python3 -m venv venv
   ```
2. **Kích hoạt venv:**
   ```bash
   source venv/bin/activate
   ```
3. **Cập nhật pip và cài đặt thư viện:**
   ```bash
   python3 -m pip install --upgrade pip
   pip install -r requirements.txt
   ```

### Chạy ứng dụng

Khi môi trường ảo đang hoạt động và các thư viện đã được cài, khởi động máy chủ API:

```bash
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

- **Mở trang web**: Truy cập [http://localhost:8000/](http://localhost:8000/) ngay trên trình duyệt của bạn.
- **Xem tài liệu API tự động (Swagger)**: Truy cập trang [http://localhost:8000/docs](http://localhost:8000/docs).

---

## Kiểm tra nhanh (Smoke Test)

Khi máy chủ đang chạy, bạn có thể kiểm tra xem hệ thống đã hoạt động đúng chưa thông qua công cụ dòng lệnh `curl` ở một terminal (tab) khác:

**1. Kiểm tra trạng thái máy chủ (Sức khỏe):**
```bash
curl -X GET http://localhost:8000/api/suc-khoe
```
Kết quả mong muốn: `{"trang_thai":"ok"}`

**2. Thử nghiệm gửi file âm thanh:**
```bash
curl -X POST http://localhost:8000/api/chuyen-am-thanh \
  -H "accept: application/json" \
  -H "Content-Type: multipart/form-data" \
  -F "tep_am_thanh=@duong_dan_toa_tep_cua_ban.mp3" \
  -F "ngon_ngu=auto"
```
Thay thế `duong_dan_toa_tep_cua_ban.mp3` bằng tệp thực tế trên máy của bạn.

---

## Hướng dẫn Triển khai trên Railway

Ứng dụng này đã được cấu hình sẵn sàng để có thể "1-click deploy" lên [Railway](https://railway.app/).

1. Đẩy mã nguồn dự án này lên một kho lưu trữ (repository) GitHub của bạn.
2. Đăng nhập vào nền tảng Railway, chọn **"New Project"**.
3. Chọn tùy chọn **"Deploy from GitHub repo"**.
4. Cấp quyền truy cập vào repo và chọn kho chứa dự án này.
5. Railway sẽ tự động phân tích và nhận diện tệp `Procfile` và cài đặt `requirements.txt`.
6. Railway có môi trường cài sẵn hoặc có thể cài thêm FFmpeg nếu gói Nixpacks mặc định chưa cung cấp. (Nixpacks thường đã có ffmpeg cho các dự án audio).
7. **Biến môi trường tùy chọn trong Railway:**
   - Để ứng dụng chạy siêu nhẹ và tiết kiệm RAM, bạn có thể thêm biến môi trường trên Railway Dashboard (tại thẻ Variables):
     - `WHISPER_MODEL` = `tiny` (Mặc định được cấu hình là `small`, `tiny` sẽ nhanh hơn và nhẹ hơn).
     - `WHISPER_COMPUTE_TYPE` = `int8` (Mặc định đã là `int8` thân thiện với CPU).
8. Nhấn tạo Public Domain (Tên miền công khai) trên Railway để sử dụng trang web của bạn.

---

## Khắc phục sự cố

### 1. Lỗi khi kích hoạt môi trường ảo (Windows PowerShell)
Nếu bạn nhận được thông báo đỏ báo lỗi: *"cannot be loaded because running scripts is disabled on this system..."*
- **Nguyên nhân**: Chính sách bảo mật mặc định của Windows làm chặn các script hoạt động trực tiếp.
- **Cách khắc phục**: Chạy PowerShell bằng quyền **Run as Administrator**, sau đó thực thi lệnh này:
  ```powershell
  Set-ExecutionPolicy Unrestricted -Scope CurrentUser
  ```
  Nhấn `Y` xác nhận. Sau đó bạn có thể đóng PowerShell này và trở lại kích hoạt venv bình thường.

### 2. Lỗi `FileNotFoundError: [WinError 2] The system cannot find the file specified` khi gọi API chuyển âm thanh
- **Nguyên nhân**: Hệ thống Whisper không thể tìm thấy thư viện **FFmpeg**.
- **Cách khắc phục**: 
  - Đảm bảo đã tải và cài đặt lập FFmpeg.
  - Chắc chắn đường dẫn chứa tệp `ffmpeg.exe` (thường là mục `bin`) đã được thêm vào mục **Environment Variables > Hành vi (PATH)** của hệ điều hành Windows. Sau khi thêm PATH, bạn **phải** khởi động lại terminal/PowerShell và chạy lại uvicorn kết quả mới thay đổi.

### 3. Lỗi báo thiếu bộ nhớ trên Railway hoặc bị sập khi tải model
- **Nguyên nhân**: Mô hình `small` có thể tiêu tốn khoảng hơn 1GB RAM trên Railway.
- **Cách khắc phục**: Đổi biến môi trường `WHISPER_MODEL` thành `tiny` (hay `base`) trong phần thiết lập (Settings/Variables) ở bảng điều khiển Railway để giảm lượng RAM cần thiết.
