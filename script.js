/* Trợ lý Gia hạn Đại lý Sao Việt
 * Dữ liệu hư cấu phục vụ trình diễn - không liên quan đến khách hàng thực tế.
 * Ngày hết hạn được tính tương đối so với ngày hiện tại (hetHanSauNgay)
 * để bộ lọc 30/60/90 ngày luôn có dữ liệu khi trình diễn.
 */
(function () {
  "use strict";

  var NO_UPSELL = "Không có";
  var DONE_STATUS = "Đã gia hạn";
  var RISK_ORDER = { "Cao": 0, "Trung bình": 1, "Thấp": 2 };
  var RISK_CLASS = { "Cao": "high", "Trung bình": "medium", "Thấp": "low" };
  var REGIONS = ["Miền Bắc", "Miền Trung", "Miền Nam", "Tây Nguyên"];

  var RAW_CONTRACTS = [
    { ma: "HD-2024-001", khachHang: "Công ty CP Thép Phương Nam", vung: "Miền Nam", sanPham: "Microsoft 365 E3", hetHanSauNgay: 12, license: 450, giaTri: 1850000000, trangThai: "Chưa liên hệ", ruiRo: "Cao", lyDo: "Mức sử dụng Teams giảm 40% trong 3 tháng", banThem: "Nâng cấp Microsoft 365 E5", giaTriBanThem: 620000000, nhanVien: "Nguyễn Minh Anh", hanhDong: "Gọi điện cho CIO trong tuần này, đề xuất buổi review mức sử dụng" },
    { ma: "HD-2024-002", khachHang: "Tập đoàn Bất động sản Hồng Lam", vung: "Miền Bắc", sanPham: "Dynamics 365 Sales", hetHanSauNgay: 20, license: 120, giaTri: 2400000000, trangThai: "Đang trao đổi", ruiRo: "Cao", lyDo: "Đối thủ đang chào giá CRM thay thế", banThem: "Bổ sung Copilot for Sales", giaTriBanThem: 540000000, nhanVien: "Trần Quốc Bảo", hanhDong: "Tổ chức demo Copilot for Sales và đề xuất ưu đãi gia hạn 2 năm" },
    { ma: "HD-2024-003", khachHang: "Bệnh viện Đa khoa Ánh Dương", vung: "Miền Trung", sanPham: "Microsoft 365 Business Premium", hetHanSauNgay: 8, license: 300, giaTri: 980000000, trangThai: "Chưa liên hệ", ruiRo: "Cao", lyDo: "Ngân sách CNTT bị cắt giảm 25%", banThem: NO_UPSELL, giaTriBanThem: 0, nhanVien: "Lê Thu Hà", hanhDong: "Đề xuất phương án thanh toán theo tháng để giảm áp lực ngân sách" },
    { ma: "HD-2024-004", khachHang: "Công ty TNHH Logistics Sông Hàn", vung: "Miền Trung", sanPham: "Azure (CSP)", hetHanSauNgay: 35, license: 1, giaTri: 1450000000, trangThai: "Đã gửi báo giá", ruiRo: "Trung bình", lyDo: "Chi phí Azure tăng, khách hàng muốn tối ưu", banThem: "Azure Reserved Instances", giaTriBanThem: 300000000, nhanVien: "Phạm Gia Huy", hanhDong: "Gửi báo cáo tối ưu chi phí Azure kèm đề xuất Reserved Instances" },
    { ma: "HD-2024-005", khachHang: "Ngân hàng TMCP Đông Phong", vung: "Miền Bắc", sanPham: "Microsoft Fabric F64", hetHanSauNgay: 55, license: 1, giaTri: 3200000000, trangThai: "Đang trao đổi", ruiRo: "Thấp", lyDo: "Mức sử dụng ổn định, phản hồi tích cực", banThem: "Mở rộng Fabric F128", giaTriBanThem: 2900000000, nhanVien: "Trần Quốc Bảo", hanhDong: "Chuẩn bị đề xuất mở rộng dung lượng Fabric cho Q tới" },
    { ma: "HD-2024-006", khachHang: "Trường Đại học Công nghệ Bình Minh", vung: "Miền Nam", sanPham: "Microsoft 365 A3", hetHanSauNgay: 42, license: 1200, giaTri: 760000000, trangThai: "Chờ phê duyệt", ruiRo: "Trung bình", lyDo: "Quy trình phê duyệt ngân sách kéo dài", banThem: "Microsoft 365 A5 Security", giaTriBanThem: 410000000, nhanVien: "Võ Thanh Tâm", hanhDong: "Hỗ trợ hồ sơ phê duyệt và theo dõi tiến độ hằng tuần" },
    { ma: "HD-2024-007", khachHang: "Công ty CP Dược phẩm Hoa Sen", vung: "Miền Nam", sanPham: "Power BI Pro", hetHanSauNgay: 27, license: 180, giaTri: 420000000, trangThai: "Chưa liên hệ", ruiRo: "Trung bình", lyDo: "30% license không hoạt động", banThem: "Chuyển lên Microsoft Fabric", giaTriBanThem: 850000000, nhanVien: "Nguyễn Minh Anh", hanhDong: "Rà soát license không dùng, giới thiệu lộ trình Fabric" },
    { ma: "HD-2024-008", khachHang: "Tổng công ty May mặc Việt Tiến Phát", vung: "Miền Nam", sanPham: "Microsoft 365 E3", hetHanSauNgay: 18, license: 820, giaTri: 3350000000, trangThai: "Đang trao đổi", ruiRo: "Cao", lyDo: "Khách hàng đánh giá Google Workspace", banThem: "Microsoft 365 Copilot", giaTriBanThem: 1800000000, nhanVien: "Võ Thanh Tâm", hanhDong: "Mời lãnh đạo tham dự workshop Copilot, chuẩn bị so sánh TCO" },
    { ma: "HD-2024-009", khachHang: "Công ty TNHH Nông sản Cao Nguyên Xanh", vung: "Tây Nguyên", sanPham: "Microsoft 365 Business Standard", hetHanSauNgay: 64, license: 95, giaTri: 210000000, trangThai: "Chưa liên hệ", ruiRo: "Thấp", lyDo: "Không có tín hiệu rủi ro", banThem: "Nâng cấp Business Premium", giaTriBanThem: 95000000, nhanVien: "Lê Thu Hà", hanhDong: "Gửi email nhắc gia hạn kèm ưu đãi nâng cấp bảo mật" },
    { ma: "HD-2024-010", khachHang: "Công ty CP Năng lượng Mặt Trời Đắk Lắk", vung: "Tây Nguyên", sanPham: "Azure (CSP)", hetHanSauNgay: 14, license: 1, giaTri: 1120000000, trangThai: "Chưa liên hệ", ruiRo: "Cao", lyDo: "Hóa đơn quá hạn 45 ngày", banThem: NO_UPSELL, giaTriBanThem: 0, nhanVien: "Phạm Gia Huy", hanhDong: "Phối hợp kế toán xử lý công nợ trước khi gia hạn" },
    { ma: "HD-2024-011", khachHang: "Tập đoàn Bán lẻ Sao Mai", vung: "Miền Bắc", sanPham: "Dynamics 365 Business Central", hetHanSauNgay: 75, license: 60, giaTri: 890000000, trangThai: "Đã gửi báo giá", ruiRo: "Trung bình", lyDo: "Thay đổi người phụ trách CNTT phía khách hàng", banThem: "Bổ sung Power Apps", giaTriBanThem: 220000000, nhanVien: "Trần Quốc Bảo", hanhDong: "Đặt lịch gặp giám đốc CNTT mới để giới thiệu giá trị giải pháp" },
    { ma: "HD-2024-012", khachHang: "Công ty CP Cảng Biển Hải Đăng", vung: "Miền Bắc", sanPham: "Microsoft 365 E5", hetHanSauNgay: 88, license: 540, giaTri: 3900000000, trangThai: "Đang trao đổi", ruiRo: "Thấp", lyDo: "Mức sử dụng cao, hài lòng với dịch vụ", banThem: "Microsoft 365 Copilot", giaTriBanThem: 2100000000, nhanVien: "Nguyễn Minh Anh", hanhDong: "Đề xuất pilot Copilot cho 50 người dùng" },
    { ma: "HD-2024-013", khachHang: "Khách sạn Biển Ngọc Resort", vung: "Miền Trung", sanPham: "Microsoft 365 Business Premium", hetHanSauNgay: 5, license: 140, giaTri: 470000000, trangThai: "Chờ phê duyệt", ruiRo: "Cao", lyDo: "Sắp hết hạn, chưa có quyết định cuối", banThem: NO_UPSELL, giaTriBanThem: 0, nhanVien: "Lê Thu Hà", hanhDong: "Liên hệ ngay chủ đầu tư để chốt gia hạn trước ngày hết hạn" },
    { ma: "HD-2024-014", khachHang: "Công ty TNHH Phần mềm Mây Xanh", vung: "Miền Nam", sanPham: "GitHub Enterprise", hetHanSauNgay: 47, license: 210, giaTri: 1050000000, trangThai: "Đã gửi báo giá", ruiRo: "Thấp", lyDo: "Đội phát triển tăng trưởng nhanh", banThem: "GitHub Copilot Business", giaTriBanThem: 780000000, nhanVien: "Võ Thanh Tâm", hanhDong: "Gửi đề xuất GitHub Copilot kèm số liệu năng suất" },
    { ma: "HD-2024-015", khachHang: "Công ty CP Xây dựng Trường Sơn", vung: "Miền Trung", sanPham: "Microsoft 365 E3", hetHanSauNgay: 58, license: 380, giaTri: 1560000000, trangThai: "Chưa liên hệ", ruiRo: "Cao", lyDo: "Sáp nhập công ty, có thể hợp nhất hệ thống", banThem: "Hợp nhất tenant & nâng cấp E5", giaTriBanThem: 900000000, nhanVien: "Phạm Gia Huy", hanhDong: "Đề xuất dịch vụ hợp nhất tenant, nhờ Tech Data hỗ trợ kỹ thuật" },
    { ma: "HD-2024-016", khachHang: "Công ty CP Cà phê Buôn Ma Thuột Gold", vung: "Tây Nguyên", sanPham: "Power BI Pro", hetHanSauNgay: 33, license: 45, giaTri: 105000000, trangThai: "Đang trao đổi", ruiRo: "Trung bình", lyDo: "Khách hàng hỏi về giải pháp BI miễn phí", banThem: "Power BI Premium Per User", giaTriBanThem: 60000000, nhanVien: "Lê Thu Hà", hanhDong: "Trình bày giá trị bảo mật và quản trị của Power BI" },
    { ma: "HD-2024-017", khachHang: "Tổng công ty Vận tải Thăng Long", vung: "Miền Bắc", sanPham: "Windows Server & SQL Server", hetHanSauNgay: 24, license: 64, giaTri: 1680000000, trangThai: "Chưa liên hệ", ruiRo: "Cao", lyDo: "Hạ tầng cũ, đang cân nhắc chuyển đổi đám mây", banThem: "Di chuyển lên Azure", giaTriBanThem: 1500000000, nhanVien: "Trần Quốc Bảo", hanhDong: "Đề xuất đánh giá di chuyển Azure miễn phí cùng Tech Data" },
    { ma: "HD-2024-018", khachHang: "Công ty TNHH Thực phẩm Mekong Fresh", vung: "Miền Nam", sanPham: "Microsoft 365 Business Premium", hetHanSauNgay: 96, license: 160, giaTri: 540000000, trangThai: "Chưa liên hệ", ruiRo: "Thấp", lyDo: "Không có tín hiệu rủi ro", banThem: NO_UPSELL, giaTriBanThem: 0, nhanVien: "Nguyễn Minh Anh", hanhDong: "Lên lịch nhắc gia hạn trước 60 ngày" },
    { ma: "HD-2024-019", khachHang: "Viện Nghiên cứu Khoa học Hà Thành", vung: "Miền Bắc", sanPham: "Microsoft 365 A3", hetHanSauNgay: 40, license: 650, giaTri: 520000000, trangThai: "Đã gia hạn", ruiRo: "Thấp", lyDo: "Đã ký gia hạn", banThem: NO_UPSELL, giaTriBanThem: 0, nhanVien: "Trần Quốc Bảo", hanhDong: "Theo dõi triển khai và mức độ hài lòng" },
    { ma: "HD-2024-020", khachHang: "Công ty CP Du lịch Hội An Heritage", vung: "Miền Trung", sanPham: "Dynamics 365 Customer Service", hetHanSauNgay: 69, license: 40, giaTri: 640000000, trangThai: "Đang trao đổi", ruiRo: "Trung bình", lyDo: "Lượng ticket giảm do mùa thấp điểm", banThem: "Bổ sung Copilot Studio", giaTriBanThem: 250000000, nhanVien: "Phạm Gia Huy", hanhDong: "Đề xuất chatbot Copilot Studio giảm chi phí vận hành" },
    { ma: "HD-2024-021", khachHang: "Công ty CP Chứng khoán Kim Long", vung: "Miền Nam", sanPham: "Microsoft Fabric F32", hetHanSauNgay: 29, license: 1, giaTri: 1380000000, trangThai: "Chờ phê duyệt", ruiRo: "Trung bình", lyDo: "Yêu cầu bổ sung cam kết bảo mật dữ liệu", banThem: "Microsoft Purview", giaTriBanThem: 450000000, nhanVien: "Võ Thanh Tâm", hanhDong: "Gửi tài liệu tuân thủ và đề xuất Purview" },
    { ma: "HD-2024-022", khachHang: "Công ty TNHH Điện tử Sao Bắc", vung: "Miền Bắc", sanPham: "Microsoft 365 E3", hetHanSauNgay: 110, license: 260, giaTri: 1070000000, trangThai: "Chưa liên hệ", ruiRo: "Thấp", lyDo: "Không có tín hiệu rủi ro", banThem: "Microsoft Intune Suite", giaTriBanThem: 180000000, nhanVien: "Nguyễn Minh Anh", hanhDong: "Đưa vào kế hoạch chăm sóc quý sau" },
    { ma: "HD-2024-023", khachHang: "Công ty CP Gỗ Pleiku", vung: "Tây Nguyên", sanPham: "Microsoft 365 Business Standard", hetHanSauNgay: 51, license: 70, giaTri: 160000000, trangThai: "Chưa liên hệ", ruiRo: "Cao", lyDo: "Không phản hồi email trong 2 tháng", banThem: NO_UPSELL, giaTriBanThem: 0, nhanVien: "Lê Thu Hà", hanhDong: "Đến gặp trực tiếp khách hàng tại văn phòng Pleiku" },
    { ma: "HD-2024-024", khachHang: "Công ty CP Hàng không Lữ hành Cánh Việt", vung: "Miền Nam", sanPham: "Azure (CSP)", hetHanSauNgay: 82, license: 1, giaTri: 2750000000, trangThai: "Đã gia hạn", ruiRo: "Thấp", lyDo: "Đã ký gia hạn 3 năm", banThem: "Azure OpenAI Service", giaTriBanThem: 1200000000, nhanVien: "Võ Thanh Tâm", hanhDong: "Giới thiệu use case Azure OpenAI cho chăm sóc khách hàng" }
  ];

  var MS_PER_DAY = 24 * 60 * 60 * 1000;

  function startOfToday() {
    var d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }

  var TODAY = startOfToday();

  var CONTRACTS = RAW_CONTRACTS.map(function (c) {
    var exp = new Date(TODAY.getTime());
    exp.setDate(exp.getDate() + c.hetHanSauNgay);
    var copy = {};
    Object.keys(c).forEach(function (k) { copy[k] = c[k]; });
    copy.ngayHetHan = exp;
    return copy;
  });

  // ---------- Định dạng ----------
  var numberFmt = new Intl.NumberFormat("vi-VN");

  function formatVnd(v) {
    return numberFmt.format(v) + " ₫";
  }

  function formatVndShort(v) {
    if (v >= 1e9) {
      return new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 2 }).format(v / 1e9) + " tỷ ₫";
    }
    if (v >= 1e6) {
      return new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(v / 1e6) + " triệu ₫";
    }
    return formatVnd(v);
  }

  function pad(n) { return n < 10 ? "0" + n : String(n); }

  function formatDate(d) {
    return pad(d.getDate()) + "/" + pad(d.getMonth() + 1) + "/" + d.getFullYear();
  }

  function daysUntil(d) {
    return Math.round((d.getTime() - TODAY.getTime()) / MS_PER_DAY);
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function normalize(s) {
    return String(s)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d");
  }

  function riskBadge(risk) {
    return '<span class="badge badge-' + RISK_CLASS[risk] + '">' + escapeHtml(risk) + "</span>";
  }

  function statusTag(status) {
    var cls = status === DONE_STATUS ? "status status-done" : "status";
    return '<span class="' + cls + '">' + escapeHtml(status) + "</span>";
  }

  function hasUpsell(c) {
    return c.banThem !== NO_UPSELL;
  }

  function needsAction(c) {
    return c.trangThai !== DONE_STATUS;
  }

  // ---------- Sắp xếp: rủi ro → giá trị → ngày hết hạn ----------
  function compareContracts(a, b) {
    var r = RISK_ORDER[a.ruiRo] - RISK_ORDER[b.ruiRo];
    if (r !== 0) return r;
    var v = b.giaTri - a.giaTri;
    if (v !== 0) return v;
    return a.ngayHetHan - b.ngayHetHan;
  }

  // ---------- DOM ----------
  var el = {
    search: document.getElementById("searchInput"),
    region: document.getElementById("filterRegion"),
    risk: document.getElementById("filterRisk"),
    status: document.getElementById("filterStatus"),
    product: document.getElementById("filterProduct"),
    sales: document.getElementById("filterSales"),
    expiry: document.getElementById("filterExpiry"),
    reset: document.getElementById("resetFilters"),
    csv: document.getElementById("downloadCsv"),
    resultCount: document.getElementById("resultCount"),
    kpiTotal: document.getElementById("kpiTotal"),
    kpiTotalNote: document.getElementById("kpiTotalNote"),
    kpiHighRisk: document.getElementById("kpiHighRisk"),
    kpiHighRiskNote: document.getElementById("kpiHighRiskNote"),
    kpiAction: document.getElementById("kpiAction"),
    kpiUpsell: document.getElementById("kpiUpsell"),
    kpiUpsellNote: document.getElementById("kpiUpsellNote"),
    priorityList: document.getElementById("priorityList"),
    chart: document.getElementById("regionChart"),
    tableBody: document.querySelector("#renewalTable tbody"),
    renewalEmpty: document.getElementById("renewalEmpty"),
    upsellGrid: document.getElementById("upsellGrid"),
    upsellEmpty: document.getElementById("upsellEmpty"),
    tabs: document.querySelectorAll(".tab"),
    panels: document.querySelectorAll(".tab-panel")
  };

  function uniqueSorted(key) {
    var set = {};
    CONTRACTS.forEach(function (c) { set[c[key]] = true; });
    return Object.keys(set).sort(function (a, b) { return a.localeCompare(b, "vi"); });
  }

  function fillSelect(select, values) {
    values.forEach(function (v) {
      var opt = document.createElement("option");
      opt.value = v;
      opt.textContent = v;
      select.appendChild(opt);
    });
  }

  function initFilters() {
    fillSelect(el.region, REGIONS);
    fillSelect(el.risk, ["Cao", "Trung bình", "Thấp"]);
    fillSelect(el.status, ["Chưa liên hệ", "Đang trao đổi", "Đã gửi báo giá", "Chờ phê duyệt", DONE_STATUS]);
    fillSelect(el.product, uniqueSorted("sanPham"));
    fillSelect(el.sales, uniqueSorted("nhanVien"));
  }

  // ---------- Lọc ----------
  function getFilteredContracts() {
    var q = normalize(el.search.value.trim());
    var region = el.region.value;
    var risk = el.risk.value;
    var status = el.status.value;
    var product = el.product.value;
    var sales = el.sales.value;
    var expiry = el.expiry.value ? parseInt(el.expiry.value, 10) : null;

    return CONTRACTS.filter(function (c) {
      if (q && normalize(c.khachHang).indexOf(q) === -1 && normalize(c.ma).indexOf(q) === -1) return false;
      if (region && c.vung !== region) return false;
      if (risk && c.ruiRo !== risk) return false;
      if (status && c.trangThai !== status) return false;
      if (product && c.sanPham !== product) return false;
      if (sales && c.nhanVien !== sales) return false;
      if (expiry !== null) {
        var d = daysUntil(c.ngayHetHan);
        if (d < 0 || d > expiry) return false;
      }
      return true;
    }).sort(compareContracts);
  }

  // ---------- KPI ----------
  function computeKpis(list) {
    var total = 0, highRisk = 0, highRiskCount = 0, action = 0, upsell = 0, upsellValue = 0;
    list.forEach(function (c) {
      total += c.giaTri;
      if (c.ruiRo === "Cao") { highRisk += c.giaTri; highRiskCount++; }
      if (needsAction(c)) action++;
      if (hasUpsell(c)) { upsell++; upsellValue += c.giaTriBanThem; }
    });
    return { total: total, count: list.length, highRisk: highRisk, highRiskCount: highRiskCount, action: action, upsell: upsell, upsellValue: upsellValue };
  }

  function renderKpis(list) {
    var k = computeKpis(list);
    el.kpiTotal.textContent = formatVndShort(k.total);
    el.kpiTotal.title = formatVnd(k.total);
    el.kpiTotalNote.textContent = k.count + " hợp đồng";
    el.kpiHighRisk.textContent = formatVndShort(k.highRisk);
    el.kpiHighRisk.title = formatVnd(k.highRisk);
    el.kpiHighRiskNote.textContent = k.highRiskCount + " hợp đồng rủi ro cao";
    el.kpiAction.textContent = String(k.action);
    el.kpiUpsell.textContent = String(k.upsell);
    el.kpiUpsellNote.textContent = "Tiềm năng " + formatVndShort(k.upsellValue);
  }

  // ---------- Top 5 ----------
  function renderPriority(list) {
    var top = list.filter(needsAction).slice(0, 5);
    if (!top.length) {
      el.priorityList.innerHTML = '<li class="empty">Không có hợp đồng cần ưu tiên.</li>';
      return;
    }
    el.priorityList.innerHTML = top.map(function (c, i) {
      var days = daysUntil(c.ngayHetHan);
      return '<li class="priority-item risk-' + RISK_CLASS[c.ruiRo] + '">' +
        '<span class="priority-rank">#' + (i + 1) + " · " + escapeHtml(c.ma) + "</span>" +
        '<span class="priority-name">' + escapeHtml(c.khachHang) + "</span>" +
        "<span>" + riskBadge(c.ruiRo) + "</span>" +
        '<span class="priority-value">' + formatVnd(c.giaTri) + "</span>" +
        '<span class="priority-meta">Hết hạn ' + formatDate(c.ngayHetHan) + " (còn " + days + " ngày) · " + escapeHtml(c.nhanVien) + "</span>" +
        '<span class="priority-action">' + escapeHtml(c.hanhDong) + "</span>" +
        "</li>";
    }).join("");
  }

  // ---------- Bảng ----------
  function renderTable(list) {
    el.tableBody.innerHTML = list.map(function (c) {
      var days = daysUntil(c.ngayHetHan);
      var urgent = days <= 30 ? " urgent" : "";
      return "<tr>" +
        '<td class="nowrap">' + escapeHtml(c.ma) + "</td>" +
        '<td class="col-customer"><strong>' + escapeHtml(c.khachHang) + "</strong></td>" +
        '<td class="nowrap">' + escapeHtml(c.vung) + "</td>" +
        "<td>" + escapeHtml(c.sanPham) + "</td>" +
        '<td class="nowrap">' + formatDate(c.ngayHetHan) + '<span class="days-left' + urgent + '">còn ' + days + " ngày</span></td>" +
        '<td class="num">' + numberFmt.format(c.license) + "</td>" +
        '<td class="num">' + formatVnd(c.giaTri) + "</td>" +
        "<td>" + statusTag(c.trangThai) + "</td>" +
        "<td>" + riskBadge(c.ruiRo) + "</td>" +
        '<td class="col-wide">' + escapeHtml(c.lyDo) + "</td>" +
        '<td class="nowrap">' + escapeHtml(c.nhanVien) + "</td>" +
        '<td class="col-wide">' + escapeHtml(c.hanhDong) + "</td>" +
        "</tr>";
    }).join("");
    el.renewalEmpty.hidden = list.length > 0;
  }

  // ---------- Biểu đồ ----------
  function computeHighRiskByRegion(list) {
    var totals = {};
    REGIONS.forEach(function (r) { totals[r] = 0; });
    list.forEach(function (c) {
      if (c.ruiRo === "Cao") totals[c.vung] += c.giaTri;
    });
    return totals;
  }

  function renderChart(list) {
    var totals = computeHighRiskByRegion(list);
    var max = 0;
    REGIONS.forEach(function (r) { if (totals[r] > max) max = totals[r]; });
    el.chart.innerHTML = REGIONS.map(function (r) {
      var pct = max > 0 ? (totals[r] / max) * 100 : 0;
      return '<div class="chart-row">' +
        '<span class="chart-label">' + escapeHtml(r) + "</span>" +
        '<div class="chart-track"><div class="chart-bar" style="width:' + pct.toFixed(1) + '%"></div></div>' +
        '<span class="chart-value" title="' + formatVnd(totals[r]) + '">' + formatVndShort(totals[r]) + "</span>" +
        "</div>";
    }).join("");
  }

  // ---------- Cơ hội bán thêm ----------
  function renderUpsell(list) {
    var items = list.filter(hasUpsell).sort(function (a, b) { return b.giaTriBanThem - a.giaTriBanThem; });
    el.upsellGrid.innerHTML = items.map(function (c) {
      return '<article class="upsell-card">' +
        '<div class="upsell-row"><span class="upsell-meta">' + escapeHtml(c.ma) + " · " + escapeHtml(c.vung) + "</span>" + riskBadge(c.ruiRo) + "</div>" +
        "<h3>" + escapeHtml(c.khachHang) + "</h3>" +
        '<span class="upsell-meta">Hiện tại: ' + escapeHtml(c.sanPham) + " · " + numberFmt.format(c.license) + " license</span>" +
        '<span class="upsell-offer">' + escapeHtml(c.banThem) + "</span>" +
        '<div class="upsell-row"><span>Giá trị bán thêm ước tính</span><strong>' + formatVnd(c.giaTriBanThem) + "</strong></div>" +
        '<div class="upsell-row"><span>Giá trị gia hạn</span><span>' + formatVnd(c.giaTri) + "</span></div>" +
        '<div class="upsell-row"><span>Phụ trách: ' + escapeHtml(c.nhanVien) + "</span>" + statusTag(c.trangThai) + "</div>" +
        "</article>";
    }).join("");
    el.upsellEmpty.hidden = items.length > 0;
  }

  // ---------- CSV ----------
  function csvCell(v) {
    var s = String(v);
    // Chống CSV/formula injection khi mở bằng Excel
    if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
    return '"' + s.replace(/"/g, '""') + '"';
  }

  function buildCsv(list) {
    var header = ["Mã hợp đồng", "Tên khách hàng", "Vùng", "Sản phẩm Microsoft hiện tại", "Ngày hết hạn", "Số ngày còn lại",
      "Số license", "Giá trị gia hạn (VND)", "Trạng thái gia hạn", "Mức độ rủi ro", "Lý do rủi ro",
      "Cơ hội bán thêm", "Nhân viên phụ trách", "Hành động đề xuất"];
    var rows = list.map(function (c) {
      return [c.ma, c.khachHang, c.vung, c.sanPham, formatDate(c.ngayHetHan), daysUntil(c.ngayHetHan),
        c.license, c.giaTri, c.trangThai, c.ruiRo, c.lyDo, c.banThem, c.nhanVien, c.hanhDong];
    });
    return [header].concat(rows).map(function (r) { return r.map(csvCell).join(","); }).join("\r\n");
  }

  function downloadCsv() {
    var list = getFilteredContracts();
    var csv = "\uFEFF" + buildCsv(list);
    var blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    var t = TODAY;
    a.href = url;
    a.download = "danh-sach-hanh-dong-gia-han-" + t.getFullYear() + pad(t.getMonth() + 1) + pad(t.getDate()) + ".csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  // ---------- Tabs ----------
  function activateTab(tab) {
    el.tabs.forEach(function (t) {
      var active = t === tab;
      t.classList.toggle("active", active);
      t.setAttribute("aria-selected", active ? "true" : "false");
    });
    el.panels.forEach(function (p) {
      p.hidden = p.id !== tab.getAttribute("aria-controls");
    });
  }

  // ---------- Render ----------
  function render() {
    var list = getFilteredContracts();
    el.resultCount.textContent = "Hiển thị " + list.length + " / " + CONTRACTS.length + " hợp đồng";
    renderKpis(list);
    renderPriority(list);
    renderChart(list);
    renderTable(list);
    renderUpsell(list);
  }

  function resetFilters() {
    el.search.value = "";
    [el.region, el.risk, el.status, el.product, el.sales, el.expiry].forEach(function (s) { s.value = ""; });
    render();
  }

  function init() {
    initFilters();
    el.search.addEventListener("input", render);
    [el.region, el.risk, el.status, el.product, el.sales, el.expiry].forEach(function (s) {
      s.addEventListener("change", render);
    });
    el.reset.addEventListener("click", resetFilters);
    el.csv.addEventListener("click", downloadCsv);
    el.tabs.forEach(function (t) {
      t.addEventListener("click", function () { activateTab(t); });
    });
    render();
  }

  init();
})();
