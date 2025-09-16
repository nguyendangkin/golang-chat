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
	if existing, _ := us.repo.FindByEmail(email); existing != nil {

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

	// create entity
	user := &model.User{
		Email:      email,
		Password:   string(hashed),
		Role:       "user",
		IsActive:   false,
		CodeActive: code,
		CodeExpiry: time.Now().Add(time.Minute * 5),
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
