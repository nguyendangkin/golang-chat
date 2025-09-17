package handler

import (
	"net/http"
	"prompt/internal/dto"
	"prompt/internal/service"
	"prompt/internal/utils"

	"github.com/gin-gonic/gin"
)

type UserHandler struct {
	userService *service.UserService
}

func NewUserHandler(userService *service.UserService) *UserHandler {
	return &UserHandler{
		userService: userService,
	}
}

func (uh *UserHandler) Register(c *gin.Context) {
	var request dto.RegisterRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		validationErrors := utils.ParseValidationErrors(err)
		c.JSON(http.StatusBadRequest, gin.H{
			"errors": validationErrors,
		})
		return
	}

	if request.Password != request.ConfirmPassword {
		c.JSON(http.StatusBadRequest, gin.H{
			"errors": []map[string]string{
				{
					"field":   "confirmPassword",
					"message": "Mật khẩu không khớp",
				},
			},
		})
		return
	}

	if err := uh.userService.Register(request.Email, request.Password); err != nil {

		c.JSON(http.StatusConflict, gin.H{
			"errors": []map[string]string{
				{
					"field":   "email",
					"message": err.Error(),
				},
			},
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Đăng ký thành công. Vui lòng kiểm tra Email",
	})
}

func (uh *UserHandler) VerifyCode(c *gin.Context) {
	var request dto.VerifyCodeRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		validationErrors := utils.ParseValidationErrors(err)
		c.JSON(http.StatusBadRequest, gin.H{
			"errors": validationErrors,
		})
		return
	}

	if err := uh.userService.VerifyCode(request.Email, request.Code); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Xác thực thành công",
	})
}

func (uh *UserHandler) ResendVerifyCode(c *gin.Context) {
	var request dto.ResendVerifyCodeRequest

	if err := c.ShouldBindJSON(&request); err != nil {
		validationErrors := utils.ParseValidationErrors(err)
		c.JSON(http.StatusBadRequest, gin.H{
			"errors": validationErrors,
		})
		return
	}

	if err := uh.userService.ResendVerifyCode(request.Email); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Vui lòng kiểm tra lại Email",
	})

}
