package app

import (
	"prompt/internal/handler"
	"prompt/internal/repository"
	"prompt/internal/service"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func router(db *gorm.DB) *gin.Engine {
	r := gin.Default()

	// user routes
	userRepository := repository.NewUserRepository(db)
	userService := service.NewUserService(userRepository)
	userHandler := handler.NewUserHandler(userService)

	publicRoutes := r.Group("/api/v1")
	publicRoutes.GET("/ping", userHandler.Ping)
	publicRoutes.POST("/register", userHandler.Register)

	return r
}
