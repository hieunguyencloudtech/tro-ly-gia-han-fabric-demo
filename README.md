# Trợ lý Gia hạn Đại lý Sao Việt

Ứng dụng web tĩnh (HTML, CSS, JavaScript thuần) giúp đội kinh doanh của Đại lý Sao Việt biến các insight về hợp đồng gia hạn từ **Microsoft Fabric** thành danh sách hành động được ưu tiên.

> **Dữ liệu hư cấu phục vụ trình diễn.** Toàn bộ khách hàng, hợp đồng, giá trị và nhân viên đều là dữ liệu tổng hợp, không liên quan đến tổ chức hay cá nhân thực tế.

## Tính năng

- Giao diện tiếng Việt, phong cách Microsoft (teal, xanh dương, trắng), tối ưu cho laptop và co giãn trên màn hình nhỏ.
- 4 thẻ KPI (tính theo bộ lọc hiện tại):
  - **Tổng giá trị gia hạn** – tổng giá trị các hợp đồng đang hiển thị.
  - **Giá trị rủi ro cao** – tổng giá trị các hợp đồng có mức rủi ro *Cao*.
  - **Số hợp đồng cần xử lý** – số hợp đồng có trạng thái khác *Đã gia hạn*.
  - **Số cơ hội bán thêm** – số hợp đồng có cơ hội bán thêm.
- Bộ lọc theo vùng, mức độ rủi ro, trạng thái, sản phẩm, nhân viên phụ trách và thời hạn hết hạn trong 30/60/90 ngày tới.
- Tìm kiếm theo tên khách hàng hoặc mã hợp đồng (không phân biệt hoa/thường và dấu tiếng Việt).
- Khu vực **Top 5 hợp đồng ưu tiên cao nhất** (không gồm hợp đồng đã gia hạn).
- Bảng hợp đồng sắp xếp theo rủi ro (Cao → Trung bình → Thấp), giá trị gia hạn (lớn → nhỏ), ngày hết hạn (gần → xa).
- Nhãn rủi ro màu đỏ (Cao), cam (Trung bình), xanh lá (Thấp).
- Tab thứ hai **Cơ hội bán thêm**.
- Biểu đồ giá trị gia hạn rủi ro cao theo vùng.
- Tải danh sách hành động đã lọc dưới dạng CSV (UTF-8, mở tốt bằng Excel).
- Bảng **Tech Data có thể hỗ trợ**.

## Cấu trúc

| Tệp | Mô tả |
| --- | --- |
| `index.html` | Bố cục trang |
| `styles.css` | Giao diện |
| `script.js` | Dữ liệu hư cấu (24 hợp đồng) và toàn bộ logic: lọc, tìm kiếm, sắp xếp, KPI, biểu đồ, CSV, tab |

Ngày hết hạn của từng hợp đồng được tính tương đối so với ngày mở trang (trường `hetHanSauNgay` trong `script.js`), vì vậy các bộ lọc 30/60/90 ngày luôn có dữ liệu khi trình diễn.

## Chạy ứng dụng

Không cần cài đặt hay build. Chỉ cần mở `index.html` trực tiếp bằng trình duyệt.

### Triển khai GitHub Pages

1. Vào **Settings → Pages** của repository.
2. Ở mục **Build and deployment**, chọn **Deploy from a branch**, nhánh `main`, thư mục `/ (root)`.
3. Lưu lại và truy cập địa chỉ GitHub Pages được cung cấp.

---

Demo được tạo bằng GitHub Copilot cho chương trình AI RACE Refuel
