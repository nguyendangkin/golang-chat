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
var fieldLabels = map[string]string{
	"email":           "Email",
	"password":        "Mật khẩu",
	"confirmPassword": "Xác nhận mật khẩu",
}

// Map ánh xạ rule -> template lỗi
var validationMessages = map[string]string{
	"required": "%s là bắt buộc",
	"email":    "%s không đúng định dạng email",
	"min":      "%s phải có ít nhất %s ký tự",
}

// ParseValidationErrors chuyển lỗi của validator thành slice ValidationError
func ParseValidationErrors(err error) []ValidationError {
	var result []ValidationError

	if ve, ok := err.(validator.ValidationErrors); ok {
		for _, fe := range ve { // fe = field error
			result = append(result, ValidationError{
				Field:   mapFieldName(fe.Field()),
				Message: buildErrorMessage(fe),
			})
		}
	}

	return result
}

// mapFieldName đổi field từ struct sang label tiếng Việt
func mapFieldName(field string) string {
	// Chuyển chữ cái đầu sang thường (vd: "Password" -> "password")
	field = strings.ToLower(field[:1]) + field[1:]

	if label, exists := fieldLabels[field]; exists {
		return label
	}
	return field
}

// buildErrorMessage xây dựng thông báo lỗi thân thiện
func buildErrorMessage(fe validator.FieldError) string {
	fieldName := mapFieldName(fe.Field())
	tag := fe.Tag()

	template, ok := validationMessages[tag]
	if !ok {
		return fmt.Sprintf("%s không hợp lệ", fieldName)
	}

	switch tag {
	case "required", "email":
		return fmt.Sprintf(template, fieldName)
	case "min":
		return fmt.Sprintf(template, fieldName, fe.Param())
	default:
		return fmt.Sprintf(template, fieldName)
	}
}
