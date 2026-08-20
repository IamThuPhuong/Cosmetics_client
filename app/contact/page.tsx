"use client";

import { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  MessageSquare,
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    topic: "Tư vấn chọn mỹ phẩm / tone da",
    message: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1000);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          Hỗ trợ 24/7 &amp; Tư vấn làm đẹp
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mb-3">
          Liên hệ với LuxeBeauty
        </h1>
        <p className="text-sm text-gray-500 leading-relaxed">
          Đội ngũ chuyên gia mỹ phẩm luôn sẵn sàng lắng nghe và tư vấn chu trình chăm sóc da chuẩn y khoa dành riêng cho bạn.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
        {/* Contact Info (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-rose-100">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              Hệ thống Showroom Flagship
            </h2>

            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-900 uppercase">Showroom Hà Nội</div>
                  <div className="text-sm text-gray-600 mt-0.5">
                    Tầng 1, Vincom Center Bà Triệu, 191 Bà Triệu, Q. Hai Bà Trưng, Hà Nội
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-900 uppercase">Showroom TP.HCM</div>
                  <div className="text-sm text-gray-600 mt-0.5">
                    Tầng B1, Takashimaya, 92-94 Nam Kỳ Khởi Nghĩa, Q. 1, TP. Hồ Chí Minh
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-900 uppercase">Giờ mở cửa</div>
                  <div className="text-sm text-gray-600 mt-0.5">
                    08:30 - 22:00 (Tất cả các ngày trong tuần, kể cả ngày lễ Tết)
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-900 uppercase">Đường dây nóng</div>
                  <div className="text-sm font-mono font-bold text-rose-600 mt-0.5">
                    1900 6868 <span className="text-xs text-gray-400 font-normal">(Nhánh 1: Tư vấn, Nhánh 2: Đơn hàng)</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-900 uppercase">Email hỗ trợ</div>
                  <div className="text-sm font-medium text-gray-700 mt-0.5">
                    support@luxebeauty.vn
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Banner */}
          <div className="bg-stone-900 text-white rounded-3xl p-6 relative overflow-hidden">
            <div className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Cam kết chất lượng
            </div>
            <p className="text-xs text-stone-300 leading-relaxed mt-1">
              Tất cả mỹ phẩm tại LuxeBeauty đều có tem phụ chống hàng giả từ Bộ Công An và giấy tờ hải quan nhập khẩu chính ngạch 100%.
            </p>
          </div>
        </div>

        {/* Contact Form (7 cols) */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-rose-100">
            {isSubmitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 border-4 border-white shadow-lg shadow-emerald-500/20 inline-flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2">
                  Đã gửi yêu cầu thành công!
                </h3>
                <p className="text-xs text-gray-500 max-w-md mx-auto mb-6">
                  Cảm ơn bạn đã liên hệ với LuxeBeauty. Đội ngũ CSKH sẽ phản hồi qua email hoặc số điện thoại của bạn trong vòng 2 giờ.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData({
                      name: "",
                      email: "",
                      phone: "",
                      topic: "Tư vấn chọn mỹ phẩm / tone da",
                      message: "",
                    });
                  }}
                  className="px-6 py-2.5 rounded-full bg-rose-600 text-white font-bold text-xs uppercase tracking-wider hover:bg-rose-700 transition-colors"
                >
                  Gửi tin nhắn khác
                </button>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-rose-600" />
                    Gửi tin nhắn trực tiếp
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Điền biểu mẫu dưới đây, nhân viên tư vấn sẽ liên hệ với bạn trong thời gian sớm nhất.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                        Họ và tên <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Nguyễn Thu Phương"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                        Số điện thoại <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="0912345678"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                        Email liên hệ <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="customer@gmail.com"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                        Vấn đề cần hỗ trợ
                      </label>
                      <select
                        value={formData.topic}
                        onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
                      >
                        <option>Tư vấn chọn mỹ phẩm / tone da</option>
                        <option>Tra cứu tình trạng vận chuyển đơn hàng</option>
                        <option>Khiếu nại / Đổi trả sản phẩm</option>
                        <option>Hợp tác đại lý / Phân phối sỉ</option>
                        <option>Vấn đề thanh toán PayPal / VietQR</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                      Nội dung chi tiết <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows={5}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Mô tả cụ thể thắc mắc, tình trạng da hoặc mã đơn hàng của bạn..."
                      className="w-full p-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-rose-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {isLoading ? (
                      "Đang gửi tin nhắn..."
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Gửi lời nhắn ngay
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
