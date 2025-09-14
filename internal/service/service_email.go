package service

import (
	"html/template"
	"prompt/config"

	"github.com/wneessen/go-mail"
)

type EmailData struct {
	ToEmail      string
	Subject      string
	TemplatePath string
	TemplateData interface{}
}

func SendEmail(data EmailData) error {
	// get config
	cfg := config.LoadConfig()

	// create new a message
	m := mail.NewMsg()
	if err := m.From(cfg.EmailService.EmailAddress); err != nil {
		return err
	}
	if err := m.To(data.ToEmail); err != nil {
		return err
	}
	m.Subject(data.Subject)

	// load template file form path
	tpl, err := template.ParseFiles(data.TemplatePath)
	if err != nil {
		return err
	}

	if data.TemplateData != nil {
		// set html template
		if err := m.SetBodyHTMLTemplate(tpl, data.TemplateData); err != nil {
			return err
		}
	} else {
		// nếu không có template thì dùng plain text
		if str, ok := data.TemplateData.(string); ok {
			m.SetBodyString(mail.TypeTextPlain, str)
		} else {
			m.SetBodyString(mail.TypeTextPlain, "")
		}
	}

	// new a client
	c, err := mail.NewClient("smtp.gmail.com",
		mail.WithPort(587),
		mail.WithSMTPAuth(mail.SMTPAuthPlain),
		mail.WithTLSPolicy(mail.TLSMandatory),
		mail.WithUsername(cfg.EmailService.EmailAddress),
		mail.WithPassword(cfg.EmailService.EmailPassword),
	)
	if err != nil {
		return err
	}

	// send email
	return c.DialAndSend(m)
}
