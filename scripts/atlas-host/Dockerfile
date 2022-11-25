# This creates a docker image that can run the ingest against an
# external Postgres instance.
# 

FROM ubuntu:20.04

#
# Required packages
#
RUN yes | unminimize
RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y \
        build-essential \
        ca-certificates \
        curl \
        dnsutils \
        git \
        gnupg \
        iputils-ping \
        jq \
        man \
        net-tools \
        openssh-client \
        openssh-server \
        telnet \
        traceroute \
        unzip \
        vim

#
# Install Go
#
RUN cd /tmp && \
    curl --location https://go.dev/dl/go1.18.3.linux-amd64.tar.gz -o go1.18.3.linux-amd64.tar.gz && \
    tar -C /usr/local -xzf go1.18.3.linux-amd64.tar.gz && \
    rm go1.18.3.linux-amd64.tar.gz

#
# Install aws CLI
#
RUN cd /tmp && \
    curl https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip -o /tmp/awscliv2.zip && \
    unzip awscliv2.zip && \
    aws/install && \
    rm -rf aws awscliv2.zip

#
# Install AWS session manager plugin
#
RUN cd /tmp && \
    curl https://s3.amazonaws.com/session-manager-downloads/plugin/latest/ubuntu_64bit/session-manager-plugin.deb \
        -o session-manager-plugin.deb && \
    dpkg -i session-manager-plugin.deb

#
# Install postgres for the CLIs
#
RUN cd /tmp && \
    curl https://www.postgresql.org/media/keys/ACCC4CF8.asc -o ACCC4CF8.asc && \
    gpg --dearmor < ACCC4CF8.asc > /etc/apt/trusted.gpg.d/apt.postgresql.org.gpg && \
    rm ACCC4CF8.asc && \
    apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y lsb-release && \
    echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list && \
    apt-get update && \
    yes | DEBIAN_FRONTEND=noninteractive apt-get install postgresql-14

#
# Create user accounts
# echo 'export PATH=$PATH:/usr/local/go/bin:/usr/lib/postgresql/14/bin' >> /home/dl/.profile
RUN ln -s /data/dl /home/dl && \
    ln -s /data/pm /home/pm && \
    ln -s /data/va /home/va && \
    groupadd --gid 2000 atlas && \
    groupadd --gid 2001 dl && \
    groupadd --gid 2002 pm && \
    groupadd --gid 2003 va && \
    useradd \
        --uid 2001 \
        --gid 2001 \
	--groups atlas \
        --comment 'daniel' \
        --home-dir /home/dl \
        --shell /bin/bash \
        dl && \
    useradd \
        --uid 2002 \
        --gid 2002 \
        --groups atlas \
        --comment 'pete' \
        --home-dir /home/pm \
        --shell /bin/bash \
        pm && \
    useradd \
        --uid 2003 \
        --gid 2003 \
        --groups atlas \
        --comment 'viv' \
        --home-dir /home/va \
        --shell /bin/bash \
        va

#
# Install and configure sudo
#
RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y sudo && \
    echo "%atlas ALL=(ALL) NOPASSWD: ALL" > /etc/sudoers.d/atlas

#
# Install sshd.sh as the container init script
#
COPY sshd.sh /usr/local/etc/sshd.sh
RUN chmod 0755 /usr/local/etc/sshd.sh
