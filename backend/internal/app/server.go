package app

import (
	"fmt"
	"prompt/config"
)

func Run() {
	conf := config.LoadConfig()
	db := config.ConnectDatabase(conf)

	r := router(db)
	port := fmt.Sprintf(":%d", conf.Server.Port)

	r.Run(port)
}
