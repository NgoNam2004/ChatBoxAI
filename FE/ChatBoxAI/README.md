# FitAI Gym — Homepage

Trang chủ (Homepage) hoàn chỉnh cho website phòng gym hiện đại có AI Coach, xây dựng bằng React + Vite + Tailwind CSS + Framer Motion.

## Công nghệ  

- **React 18** + **Vite** 
- **Tailwind CSS** 
- **Framer Motion** 
- **React Router** 
- **lucide-react**

## Cách chạy dự án

```bash
# 1. Cài dependencies
npm install

# 2. Chạy dev server 
npm run dev

# 3. Build production
npm run build

# 4. Xem thử bản build
npm run preview
```
## Cấu trúc thư mục
```
fitai-gym/
├── index.html
├── package.json
├── tailwind.config.js       # màu brand, font, gradient tùy chỉnh
├── postcss.config.js
├── vite.config.js
├── src/
│   ├── main.jsx             # entry point + React Router setup
│   ├── App.jsx              # ráp toàn bộ section của trang chủ
│   ├── ThemeContext.jsx     # context cho dark mode toggle
│   ├── index.css            # Tailwind directives + smooth scroll
│   └── components/
│       ├── Header.jsx         # sticky header, menu, ngôn ngữ, dark mode
│       ├── Hero.jsx           # hero full-width + floating stats
│       ├── Membership.jsx     # 3 gói tập Free / Basic / Premium
│       ├── AICoach.jsx        # highlight AI Coach + mock chat + chart
│       ├── Features.jsx       # grid 6 tính năng nổi bật
│       ├── Locations.jsx      # bản đồ placeholder + danh sách chi nhánh
│       ├── HowItWorks.jsx     # quy trình 4 bước
│       ├── Testimonials.jsx   # đánh giá hội viên
│       ├── FAQ.jsx            # accordion câu hỏi thường gặp
│       ├── FinalCTA.jsx       # banner CTA cuối trang
│       ├── Footer.jsx         # footer đầy đủ links + social
│       └── ChatbotButton.jsx  # nút chat AI nổi góc phải, có mini chat UI
```

## Branding

- Tên: **FitAI Gym**
- Slogan: "Gym thông minh – AI Coach đồng hành"
- Màu chủ đạo: Primary `#0EA5E9` / `#0284C7` (xanh sky-cyan), Accent `#F97316` (cam), Dark `#0F172A`
- Font: **Space Grotesk** (display/heading) + **Inter** (body)
