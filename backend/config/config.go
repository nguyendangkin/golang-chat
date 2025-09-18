package config

import (
	"fmt"
	"log"
	"prompt/internal/model"

	"github.com/spf13/viper"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type Config struct {
	Server struct {
		Port int
	}
	Database struct {
		Host     string
		Port     int
		User     string
		Password string
		Name     string
	}
	EmailService struct {
		EmailAddress  string
		EmailPassword string
	}
	Auth struct {
		SecretKey string
	}
}

func LoadConfig() *Config {
	viper.SetConfigName("config")
	viper.SetConfigType("yaml")
	viper.AddConfigPath("./config")
	err := viper.ReadInConfig()
	if err != nil {
		log.Fatalf("error loading config file: %v", err)
	}

	var config Config
	err = viper.Unmarshal(&config)
	if err != nil {
		log.Fatalf("error unmarshaling config: %v", err)
	}

	return &config
}

func ConnectDatabase(config *Config) *gorm.DB {
	dsn := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable TimeZone=Asia/Ho_Chi_Minh",
		config.Database.Host, config.Database.Port, config.Database.User, config.Database.Password, config.Database.Name,
	)
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("error connecting to database: %v", err)
	}
	log.Println("connected to database")

	// auto migrate
	if err := db.AutoMigrate(&model.User{}); err != nil {
		log.Fatalf("error migrating database: %v", err)
	}

	return db
}
