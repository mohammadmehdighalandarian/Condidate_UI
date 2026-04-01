FROM art.behsacorp.com:5000/docker/docker/channel/infra/nginx:1.29.4

COPY /dist/candidate-admin-panel /usr/share/nginx/html 
COPY /default.conf /etc/nginx/nginx.conf
# COPY /default.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080 
# RUN apk update
# RUN apk add curl
RUN chmod 777 -R /usr/share/nginx/html/assets/env/env.js
RUN chmod 777 -R /var/cache/nginx
RUN chmod 777 -R /var/run

CMD ["/bin/sh",  "-c",  "envsubst < /usr/share/nginx/html/assets/env/env.template.js > /usr/share/nginx/html/assets/env/env.js && exec nginx -g 'daemon off;'"]

