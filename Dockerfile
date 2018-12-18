
FROM ubuntu:16.04

WORKDIR /api

RUN apt-get update

RUN apt install curl -y

RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -

RUN apt install nodejs -y

RUN apt-get install wget -y

RUN wget https://releases.hashicorp.com/terraform/0.11.10/terraform_0.11.10_linux_amd64.zip

RUN apt-get install unzip -y

RUN unzip terraform_0.11.10_linux_amd64.zip

RUN mv terraform /usr/local/bin/

COPY . .

RUN npm install

CMD ["node","app.js"]

