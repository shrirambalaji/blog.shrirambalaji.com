---
title: "What is SMTP?"
description: "Learning about SMTP, and playing around with a simple python smtp server"
publishDate: "Feb 18 2021"
tags: ["smtp", "python"]
---

![pexels-element-digital-1550334.jpg](https://cdn.hashnode.com/res/hashnode/image/upload/v1613589560115/gHMf1-dN2.jpeg)

Recently, while reading upon mailboxes I was intrigued about the SMTP protocol, and tried to understand how it works.

## The Simple Mail Transfer Protocol

The Simple Mail Transfer protocol is responsible for sending email from a sender's email address to a recepient, by connecting through multiple [MTAs](https://en.wikipedia.org/wiki/Message_transfer_agent) in order to find the right mailbox to transfer email to.

Since SMTP is a client-based protocol, it uses DNS to find the right IP to send emails to.

## Playing around with a simple SMTP Server

We can use the following python command to create a simple SMTP server on port `2525`.

```bash
$ sudo python3 -m smtpd -n -c DebuggingServer localhost:2525
```

The command doesn't return any output once the server is started.

Now we use telnet to connect to the SMTP server using the command:

```bash
$ telnet localhost 2525
```

```bash
Trying ::1...
Connected to localhost.
Escape character is '^]'.
220 pop-os.localdomain Python SMTP proxy version 0.3
HELO shrirambalaji.dev
250 pop-os.localdomain
MAIL FROM: hello@shrirambalaji.dev
250 OK
RCPT TO: shrirambalaji1996@gmail.com
250 OK
DATA
354 End data with <CR><LF>.<CR><LF>
Hello World from SMTP!
.
250 OK


```

- The `HELO` command is responsible for letting the SMTP server know that an email message is incoming
- The `MAIL FROM` command mentions the sender's mail address.
- The `RCPT TO` command mentions the receiver's mail address.
- The `DATA` command refers to ASCII encoded data, that is going to follow it and needs to be **terminated** by an empty line and a .(dot) which is what the ` End data with <CR><LF>.<CR><LF>` is.
- Similar to HTTP, 2XX status codes are positive 3xx codes are positive intermediate, 4XX are negative.
- Particularly `220` refers to `<domain> Service Ready`, `250` refers to `requested mail action okay, completed`. The list of all status codes can be found [here](https://en.wikipedia.org/wiki/List_of_SMTP_server_return_codes).
