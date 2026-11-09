# -*- coding: utf-8 -*-
"""Máy chủ tĩnh để xem thử portfolio.

    python serve.py            -> http://127.0.0.1:8090
    python serve.py 9000       -> đổi cổng

Trang này cũng mở được bằng cách bấm đúp vào index.html. Chạy qua máy chủ
chỉ để kiểm tra thêm những thứ file:// không mô phỏng được, ví dụ header
cache hay đường dẫn tuyệt đối.

Luôn dùng 127.0.0.1 chứ không dùng localhost: trên máy này localhost phải
đợi phân giải IPv6 hỏng rồi mới quay về IPv4, cộng thêm khoảng hai giây cho
mỗi request và làm mọi phép đo hiệu năng thành vô nghĩa.
"""

import http.server
import os
import socketserver
import sys

ROOT = os.path.dirname(os.path.abspath(__file__))
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8090


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def end_headers(self):
        # Không cache trong lúc phát triển, sửa file là F5 thấy ngay
        self.send_header("Cache-Control", "no-store, must-revalidate")
        super().end_headers()

    def log_message(self, fmt, *args):
        # Chỉ in lỗi, bỏ qua dòng log cho từng file tĩnh
        if args and str(args[1]).startswith(("4", "5")):
            super().log_message(fmt, *args)


if __name__ == "__main__":
    # Phải là bản đa luồng: trang nạp ~20 file JS cùng lúc, bản đơn luồng với
    # hàng đợi mặc định (5) làm trình duyệt trên Windows nhận ERR_CONNECTION_REFUSED
    # và trang kẹt ở màn mở đầu.
    socketserver.ThreadingTCPServer.allow_reuse_address = True
    socketserver.ThreadingTCPServer.daemon_threads = True
    with socketserver.ThreadingTCPServer(("127.0.0.1", PORT), Handler) as httpd:
        print("Portfolio dang chay tai: http://127.0.0.1:%d" % PORT)
        print("Thu muc goc: %s" % ROOT)
        print("Ctrl+C de dung.")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nDa dung.")
