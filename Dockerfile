FROM ubuntu:18.04

# COPY build/java_policy /etc
# RUN sed -E -i -e 's/(archive|ports).ubuntu.com/mirrors.aliyun.com/g' -e '/security.ubuntu.com/d' /etc/apt/sources.list
# ENV DEBIAN_FRONTEND=noninteractive

RUN buildDeps='software-properties-common git libtool cmake python-dev python3-pip python-pip libseccomp-dev curl' && \
    apt-get update && apt-get install -y python python3 python-pkg-resources python3-pkg-resources $buildDeps && \
    add-apt-repository ppa:openjdk-r/ppa && add-apt-repository ppa:longsleep/golang-backports && \
    add-apt-repository ppa:ubuntu-toolchain-r/test && \
    curl -fsSL https://deb.nodesource.com/setup_14.x | bash - && \
    apt-get update && apt-get install -y golang-go openjdk-11-jdk nodejs gcc-9 g++-9 && \
    update-alternatives --install  /usr/bin/gcc gcc /usr/bin/gcc-9 40 && \
    update-alternatives --install  /usr/bin/g++ g++ /usr/bin/g++-9 40 && \
    cd /tmp && git clone https://github.com/cranemont/Judger && cd Judger && \
    mkdir build && cd build && cmake .. && make && make install && \
    apt-get purge -y --auto-remove $buildDeps && \
    apt-get clean && rm -rf /var/lib/apt/lists/* && \
    mkdir -p /code && \
    useradd -u 12001 compiler && useradd -u 12002 code && useradd -u 12003 spj && usermod -a -G code spj
ADD server /code
# ADD package.json /code
RUN cd /code && npm install && \
    mkdir compile
# HEALTHCHECK --interval=5s --retries=3 CMD python3 /code/service.py

WORKDIR /code
EXPOSE 3000
ENTRYPOINT ["/code/entrypoint.sh"]