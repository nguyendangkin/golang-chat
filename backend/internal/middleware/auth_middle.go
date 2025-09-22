package middleware

import (
	"errors"
	"log"
	"net/http"
	"prompt/config"
	"prompt/internal/dto"
	"prompt/internal/model"
	"prompt/internal/service"
	"time"

	jwt "github.com/appleboy/gin-jwt/v2"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

var identityKey = "id"

var ErrInactive = errors.New("user is inactive")
var ErrTokenRefreshExpired = errors.New("token is expired")
var ErrTokenExpired = errors.New("Token is expired") //lint:ignore ST1005 - Giữ nguyên format

func AuthMiddleware(us *service.UserService) *jwt.GinJWTMiddleware {
	cfg := config.LoadConfig()

	authMiddleware, err := jwt.New(&jwt.GinJWTMiddleware{
		Realm:       "All Zone",
		Key:         []byte(cfg.Auth.SecretKey),
		Timeout:     time.Second * 30,
		MaxRefresh:  time.Minute * 1,
		IdentityKey: identityKey,
		PayloadFunc: payloadFunc(),

		IdentityHandler: identityHandler(us),
		Authenticator:   authenticator(us),
		Authorizator:    authorizator(),
		Unauthorized:    unauthorized(),
		TokenLookup:     "header: Authorization, query: token, cookie: jwt",
		// TokenLookup: "query:token",
		// TokenLookup: "cookie:token",
		TokenHeadName: "Bearer",
		TimeFunc:      time.Now,
	})

	if err != nil {
		log.Fatal("JWT Error:" + err.Error())
	}
	return authMiddleware

}

// 2
func payloadFunc() func(data interface{}) jwt.MapClaims {
	return func(data interface{}) jwt.MapClaims {
		if v, ok := data.(*model.User); ok {
			return jwt.MapClaims{
				identityKey: v.ID,
				"email":     v.Email,
				"role":      v.Role,
			}
		}
		return jwt.MapClaims{}
	}
}

// >1
func identityHandler(us *service.UserService) func(c *gin.Context) interface{} {
	return func(c *gin.Context) interface{} {
		claims := jwt.ExtractClaims(c)
		id, ok := claims[identityKey].(float64)
		if !ok {
			return nil
		}

		user, err := us.GetUserByID(uint(id))
		if err != nil {
			return nil
		}
		return user

	}
}

// 1
func authenticator(us *service.UserService) func(c *gin.Context) (interface{}, error) {
	return func(c *gin.Context) (interface{}, error) {
		var loginVals dto.LoginRequest
		if err := c.ShouldBind(&loginVals); err != nil {
			return "", jwt.ErrMissingLoginValues
		}

		user, err := us.GetUserByEmail(loginVals.Email)
		if err != nil || user == nil {
			return nil, jwt.ErrFailedAuthentication
		}

		// check user active?
		if !user.IsActive {
			return nil, ErrInactive
		}

		// check pass
		if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(loginVals.Password)); err != nil {
			return nil, jwt.ErrFailedAuthentication
		}

		return user, nil
	}
}

// > 2
func authorizator() func(data interface{}, c *gin.Context) bool {
	return func(data interface{}, c *gin.Context) bool {
		if _, ok := data.(*model.User); ok {
			return true
		}
		return false
	}
}

func unauthorized() func(c *gin.Context, code int, message string) {
	return func(c *gin.Context, code int, message string) {
		switch message {
		case ErrInactive.Error():
			c.JSON(http.StatusLocked, gin.H{
				"code":    http.StatusLocked,
				"message": message,
			})
			return
		case jwt.ErrFailedAuthentication.Error():
			c.JSON(http.StatusUnauthorized, gin.H{
				"code":    http.StatusUnauthorized,
				"message": "Email hoặc mật khẩu không đúng",
			})
			return
		case ErrTokenExpired.Error():
			c.JSON(http.StatusForbidden, gin.H{
				"code":    http.StatusForbidden,
				"message": "Token đã hết hạn",
			})
			return
		}

		c.JSON(code, gin.H{
			"code":    code,
			"message": message,
		})
	}
}
