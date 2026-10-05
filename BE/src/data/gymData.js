/**
 * Dữ liệu phòng gym được trích xuất từ frontend để inject vào system prompt cho AI.
 * Đây là nguồn dữ liệu duy nhất — AI sẽ không bịa thêm thông tin ngoài phạm vi này.
 */

export const GYM_DATA = {
  name: 'FitAI Gym',

  plans: [
    {
      id: 'monthly',
      name: 'Gói Tháng',
      price: '350.000đ/tháng',
      features: [
        'Tập tự do toàn bộ thiết bị',
        'Tham gia lớp nhóm (Yoga, Zumba…)',
        'Tủ đồ & phòng tắm tiêu chuẩn',
        'AI Workout gợi ý bài tập cơ bản',
      ],
      notIncluded: ['AI Coach cá nhân hóa chuyên sâu', 'Nutrition Plan cá nhân'],
    },
    {
      id: 'yearly',
      name: 'Gói Năm',
      price: '2.990.000đ/năm (~249.000đ/tháng, tiết kiệm 29%)',
      features: [
        'Tất cả quyền lợi Gói Tháng',
        'Lớp nhóm không giới hạn',
        'Ưu tiên đặt lịch & khung giờ cao điểm',
        'AI Workout gợi ý bài tập nâng cao',
        'Báo cáo tiến độ hàng tháng',
      ],
      notIncluded: ['AI Coach cá nhân hóa chuyên sâu'],
    },
    {
      id: 'ai-coach',
      name: 'Gói AI Coach (Tập tại nhà)',
      price: '199.000đ/tháng',
      features: [
        'AI Coach hướng dẫn tập realtime',
        'Kế hoạch tập không cần thiết bị',
        'Nutrition Plan & theo dõi calo',
        'Thư viện 500+ bài tập video HD',
        'Nhắc lịch & động viên từ AI',
        'Apple Health & Google Fit',
      ],
    },
  ],

  payment: ['Thẻ ngân hàng', 'Ví điện tử (Momo, ZaloPay)', 'Chuyển khoản'],

  faq: [
    {
      q: 'AI Coach khác gì so với AI Chatbot của gói Free?',
      a: 'AI Chatbot ở gói Free trả lời câu hỏi chung. AI Coach ở gói Premium hiểu mục tiêu, thể trạng riêng để dựng Workout Plan và Nutrition Plan cá nhân hóa, và điều chỉnh theo tiến độ thực tế.',
    },
    {
      q: 'Tôi có thể đổi gói tập bất cứ lúc nào không?',
      a: 'Có. Bạn có thể nâng cấp hoặc hạ cấp gói tập bất cứ lúc nào, thay đổi có hiệu lực từ kỳ thanh toán tiếp theo.',
    },
    {
      q: 'Tôi mới bắt đầu tập gym, FitAI có phù hợp không?',
      a: 'Hoàn toàn phù hợp. AI Coach sẽ hỏi về kinh nghiệm của bạn và xây dựng lộ trình phù hợp cho người mới bắt đầu.',
    },
  ],

  // Dữ liệu chưa có trong DB — AI sẽ không cung cấp thông tin này mà thay vào đó khuyến nghị liên hệ trực tiếp
  notAvailable: ['Lịch mở cửa cụ thể', 'Địa chỉ chi nhánh', 'Chính sách hoàn tiền chi tiết'],
}

/**
 * Tạo context string để inject vào system prompt.
 */
export function buildGymContext() {
  const { name, plans, payment, faq, notAvailable } = GYM_DATA

  const plansSummary = plans
    .map(
      (p) =>
        `- **${p.name}**: ${p.price}\n  Bao gồm: ${p.features.join(', ')}` +
        (p.notIncluded ? `\n  Không bao gồm: ${p.notIncluded.join(', ')}` : ''),
    )
    .join('\n')

  const faqSummary = faq.map((f) => `- Hỏi: ${f.q}\n  Đáp: ${f.a}`).join('\n')

  return `
=== DỮ LIỆU PHÒNG GYM: ${name} ===

CÁC GÓI TẬP & GIÁ:
${plansSummary}

HÌNH THỨC THANH TOÁN: ${payment.join(', ')}

FAQ:
${faqSummary}

LƯU Ý: Các thông tin sau chưa có trong hệ thống (không được bịa):
${notAvailable.map((x) => `- ${x}`).join('\n')}
`
}
