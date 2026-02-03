#!/usr/bin/env python3
"""
简单的HTTP服务器，用于调试index.html
添加CORS头以支持本地开发
"""

from http.server import HTTPServer, SimpleHTTPRequestHandler
import json
import os

class CORSHTTPRequestHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()
    
    def do_GET(self):
        # 处理特殊的调试端点
        if self.path == '/debug/status':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            status = {
                'server': 'running',
                'data_file_exists': os.path.exists('data/history.json'),
                'index_exists': os.path.exists('index.html')
            }
            self.wfile.write(json.dumps(status).encode())
        else:
            super().do_GET()

if __name__ == '__main__':
    port = 8000
    server = HTTPServer(('localhost', port), CORSHTTPRequestHandler)
    print(f"服务器运行在 http://localhost:{port}")
    print(f"调试页面: http://localhost:{port}/debug.html")
    print(f"主页: http://localhost:{port}/index.html")
    print("按 Ctrl+C 停止服务器")
    server.serve_forever()