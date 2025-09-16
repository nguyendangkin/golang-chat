package service

import (
	"errors"
	"prompt/internal/model"
	"prompt/internal/repository"
	"prompt/internal/utils"
	"time"

	"golang.org/x/crypto/bcrypt"
)

type UserService struct {
	repo *repository.UserRepository
}

func NewUserService(repo *repository.UserRepository) *UserService {
	return &UserService{
		repo: repo,
	}
}

func (us *UserService) Register(email, password string) error {
	// check email
	existing, err := us.repo.FindByEmail(email)

	if err != nil {
		return err
	}

	if existing != nil {
		return errors.New("Email đã tồn tại") //lint:ignore ST1005 - Giữ nguyên format
	}

	// hash password
	hashed, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	// create code
	code, err := utils.GenerateCode6Digits()
	if err != nil {
		return err
	}

	expiry := time.Now().Add(time.Minute * 5)

	// create entity
	user := &model.User{
		Email:      email,
		Password:   string(hashed),
		Role:       "user",
		IsActive:   false,
		CodeActive: &code,
		CodeExpiry: &expiry,
	}

	// create
	if err := us.repo.Create(user); err != nil {
		return err
	}

	// send email
	emailData := EmailData{
		ToEmail:      email,
		Subject:      "Xác thực tài khoản",
		TemplatePath: "internal/email_templates/auth_template.html",
		TemplateData: map[string]string{
			"Name": email,
			"Code": code,
		},
	}
	SendEmail(emailData)

	return nil
}

func (us *UserService) VerifyCode(email, code string) error {
	// check email có tồn tại chưa
	user, err := us.repo.FindByEmail(email)

	if err != nil {
		return err
	}
	if user == nil {
		return errors.New("Email không tồn tại") //lint:ignore ST1005 - Giữ nguyên format
	}

	// email đã kích hoạt rồi?
	if user.IsActive {
		return errors.New("Email đã được kích hoạt") //lint:ignore ST1005 - Giữ nguyên format
	}

	// check hết hạn code
	if user.CodeExpiry.Before(time.Now()) {
		return errors.New("Mã xác thực đã hết hạn") //lint:ignore ST1005 - Giữ nguyên format
	}

	// check mã xác thực không đúng
	if *user.CodeActive != code {
		return errors.New("Mã xác thực không đúng") //lint:ignore ST1005 - Giữ nguyên format
	}

	// entity
	updates := map[string]interface{}{
		"is_active":   true,
		"code_active": nil,
		"code_expiry": nil,
	}

	// updates
	if err := us.repo.UpdateFields(user.ID, updates); err != nil {
		return err
	}

	return nil

}
