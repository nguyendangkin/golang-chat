package utils

import (
	"fmt"
	"strings"

	"github.com/go-playground/validator/v10"
)

// Struct chuẩn hóa lỗi trả về
type ValidationError struct {
	Field   string `json:"field"`
	Message string `json:"message"`
}

// Map ánh xạ field trong code -> tên hiển thị tiếng Việt
var fieldMap = map[string]string{
	"email":           "Email",
	"password":        "Mật khẩu",
	"confirmPassword": "Xác nhận mật khẩu",
}

// Map ánh xạ rule -> template lỗi
var messageMap = map[string]string{
	"required": "%s là bắt buộc",
	"email":    "%s không đúng định dạng email",
	"min":      "%s phải có ít nhất %s ký tự",
}

// ParseValidationErrors chuyển lỗi của validator thành slice ValidationError
func ParseValidationErrors(err error) []ValidationError {
	var validationErrors []ValidationError

	if valueErrors, ok := err.(validator.ValidationErrors); ok {
		for _, valueError := range valueErrors {
			validationErrors = append(validationErrors, ValidationError{
				Field:   getFieldName(valueError.Field()),
				Message: getErrorMessage(valueError),
			})
		}
	}

	return validationErrors
}

// đổi field từ struct sang label tiếng Việt
func getFieldName(field string) string {
	// Chuyển chữ cái đầu sang thường (vd: "Password" -> "password")
	field = strings.ToLower(field[:1]) + field[1:]

	if fieldNewName, exists := fieldMap[field]; exists {
		return fieldNewName
	}
	return field
}

// buildErrorMessage xây dựng thông báo lỗi thân thiện
func getErrorMessage(valueError validator.FieldError) string {
	fieldName := getFieldName(valueError.Field())
	tag := valueError.Tag()

	newMessage, ok := messageMap[tag]
	if !ok {
		return fmt.Sprintf("%s không hợp lệ", fieldName)
	}

	switch tag {
	case "required", "email":
		return fmt.Sprintf(newMessage, fieldName)
	case "min":
		return fmt.Sprintf(newMessage, fieldName, valueError.Param())
	default:
		return fmt.Sprintf(newMessage, fieldName)
	}
}
