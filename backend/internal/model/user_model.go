package model

import "time"

type User struct {
	ID         uint       `gorm:"primaryKey"`
	Email      string     `gorm:"unique;not null"`
	Password   string     `gorm:"not null"`
	Role       string     `gorm:"not null;default:'user'"`
	CodeExpiry *time.Time `gorm:"default:null"`
	CodeActive *string    `gorm:"default:null"`
	IsActive   bool       `gorm:"not null;default:false"`
	CreatedAt  time.Time
	UpdatedAt  time.Time
}
