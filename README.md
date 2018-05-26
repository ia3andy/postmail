# Environments:

Email subject (Optional, default: "[POSTMAIL]"):
```bash
$ export SUBJECT = "[POSTMAIL]"
```

Allow only one origin to send request (endsWith):
```bash
$ export ALLOW_ORIGIN = "mydomain.com"
```

Only the email service gmail is available for now:

GMail email (used as source email):
```bash
$ export TRANSPORTER_EMAIL = "bobby@gmail.com"
```

GMail application password (Activate 2F Authentication):
```bash
$ export TRANSPORTER_PASSWORD = "app_password"
```

Destination email:
```bash
$ export DESTINATION_EMAIL = "tom@gmail.com"
```
