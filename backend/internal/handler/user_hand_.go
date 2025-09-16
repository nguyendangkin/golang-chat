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

func (uh *UserHandler) Ping(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"message": "pong",
	})

}

func (uh *UserHandler) Register(c *gin.Context) {
	var request dto.RegisterRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		validationErrors := utils.ParseValidationErrors(err)
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Dữ liệu không hợp lệ",
			"errors":  validationErrors,
			"code":    http.StatusBadRequest,
		})
		return
	}

	if request.Password != request.ConfirmPassword {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Dữ liệu không hợp lệ",
			"errors": []map[string]string{
				{
					"field":   "confirmPassword",
					"message": "Mật khẩu không khớp",
				},
			},
			"code": http.StatusBadRequest,
		})
		return
	}

	if err := uh.userService.Register(request.Email, request.Password); err != nil {

		c.JSON(http.StatusConflict, gin.H{
			"code": http.StatusConflict,
			"errors": []map[string]string{
				{
					"field":   "email",
					"message": err.Error(),
				},
			},
			"message": "Dữ liệu không hợp lệ",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"code":    http.StatusOK,
		"message": "Đăng ký thành công. Vui lòng kiểm tra Email",
	})
}

func (uh *UserHandler) VerifyCode(c *gin.Context) {
	var request dto.VerifyCodeRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		validationErrors := utils.ParseValidationErrors(err)
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Dữ liệu không hợp lệ",
			"errors":  validationErrors,
			"code":    http.StatusBadRequest,
		})
	}
}
