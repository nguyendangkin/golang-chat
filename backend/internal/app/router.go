package app

import (
	"net/http"
	"prompt/internal/handler"
	"prompt/internal/middleware"
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
	authMiddleware := middleware.AuthMiddleware(userService)

	publicRoutes := r.Group("/api/v1")
	publicRoutes.POST("/register", userHandler.Register)
	publicRoutes.POST("/verify-code", userHandler.VerifyCode)
	publicRoutes.POST("/resend-verify-code", userHandler.ResendVerifyCode)
	publicRoutes.POST("/login", authMiddleware.LoginHandler)

	// route cần jwt
	protectedRoutes := r.Group("/api/v1")
	protectedRoutes.Use(authMiddleware.MiddlewareFunc())
	{
		protectedRoutes.GET("me", func(c *gin.Context) {
			c.String(http.StatusOK, "protected")
		})
	}

	return r
}
