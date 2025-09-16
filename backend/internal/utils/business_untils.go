package utils

import (
	"crypto/rand"
	"fmt"
	"math/big"
)

func GenerateCode6Digits() (string, error) {
	// giới hạn từ 0 đến 999999
	n, err := rand.Int(rand.Reader, big.NewInt(1000000))
	if err != nil {
		return "", err
	}

	// đảm bảo luôn có 6 chữ số (thêm số 0 ở đầu nếu thiếu)
	return fmt.Sprintf("%06d", n.Int64()), nil
}
