package repository

import (
	"errors"
	"prompt/internal/model"

	"gorm.io/gorm"
)

type UserRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) *UserRepository {
	return &UserRepository{
		db: db,
	}
}

func (ur *UserRepository) Create(user *model.User) error {
	return ur.db.Create(user).Error
}

func (ur *UserRepository) UpdateFields(userId uint, fields map[string]interface{}) error {
	return ur.db.Model(&model.User{}).Where("id = ?", userId).Updates(fields).Error
}

func (ur *UserRepository) FindByEmail(email string) (*model.User, error) {
	var user model.User
	err := ur.db.Where("email = ?", email).First(&user).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}

	return &user, nil
}
