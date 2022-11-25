#! /bin/sh
#
# sshd.sh -- fire up sshd in an atlas container

mkdir -p /run/sshd
chmod 0755 /run/sshd

exec /usr/sbin/sshd -D
