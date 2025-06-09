#! /bin/sh
 
echo "!!==start setup=="
 
sed -i '/myhostname = /d' /etc/postfix/main.cf
sed -i '/mydestination = /d' /etc/postfix/main.cf
 
echo 'myhostname = localhost' >> /etc/postfix/main.cf
echo 'mydomain = localhost' >> /etc/postfix/main.cf
echo 'mydestination = localhost.localdomain, locahost' >> /etc/postfix/main.cf
 
systemctl enable postfix
systemctl reload postfix
systemctl start postfix
 
systemctl daemon-reload
service postfix start
 
echo "==end setup=="
