import os
import tempfile
import time
from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from app.dich_am import dich_am_thanh

app = FastAPI(title="Công cụ Chuyển Âm thanh thành Văn bản")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/")
async def trang_chu():
    return FileResponse("static/index.html")


@app.get("/api/suc-khoe")
async def kiem_tra_suc_khoe():
    return {"trang_thai": "ok"}


@app.post("/api/chuyen-am-thanh")
async def chuyen_am_thanh_api(
    tep_am_thanh: UploadFile = File(...),
    ngon_ngu: str = Form("auto")
):
    duong_dan_tam = None

    dinh_dang_hop_le = [
        "audio/mpeg",
        "audio/wav",
        "audio/x-m4a",
        "audio/mp4",
        "audio/ogg",
        "audio/webm",
    ]

    if (
        tep_am_thanh.content_type not in dinh_dang_hop_le
        and not tep_am_thanh.filename.lower().endswith((".mp3", ".wav", ".m4a", ".ogg", ".webm"))
    ):
        raise HTTPException(
            status_code=400,
            detail="Định dạng tệp không được hỗ trợ. Vui lòng tải lên mp3, wav, m4a, ogg, hoặc webm."
        )

    try:
        fd, duong_dan_tam = tempfile.mkstemp(
            suffix=os.path.splitext(tep_am_thanh.filename)[1]
        )
        os.close(fd)

        noi_dung = await tep_am_thanh.read()
        with open(duong_dan_tam, "wb") as f:
            f.write(noi_dung)

        ket_qua = dich_am_thanh(duong_dan_tam, ngon_ngu)
        return ket_qua

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi khi xử lý tệp: {str(e)}")

    finally:
        if duong_dan_tam and os.path.exists(duong_dan_tam):
            for _ in range(5):
                try:
                    os.remove(duong_dan_tam)
                    break
                except PermissionError:
                    time.sleep(0.3)
                except Exception:
                    break