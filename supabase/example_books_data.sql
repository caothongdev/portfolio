-- Example Books Data for Testing
-- Insert these into your Supabase books table after running migration

INSERT INTO books (
  title,
  author,
  category,
  slug,
  summary,
  content,
  tags,
  rating,
  key_takeaways,
  cover_image,
  published,
  reading_date
) VALUES
(
  'Show Your Work!',
  'Austin Kleon',
  'Self-help',
  'show-your-work',
  '10 cách để chia sẻ sự sáng tạo và được mọi người biết đến. Cuốn sách "gối đầu giường" cho bất kỳ ai muốn tồn tại trong kỷ nguyên số.',
  '<h2>Giới thiệu</h2><p>Austin Kleon, tác giả của cuốn "Steal Like An Artist" đình đám, tiếp tục mang đến một tác phẩm gây sốt khác: Show Your Work! Cuốn sách này không chỉ là một hướng dẫn marketing cho nghệ sĩ mà còn là một tuyên ngôn về cách sống và làm việc trong thời đại số.</p><h2>Nội dung chính</h2><p>Cuốn sách chia thành 10 chương, mỗi chương là một nguyên tắc vàng giúp bạn chia sẻ công việc của mình một cách hiệu quả nhất.</p>',
  ARRAY['creativity', 'marketing', 'personal-brand', 'sharing'],
  5,
  ARRAY[
    'Không cần phải là thiên tài - Hãy tìm một cộng đồng (scenius) thay vì cố gắng làm thiên tài đơn độc',
    'Tư duy quá trình, không phải thành phẩm - Khán giả muốn thấy cách bạn làm ra nó',
    'Chia sẻ điều nhỏ bé mỗi ngày - Đừng chờ đợi tác phẩm lớn',
    'Mở cửa kho báu kỳ thú - Chia sẻ những gì truyền cảm hứng cho bạn',
    'Kể những câu chuyện hay - Tác phẩm không tự lên tiếng',
    'Dạy lại những gì bạn biết - Dạy học tạo ra sự kết nối và uy tín',
    'Đừng biến thành Spam - Hãy là người đóng góp, không phải kẻ quảng cáo',
    'Học cách chịu đấm - Quen với việc bị chỉ trích',
    'Bán nghệ thuật - Đừng ngại kiếm tiền từ đam mê',
    'Kiên trì bám trụ - Cuộc chơi là đường dài'
  ],
  'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1404204732i/18290401.jpg',
  true,
  '2024-01-15'
),
(
  'Atomic Habits',
  'James Clear',
  'Self-help',
  'atomic-habits',
  'Hướng dẫn xây dựng thói quen tốt, loại bỏ thói quen xấu và làm chủ những hành động nhỏ bé đem lại kết quả phi thường.',
  '<h2>Tại sao thói quen lại quan trọng?</h2><p>Thói quen là những hành động tự động mà chúng ta lặp lại hàng ngày. Nếu bạn muốn thay đổi cuộc đời, hãy bắt đầu từ việc thay đổi thói quen.</p><h2>4 Quy luật của thói quen</h2><ol><li>Make it Obvious (Làm rõ ràng)</li><li>Make it Attractive (Làm hấp dẫn)</li><li>Make it Easy (Làm dễ dàng)</li><li>Make it Satisfying (Làm thỏa mãn)</li></ol>',
  ARRAY['habits', 'productivity', 'self-improvement'],
  5,
  ARRAY[
    'Thay đổi 1% mỗi ngày sẽ tốt hơn 37 lần sau 1 năm',
    'Tập trung vào hệ thống, không phải mục tiêu',
    'Môi trường quan trọng hơn động lực',
    'Identity-based habits: Thay đổi WHO you are, không phải WHAT you do'
  ],
  'https://m.media-amazon.com/images/I/51Tlm0GZTXL.jpg',
  true,
  '2024-02-20'
),
(
  'Deep Work',
  'Cal Newport',
  'Productivity',
  'deep-work',
  'Trong thời đại phân tâm, khả năng tập trung sâu (deep work) là siêu năng lực hiếm có và cực kỳ có giá trị.',
  '<h2>Deep Work là gì?</h2><p>Deep Work là khả năng tập trung không bị phân tâm vào một nhiệm vụ đòi hỏi nhận thức cao. Đây là kỹ năng hiếm và quý giá trong nền kinh tế hiện đại.</p><h2>Tại sao Deep Work quan trọng?</h2><p>Trong khi mọi người đang mải mê với email, social media, meeting vô bổ, bạn có thể tạo ra giá trị thực sự bằng cách đào sâu vào công việc quan trọng.</p>',
  ARRAY['productivity', 'focus', 'career'],
  5,
  ARRAY[
    'Deep Work = Thời gian x Cường độ tập trung',
    'Loại bỏ "Shallow Work" - những công việc không tạo ra giá trị',
    'Xây dựng "Attention Residue" - Hậu quả của việc chuyển task liên tục',
    'Schedule mọi phút trong ngày để tránh lãng phí thời gian'
  ],
  'https://m.media-amazon.com/images/I/41gVN8Ms+pL.jpg',
  true,
  '2023-11-10'
);
