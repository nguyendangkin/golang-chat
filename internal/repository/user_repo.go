package repository

import (
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

func (ur *UserRepository) FindByEmail(email string) (*model.User, error) {
	var user model.User
	if err := ur.db.Where("email = ?", email).First(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}
