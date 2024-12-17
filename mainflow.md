ĐỀ 3:  Xây dựng một ứng dụng website cho quy trình cấp hộ chiếu lần đầu
	Mô tả chung quy trình cấp hộ chiếu lần đầu
 
## Thông tin để người sử dụng đăng ký cấp hộ chiếu bao gồm (Họ và tên, địa chỉ thường trú, phái, CMND, điện thoại, email).
## step1:  (XT)  Thông tin này sẽ được người đăng ký điền vào form online, nộp cho bộ phận xác thực (XT) và được lưu vào Passport data.

## step2 Bộ phận này sau khi đối chiếu và kiểm chứng thông tin như CMND, hộ khẩu, …(giả sử các thông tin liên quan đến người đăng ký 
##       dùng để đối chiếu này được lưu trữ trong một database chung gọi là Resident Data) sẽ gửi các yêu cầu đăng ký này cho bộ phận xét duyệt (XD). 

## step3: (XD) Các yêu cầu đăng ký sau khi được phê duyệt sẽ được gửi đến bộ phận lưu trữ (LT) và thông báo kết quả cho người đăng ký.
## step full:  Song song đó bộ phận giám sát (GS) chịu trách nhiệm theo dõi và giám sát các hoạt động trên.

•	[XT] được quyền xem thông tin từ form đăng ký và thông tin liên quan đến người đăng ký (Resident Database)
•	[XD] có quyền xem tất cả các thông tin quy định cấp hộ chiếu và chỉ được xem thông tin trên form đăng ký. Không được xem thông tin trong Resident Database. 
•	[LT] chỉ được xem các thông tin được phê duyệt (đồng ý hay không đồng ý cấp hộ chiếu) nhưng không xem được thông tin cá nhân và các dữ liệu liên quan khác.
•	[GS] giám sát tất cả các hoạt động của các user thuộc các nhóm: [XT], [XD], [LT] từ khi gửi yêu cầu cấp hộ chiếu đến khi nhận kết quả.
	Ghi chú
•	Dữ liệu mẫu cho quy trình này SV tự thiết kế và nộp kèm theo kết quả xây dựng được.
•	SV phải sử dụng các kỹ thuật bảo mật trong nội dung thực hành hoặc là các công nghệ khác liên quan đến bảo mật cơ sở dữ liệu hay được hỗ trợ bởi hệ quản trị cơ sở dữ liệu  để hiện thực các chính sách và yêu cầu cho quy trình trên.
