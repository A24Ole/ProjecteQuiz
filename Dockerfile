FROM php:8.2-apache

RUN apt-get update && apt-get install -y unzip git zip \
    && curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

WORKDIR /var/www/html

COPY src/ /var/www/html/

EXPOSE 80

CMD ["apache2-foreground"]
